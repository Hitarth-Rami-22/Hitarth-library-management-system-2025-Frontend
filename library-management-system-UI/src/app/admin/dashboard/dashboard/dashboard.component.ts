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
  registerMsg = '';
  showForm: boolean = false; // 🔹 Controls Add User form visibility


    newUser = {
    fullName: '',
    email: '',
    password: '',
    userType: 'Librarian'
};

  constructor(private adminService: AdminService, private tokenService: TokenStorageService, private router: Router) {}

  registerUser() {
  this.adminService.registerUser(this.newUser).subscribe({
    next: (res: any) => {
      this.registerMsg = res.message || 'User registered';
      this.newUser = { fullName: '', email: '', password: '', userType: 'Librarian' };
      this.loadUsers(); // Refresh user list
      this.showForm = false; // 🔹 Auto close form on success

      
    },
    error: (err) => {
      alert('Failed to register user');
      console.error(err);
    }
  });
}

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
  validateEmail(email: string): boolean {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}
closeForm() {
  this.showForm = false;
}
countByRole(role: string): number {
  return this.users.filter(u => u.userType === role).length;
}


  logout() {
  this.tokenService.clear();
  this.router.navigate(['/login']);
}

}
