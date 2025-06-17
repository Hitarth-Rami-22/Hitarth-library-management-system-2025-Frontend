import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/shared/token-storage/token-storage.service';

@Component({
  selector: 'app-student-sidebar-layout',
  templateUrl: './student-sidebar-layout.component.html',
  styleUrls: ['./student-sidebar-layout.component.scss']
})
export class StudentSidebarLayoutComponent {

  @Input() menuItems: { label: string, route: string }[] = [];

  constructor(private tokenService: TokenStorageService, private router: Router) {}

  logout() {
    this.tokenService.clear();
    this.router.navigate(['/login']);
  }
}
