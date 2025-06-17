import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './admin/dashboard/dashboard/dashboard.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
//import { AuthInterceptor } from 'src/app/shared/intercepter/auth.interceptor';
import { AuthInterceptor } from 'src/app/shared/intercepter/auth.interceptor';
import { BookComponent } from './book/book/book/book.component';
import { TokenStorageService } from './shared/token-storage/token-storage.service';
import { AuthService } from './auth/auth.service';
import { AdminService } from './admin/service/admin.service';
import { Router } from '@angular/router';
import { LibrarianDashboardComponent } from './librarian/dashboard/librarian-dashboard/librarian-dashboard.component';
import { StudentDashboardComponent } from './student/dashboard/student-dashboard/student-dashboard.component';
import { BorrowComponent } from './student/borrow/borrow/borrow.component';
import { HistoryComponent } from './student/history/history/history.component';
import { BorrowRequestsComponent } from './librarian/dashboard/borrow-requests/borrow-requests/borrow-requests.component';
import { SidebarLayoutComponent } from './shared/sidebar-layout/sidebar-layout/sidebar-layout.component';
import { ReturnRequestsComponent } from './student/student-book-request/return-requests/return-requests.component';
import { StudentSidebarLayoutComponent } from './student/sidebar-student-layout/student-sidebar-layout/student-sidebar-layout.component';
import { ReturnApprovalsComponent } from './librarian/dashboard/return-approvals/return-approvals/return-approvals.component';
import { WishlistComponent } from './student/wishlist/wishlist/wishlist/wishlist.component';
import { NotificationsComponent } from './student/notifications/notifications/notifications.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    BookComponent,
    LibrarianDashboardComponent,
    StudentDashboardComponent,
    BorrowComponent,
    HistoryComponent,
    BorrowRequestsComponent,
    SidebarLayoutComponent,
    ReturnRequestsComponent,
    StudentSidebarLayoutComponent,
    ReturnApprovalsComponent,
    WishlistComponent,
    NotificationsComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [
     { provide: HTTP_INTERCEPTORS, 
      useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
