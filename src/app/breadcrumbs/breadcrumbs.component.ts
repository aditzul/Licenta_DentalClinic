import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, switchMap, first } from 'rxjs/operators';

interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
})
export class BreadcrumbsComponent implements OnInit {
  breadcrumbs: Breadcrumb[] | undefined = [];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.route),
        switchMap((route: ActivatedRoute) => this.resolveBreadcrumbs(route))
      )
      .subscribe((breadcrumbs: any) => {
        this.breadcrumbs = breadcrumbs;
      });

    this.resolveBreadcrumbs(this.route).then(
      (breadcrumbs: Breadcrumb[] | undefined) =>
        (this.breadcrumbs = breadcrumbs)
    );
  }

  resolveBreadcrumbs(route: ActivatedRoute): Promise<Breadcrumb[] | undefined> {
    // console.log(route.snapshot);
    route.url.subscribe((data) => {
      console.log(this.router.url);
    });
    
    return route.data
      .pipe(
        first(),
        switchMap((resolvedData: any) => {
          if (resolvedData && resolvedData.breadcrumb) {
            const breadcrumb: Breadcrumb = {
              label: resolvedData.breadcrumb,
              url: this.createUrl(route),
            };
            return Promise.resolve([breadcrumb]);
          } else {
            return Promise.resolve([]);
          }
        }),
        switchMap((breadcrumbs: Breadcrumb[]) => {
          if (route.firstChild) {
            return this.resolveBreadcrumbs(route.firstChild).then(
              (childBreadcrumbs: Breadcrumb[] | undefined) => {
                if (childBreadcrumbs?.length && childBreadcrumbs?.length > 0) {
                  const breadcrumb: Breadcrumb = {
                    label: route.routeConfig?.data?.breadcrumb || '',
                    url: this.createUrl(route),
                  };
                  return [breadcrumb, ...childBreadcrumbs];
                } else {
                  return [];
                }
              }
            );
          } else {
            return Promise.resolve(breadcrumbs);
          }
        })
      )
      .toPromise();
  }

  createUrl(route: ActivatedRoute): string {
    const urlSegments = route.pathFromRoot
      .map((r: ActivatedRoute) =>
        r.snapshot.url.map((segment) => segment.toString())
      )
      .reduce((prev, curr) => prev.concat(curr));

    return `/${urlSegments.join('/')}`;
  }
}
