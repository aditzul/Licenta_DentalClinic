import { MatDialog } from '@angular/material/dialog';
import { AppointmentDialogComponent } from '../appointment-dialog/appointment-dialog.component';
import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { CalendarEvent, CalendarView, DAYS_OF_WEEK, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { addDays, isSameMonth, isSameDay, differenceInMinutes, format } from 'date-fns';
import { formatDate, registerLocaleData } from '@angular/common';
import localeRo from '@angular/common/locales/ro';
import { Output, EventEmitter } from '@angular/core';
registerLocaleData(localeRo);
import { Injectable } from '@angular/core';
import { CalendarEventTitleFormatter } from 'angular-calendar';
import { WeekViewHourSegment } from 'calendar-utils';
import { addMinutes } from 'date-fns';
import { AppointmentService } from '../_services/appointment.service';import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from '../_services/authentication.service';
import { Role } from '../_models/user';
import { Appointment } from '../_models/appointment';
import { switchMap } from 'rxjs/operators';

function floorToNearest(amount: number, precision: number) {
  return Math.floor(amount / precision) * precision;
}

function ceilToNearest(amount: number, precision: number) {
  return Math.ceil(amount / precision) * precision;
}

@Injectable()
export class CustomEventTitleFormatter extends CalendarEventTitleFormatter {
  private formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`;
    } else {
      return `${remainingMinutes}m`;
    }
  }

  override weekTooltip(event: CalendarEvent, title: string): string {
    if (event.meta.tmpEvent) {
      const start = event.start as Date;
      const end = event.end as Date;
      const duration = differenceInMinutes(end, start);

      return `Start: ${format(start, 'HH:mm')} - End: ${format(end, 'HH:mm')} - Duration: ${this.formatDuration(duration)}`;
    }

    return super.weekTooltip(event, title) || '';
  }

  override dayTooltip(event: CalendarEvent, title: string): string {
    if (event.meta.tmpEvent) {
      const start = event.start as Date;
      const end = event.end as Date;
      const duration = differenceInMinutes(end, start);

      return `Start: ${format(start, 'HH:mm')} - End: ${format(end, 'HH:mm')} - Duration: ${this.formatDuration(duration)}`;
    }

    return super.dayTooltip(event, title) || '';
  }
}

@Component({
  selector: 'app-page-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppointmentsComponent implements OnInit {
  isAdd: boolean = true;
  lastAppointmentID: number | undefined; // Assuming ID is a number
  
  constructor(
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private appointmentService: AppointmentService,
    private snackBar: MatSnackBar,
    private authService: AuthenticationService,
    
  ) {}

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    const user = this.authService.userValue;
  
    if (user) {
      if (user.role === Role.Admin) {
        // If the user's role is Admin
        this.appointmentService.getAllAppointments().subscribe(
          (appointments: any[]) => {
            this.events = appointments.map((appointment) => this.mapAppointmentToEvent(appointment));
            this.refresh();
          },
          (error) => {
            console.error('Error fetching appointments:', error);
            this.snackBar.open('Error fetching appointments.', 'close', {
              duration: 2000,
              panelClass: 'errorSnack',
            });
          }
        );
      } else if (user.role === Role.Medic) {
        // If the user's role is Medic and user.ID is defined
        if (user.id !== undefined) {
          this.appointmentService.getAllAppointmentsByMedicID(user.id).subscribe(
            (appointments: any[]) => {
              this.events = appointments.map((appointment) => this.mapAppointmentToEvent(appointment));
              this.refresh();
            },
            (error) => {
              console.error('Error fetching appointments for medic:', error);
              this.snackBar.open('Error fetching appointments for medic.', 'close', {
                duration: 2000,
                panelClass: 'errorSnack',
              });
            }
          );
        }
      }
    }
  }
  
  // Function to map appointment data to a CalendarEvent
  private mapAppointmentToEvent(appointment: any): CalendarEvent {

    let primaryColor = '';

    switch (appointment.meta) {
      case 'In asteptare':
        primaryColor = '#ffc107';
        break;
      case 'Confirmat':
        primaryColor = '#198754';
        break;
      case 'Anulat':
        primaryColor = '#dc3545';
        break;
    }

    return {
      id: appointment.id,
      title: appointment.title,
      start: new Date(appointment.start),
      end: new Date(appointment.end),
      draggable: true,
      resizable: {
        beforeStart: false,
        afterEnd: true,
      },
      meta: appointment.meta,
      color: {
        primary: '#212529',
        secondary: primaryColor,
        secondaryText: '#f8f9fa',
      },
    };
  }

  activeDayIsOpen: boolean = true;
  dragToCreateActive: boolean | undefined;

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  view: CalendarView = CalendarView.Week;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  hourSegments = 2;
  startHour = 8;
  endHour = 17;
  selectedView: string = '';
  weekStartsOn: number = DAYS_OF_WEEK.MONDAY;
  weekendDays: number[] = [DAYS_OF_WEEK.SATURDAY, DAYS_OF_WEEK.SUNDAY];
  excludeDays: number[] = this.weekendDays;
  locale: string = 'ro';
  formattedDate: string | undefined;

  @Output() viewChange = new EventEmitter<CalendarView>();

  @Output() viewDateChange = new EventEmitter<Date>();

  startDragToCreate(segment: WeekViewHourSegment, mouseDownEvent: MouseEvent, segmentElement: HTMLElement) {
    const segmentPosition = segmentElement.getBoundingClientRect();
    const tooltipElement = document.createElement('div');
    tooltipElement.classList.add('custom-tooltip');
    document.body.appendChild(tooltipElement);
  
    let start = segment.date;
    let end = addMinutes(segment.date, 30);
  
    const updateCustomTooltip = (start: Date, end: Date) => {
      const duration = differenceInMinutes(end, start);
      const tooltipContent = `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')} (${duration}) mins`;
      tooltipElement.textContent = tooltipContent;
    };
  
    const moveTooltipWithMouse = (event: MouseEvent) => {
      tooltipElement.style.left = event.clientX + 'px';
      tooltipElement.style.top = event.clientY + 'px';
    };
  
    const handleMouseMove = (event: MouseEvent) => {
      const mouseMoveEvent = event;
  
      const minutesDiff = ceilToNearest(mouseMoveEvent.clientY - segmentPosition.top, 30);
      const daysDiff = floorToNearest(mouseMoveEvent.clientX - segmentPosition.left, segmentPosition.width) / segmentPosition.width;
      const newEnd = addDays(addMinutes(start, minutesDiff), daysDiff);
  
      // Check if the new end date is on the same day as the start date
      if (!isSameDay(start, newEnd)) {
        return; // Prevent further updates
      }
  
      end = newEnd;
  
      updateCustomTooltip(start, end);
      moveTooltipWithMouse(mouseMoveEvent);
      this.refresh();
  };
  
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('contextmenu', preventContextMenu);
  
      this.openAppointmentDialog(start, end);
      document.body.removeChild(tooltipElement); // Remove the custom tooltip when dragging is finished
      this.dragToCreateActive = false;
      this.refresh();
    };
  
    const preventContextMenu = (event: Event) => {
      event.preventDefault();
    };
  
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('contextmenu', preventContextMenu);
  
    this.dragToCreateActive = true;
    updateCustomTooltip(start, end);
  
    // Initially position the tooltip
    moveTooltipWithMouse(mouseDownEvent);
  
    this.refresh();
  }  
  
  openAppointmentDialog(start: Date, end: Date, isAdd: boolean = true): void {
    const dialogRef = this.dialog.open(AppointmentDialogComponent, {
      width: '30%',
      data: {
        startTime: formatDate(start, 'HH:mm', this.locale),
        endTime: formatDate(end, 'HH:mm', this.locale),
        startDate: formatDate(start, 'yyyy-MM-dd', this.locale),
        endDate: formatDate(end, 'yyyy-MM-dd', this.locale),
        eventStart: start,
        eventEnd: end,
        isAdd: isAdd,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveCalendarEventDialog(result);
      }
    });
  }
  
  saveCalendarEventDialog(dialogData: any): void {
    const start = dialogData.start;
    const end = dialogData.end;
    const title = dialogData.title;
    const meta = dialogData.meta;
    const patienT_ID = dialogData.patienT_ID;
    const mediC_ID = dialogData.mediC_ID;
  
    let primaryColor = '';

    switch (meta) {
      case 'In asteptare':
        primaryColor = '#ffc107';
        break;
      case 'Confirmat':
        primaryColor = '#198754';
        break;
      case 'Anulat':
        primaryColor = '#dc3545';
        break;
    }

    this.appointmentService.getLastAppointmentID().subscribe(
      (lastAppointmentID: number) => {
        console.log('Last appointment ID:', lastAppointmentID); // Log the response
  
        const newEvent: CalendarEvent = {
          id: lastAppointmentID + 1,
          title: title,
          start: start,
          end: end,
          draggable: true,
          resizable: {
            beforeStart: false,
            afterEnd: true,
          },
          meta: meta,
          color: {
            primary: '#212529',
            secondary: primaryColor,
            secondaryText: '#f8f9fa',
          },
        };
  
        console.log(newEvent);
  
        // Add the appointment to the database
        this.appointmentService.addAppointment({
          start: start,
          end: end,
          title: title,
          meta: meta,
          patienT_ID: patienT_ID,
          mediC_ID: mediC_ID,
        }).subscribe(
          (response) => {
            console.log('Appointment added successfully:', response);
            this.events = [...this.events, newEvent];
            this.refresh();
          },
          (error) => {
            console.error('Error adding appointment:', error);
            this.snackBar.open('Error adding appointment.', 'close', {
              duration: 2000,
              panelClass: 'errorSnack',
            });
          }
        );
      },
      (error) => {
        console.error('Error fetching last appointment ID:', error); // Log errors
      }
    );
  }  

  public refresh() {
    this.events = [...this.events];
    this.cdr.detectChanges();
  }

  validateEventTimesChanged = ({ event, newStart, newEnd, allDay }: CalendarEventTimesChangedEvent, addCssClass = true) => {
    if (event.allDay) {
      return true;
    }

    delete event.cssClass;

    // provide default values for newStart and newEnd
    newStart = newStart || new Date();
    newEnd = newEnd || new Date();

    // don't allow dragging or resizing events to different days
    const sameDay = isSameDay(newStart, newEnd);

    if (!sameDay) {
      return false;
    }

    // don't allow dragging events to the same times as other events
    const overlappingEvent = this.events.find((otherEvent: any) => {
      return (
        otherEvent !== event &&
        !otherEvent.allDay &&
        ((otherEvent.start < newStart && newStart < otherEvent.end) || (newEnd !== undefined && otherEvent.start < newEnd && newStart < otherEvent.end))
      );
    });

    if (overlappingEvent) {
      console.log('overlapping');
      if (addCssClass) {
        console.log('added css class');
        event.cssClass = 'invalid-position';
      } else {
        return false;
      }
    }

    return true;
  };

  eventTimesChanged(eventTimesChangedEvent: CalendarEventTimesChangedEvent): void {
    if (this.validateEventTimesChanged(eventTimesChangedEvent)) {
      const { event, newStart, newEnd } = eventTimesChangedEvent;
      event.start = newStart;
      event.end = newEnd;

      // Update the appointment in the database
      this.updateDatabaseAppointment(event);

      this.refresh();
    }
  }

  updateDatabaseAppointment(event: CalendarEvent): void {
    const { id, start, end } = event;
    // Ensure that id is always a number
    const appointmentId: number = id as number;
  
    // Assuming you have an 'id' property on your CalendarEvent that corresponds to the appointmentId
    this.appointmentService.updateAppointment(appointmentId, { start, end }).subscribe(
      (response) => {
        console.log('Appointment updated successfully:', response);
        // Optionally, perform any actions after the appointment is updated in the database
        this.refresh();
      },
      (error) => {
        console.error('Error updating appointment:', error);
        // Optionally, display an error message to the user
        this.snackBar.open('Error updating appointment.', 'close', {
          duration: 2000,
          panelClass: 'errorSnack',
        });
      }
    );
  }

  eventClicked({ event }: { event: CalendarEvent }): void {
    this.isAdd = false; // Set isAdd to false when an existing event is clicked
    // Check if event.start and event.end are defined before passing them to the function
    if (event.start && event.end) {
      this.openAppointmentDialog(event.start, event.end, this.isAdd);
    } else {
      console.error('Event start or end is undefined');
    }
  }
  
  getLastAppointmentID(): void {
    this.appointmentService.getLastAppointmentID().subscribe(
      (lastAppointmentID: number) => {
        console.log('Last appointment ID:', lastAppointmentID); // Log the response
        // You may assign the last appointment ID to a component variable if needed
        this.lastAppointmentID = lastAppointmentID;
      },
      (error) => {
        console.error('Error fetching last appointment ID:', error); // Log errors
      }
    );
  }  
  
  deleteAppointment(): void {
    // Implement the logic to delete the appointment
  }

  changeDay(date: Date) {
    this.viewDate = date;
    this.view = CalendarView.Day;
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  changeView(view: CalendarView) {
    this.view = view;
  }
}
