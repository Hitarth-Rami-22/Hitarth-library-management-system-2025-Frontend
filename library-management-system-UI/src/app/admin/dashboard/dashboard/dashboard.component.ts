import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/admin/service/admin.service';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/shared/token-storage/token-storage.service';
import { BorrowServiceService } from 'src/app/student/borrow-service/borrow-service.service';
import { BookServiceService } from 'src/app/book/book/book/book-service/book-service.service';
import { PenaltyServiceService } from 'src/app/student/penalty-service/penalty-service.service';

interface Toast { id: number; message: string; type: 'success' | 'error' | 'info'; }

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  // User Management
  users: any[] = [];
  filteredUsers: any[] = [];
  isLoading = true;
  showDrawer = false;
  activeFilter = 'All';
  searchTerm = '';
  submitting = false;
  newUser = { fullName: '', email: '', password: '', userType: 'Librarian' };
  filterOptions = ['All', 'Student', 'Librarian', 'Admin', 'Blocked'];

  // Hero / Stats
  adminName: string = 'Admin';
  greeting: string = 'Good Morning';
  currentDate: string = '';
  totalBooks: number = 0;
  totalBorrows: number = 0;
  pendingBorrows: number = 0;
  returnsPending: number = 0;
  outstandingPenalty: number = 0;
  statsLoading = true;

  // Recent registrations (last 5 users)
  recentUsers: any[] = [];

  // Toasts
  toasts: Toast[] = [];
  private toastId = 0;

  quickLinks = [
    { label: 'Manage Users',     icon: 'users',  color: 'indigo', desc: 'Add, block, and manage user roles',        action: 'scroll' },
    { label: 'Manage Books',     icon: 'book',   color: 'blue',   desc: 'Add, edit or remove books from library',  route: '/books' },
    { label: 'Borrow Requests',  icon: 'inbox',  color: 'green',  desc: 'View all student borrow activity',        route: '/librarian-dashboard/requests' },
    { label: 'View Penalties',   icon: 'alert',  color: 'amber',  desc: 'Review and manage outstanding penalties', route: '/librarian-dashboard/penalties' },
  ];

  constructor(
    private adminService: AdminService,
    private tokenService: TokenStorageService,
    private borrowService: BorrowServiceService,
    private bookService: BookServiceService,
    private penaltyService: PenaltyServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setGreeting();
    try {
      const payload = this.tokenService.getTokenPayload();
      this.adminName = payload?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
        || payload?.['name'] || payload?.['unique_name'] || payload?.['email'] || 'Admin';
    } catch {}
    this.loadUsers();
    this.loadStats();
  }

  setGreeting(): void {
    const h = new Date().getHours();
    this.greeting = h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening';
    this.currentDate = new Date().toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
  }

  loadStats(): void {
    this.statsLoading = true;
    this.bookService.getAll().subscribe({
      next: (b: any) => { this.totalBooks = (b as any[]).length; },
      error: () => {}
    });
    this.penaltyService.getPenalties().subscribe({
      next: (data: any[]) => {
        this.outstandingPenalty = data.filter((p: any) => p.status !== 3).reduce((s: number, p: any) => s + (p.penaltyAmount || 0), 0);
      },
      error: () => {}
    });
    this.borrowService.getAllRequests().subscribe({
      next: (res: any[]) => {
        this.totalBorrows   = res.length;
        this.pendingBorrows = res.filter(r => r.status === 0).length;
        this.returnsPending = res.filter(r => r.status === 4).length;
        this.statsLoading   = false;
      },
      error: () => { this.statsLoading = false; }
    });
  }

  loadUsers(): void {
    this.isLoading = true;
    this.adminService.getAllUsers().subscribe({
      next: (res: any) => {
        this.users = res;
        this.recentUsers = [...res].slice(-5).reverse();
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => { this.showToast('Failed to load users.', 'error'); this.isLoading = false; }
    });
  }

  applyFilters(): void {
    let list = [...this.users];
    if (this.activeFilter === 'Blocked')        list = list.filter(u => u.isBlocked);
    else if (this.activeFilter !== 'All')        list = list.filter(u => u.userType === this.activeFilter);
    if (this.searchTerm.trim()) {
      const t = this.searchTerm.toLowerCase();
      list = list.filter(u => u.fullName.toLowerCase().includes(t) || u.email.toLowerCase().includes(t));
    }
    this.filteredUsers = list;
  }

  setFilter(f: string): void { this.activeFilter = f; this.applyFilters(); }

  filterUsers(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    this.applyFilters();
  }

  toggleBlock(user: any): void {
    const newStatus = !user.isBlocked;
    this.adminService.updateUserStatus(user.id, newStatus).subscribe({
      next: () => { user.isBlocked = newStatus; this.applyFilters(); this.showToast(`${user.fullName} ${newStatus ? 'blocked' : 'unblocked'}.`, 'success'); },
      error: () => this.showToast('Failed to update status.', 'error')
    });
  }

  toggleLibrarian(user: any): void {
    const isLib = user.userType === 'Librarian';
    this.adminService.updateUserRole(user.id, !isLib).subscribe({
      next: () => { user.userType = isLib ? 'Student' : 'Librarian'; this.applyFilters(); this.showToast(`${user.fullName} is now ${user.userType}.`, 'info'); },
      error: () => this.showToast('Failed to update role.', 'error')
    });
  }

  registerUser(): void {
    if (!this.newUser.fullName.trim() || !this.validateEmail(this.newUser.email) || this.newUser.password.length < 6) return;
    this.submitting = true;
    this.adminService.registerUser(this.newUser).subscribe({
      next: (res: any) => {
        this.showToast(res.message || 'User registered successfully!', 'success');
        this.newUser = { fullName: '', email: '', password: '', userType: 'Librarian' };
        this.loadUsers();
        this.submitting = false;
        setTimeout(() => this.closeDrawer(), 800);
      },
      error: (err) => { this.showToast(err.error?.message || 'Failed to register user.', 'error'); this.submitting = false; }
    });
  }

  handleQuickLink(link: any): void {
    if (link.action === 'scroll') {
      document.getElementById('users-section')?.scrollIntoView({ behavior: 'smooth' });
    } else if (link.route) {
      this.router.navigate([link.route]);
    }
  }

  validateEmail(email: string): boolean { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }
  openDrawer():  void { this.showDrawer = true; }
  closeDrawer(): void { this.showDrawer = false; this.newUser = { fullName: '', email: '', password: '', userType: 'Librarian' }; }

  countByRole(role: string):  number { return this.users.filter(u => u.userType === role).length; }
  countBlocked():             number { return this.users.filter(u => u.isBlocked).length; }
  countActive():              number { return this.users.filter(u => !u.isBlocked).length; }

  getRoleClass(role: string):  string { return { Student:'rp-student', Librarian:'rp-librarian', Admin:'rp-admin' }[role] || ''; }
  getRoleColor(role: string):  string { return { Student:'av-green', Librarian:'av-indigo', Admin:'av-violet' }[role] || 'av-indigo'; }
  getStatusText(s: number):   string { return ['Pending','Approved','Rejected','Returned','Return Req.'][s] ?? 'Unknown'; }
  getStatusClass(s: number):  string { return ['pill-amber','pill-green','pill-red','pill-blue','pill-violet'][s] ?? ''; }

  showToast(message: string, type: 'success' | 'error' | 'info'): void {
    const id = ++this.toastId;
    this.toasts.push({ id, message, type });
    setTimeout(() => this.toasts = this.toasts.filter(t => t.id !== id), 3500);
  }

  removeToast(id: number): void { this.toasts = this.toasts.filter(t => t.id !== id); }
  scrollToUsers(): void {
    document.getElementById('users-section')?.scrollIntoView({ behavior: 'smooth' });
  }

  logout(): void { this.tokenService.clear(); this.router.navigate(['/login']); }
}