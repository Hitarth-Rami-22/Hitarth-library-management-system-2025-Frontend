import { Component } from '@angular/core';

export interface NavigationItem {
  value: string;
  link: string;
}
@Component({
  selector: 'app-page-side-nav',
  templateUrl: './page-side-nav.component.html',
  styleUrls: ['./page-side-nav.component.scss']
})
export class PageSideNavComponent {
  panelName: string = 'Student Panel';
  navItems: NavigationItem[] = [];

  constructor(){
    this.navItems=[
      {value: 'View Books', link: '/view-books'},
      {value: 'My Order', link: '/my-order'},
    ]
  }
}
