import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/admin/service/admin.service';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/shared/token-storage/token-storage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  registerMsg = '';
  showForm = false;
  
  newUser = {
    fullName: '',
    email: '',
    password: '',
    userType: 'Librarian'
  };

  constructor(
    private adminService: AdminService,
    private tokenService: TokenStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.adminService.getAllUsers().subscribe({
      next: (res: any) => {
        this.users = res;
        this.filteredUsers = [...this.users];
      },
      error: () => alert('Failed to load users.')
    });
  }

  filterUsers(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.filteredUsers = this.users.filter(user => 
      user.fullName.toLowerCase().includes(searchTerm) || 
      user.email.toLowerCase().includes(searchTerm)
    );
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

  registerUser() {
    this.adminService.registerUser(this.newUser).subscribe({
      next: (res: any) => {
        this.registerMsg = res.message || 'User registered successfully!';
        this.newUser = { fullName: '', email: '', password: '', userType: 'Librarian' };
        this.loadUsers();
        setTimeout(() => this.closeForm(), 1500);
      },
      error: (err) => {
        this.registerMsg = err.error?.message || 'Failed to register user';
      }
    });
  }

  validateEmail(email: string): boolean {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email);
  }

  closeForm() {
    this.showForm = false;
    this.registerMsg = '';
  }

  countByRole(role: string | number): number {
    return this.users.filter(u => u.userType === role).length;
  }

  logout() {
    this.tokenService.clear();
    this.router.navigate(['/login']);
  }
}