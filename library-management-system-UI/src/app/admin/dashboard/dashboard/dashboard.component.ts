import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/admin/service/admin.service';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/shared/token-storage/token-storage.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

   users: any[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.adminService.getAllUsers().subscribe({
      next: (res: any) => {
        this.users = res;
      },
      error: () => alert('Failed to load users.')
    });
  }

  toggleBlock(user: any) {
    const newStatus = !user.isBlocked;
    this.adminService.updateUserStatus(user.id, newStatus).subscribe({
      next: () => {
        user.isBlocked = newStatus;
      },
      error: () => alert('Failed to update status.')
    });
  }

  toggleLibrarian(user: any) {
    const isLibrarian = user.userType === 'Librarian';
    const updatedRole = !isLibrarian;
    this.adminService.updateUserRole(user.id, updatedRole).subscribe({
      next: () => {
        user.userType = updatedRole ? 'Librarian' : 'Student';
      },
      error: () => alert('Failed to update role.')
    });
  }
}
