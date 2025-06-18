import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './admin/dashboard/dashboard/dashboard.component';
import { authGuard } from './auth/auth.guard';
import { BookComponent } from './book/book/book/book.component';
import { LibrarianDashboardComponent } from './librarian/dashboard/librarian-dashboard/librarian-dashboard.component';
import { StudentDashboardComponent } from './student/dashboard/student-dashboard/student-dashboard.component';  
import { BorrowComponent } from './student/borrow/borrow/borrow.component';
import { HistoryComponent } from './student/history/history/history.component';
import { BorrowRequestsComponent } from './librarian/dashboard/borrow-requests/borrow-requests/borrow-requests.component';
import { ReturnRequestsComponent } from './student/student-book-request/return-requests/return-requests.component';
import { adminGuard } from './admin/auth-admin/admin.guard';
import { ReturnApprovalsComponent } from './librarian/dashboard/return-approvals/return-approvals/return-approvals.component';
import { WishlistComponent } from './student/wishlist/wishlist/wishlist/wishlist.component';
import { NotificationsComponent } from './student/notifications/notifications/notifications.component';
import { PenaltyListComponent } from './student/penalty-list/penalty-list/penalty-list.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  
  { path: 'dashboard', component: DashboardComponent, canActivate: [adminGuard] },

  { path: 'student-dashboard', component: StudentDashboardComponent, canActivate: [authGuard],
    children: [
    { path: '', redirectTo: 'borrow', pathMatch: 'full' },
    { path: 'borrow', component: BorrowComponent },
    { path: 'history', component: HistoryComponent },
    { path: 'return-requests', component: ReturnRequestsComponent },
    { path: 'notifications', component: NotificationsComponent },
    { path: 'penalties', component: PenaltyListComponent },
  ]
   },

{ path: 'student/history', component: HistoryComponent, canActivate: [authGuard] },

{ path: 'librarian-dashboard', component: LibrarianDashboardComponent, canActivate: [authGuard],
  children: [
    { path: '', redirectTo: 'requests', pathMatch: 'full' },
    { path: 'requests', component: BorrowRequestsComponent },
    { path: 'return-approvals',component: ReturnApprovalsComponent},
    { path: 'penalties', component: PenaltyListComponent },
  ]
 },

  { path: 'books', component: BookComponent, canActivate: [authGuard] }, 
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
