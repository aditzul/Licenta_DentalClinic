import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-simple-card',
  templateUrl: './simple-card.component.html',
  styleUrls: ['./simple-card.component.scss'],
})
export class SimpleCardComponent {
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() icon: string = '';
  @Input() classes: string = '';

  constructor() {}
}
