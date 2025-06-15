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

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {path: 'dashboard', component: DashboardComponent, canActivate: [authGuard]},
  //{path: 'librarian-dashboard', component: LibrarianDashboardComponent, canActivate: [authGuard]},
  //{path: 'student-dashboard', component: StudentDashboardComponent, canActivate: [authGuard]},

  { path: 'student-dashboard', component: StudentDashboardComponent, canActivate: [authGuard] },
{ path: 'student/borrow', component: BorrowComponent, canActivate: [authGuard] },
{ path: 'student/history', component: HistoryComponent, canActivate: [authGuard] },

{ path: 'librarian-dashboard', component: LibrarianDashboardComponent, canActivate: [authGuard] },
{ path: 'librarian/requests', component: BorrowRequestsComponent, canActivate: [authGuard] },

  { path: 'books', component: BookComponent, canActivate: [authGuard] }, 
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' }

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
