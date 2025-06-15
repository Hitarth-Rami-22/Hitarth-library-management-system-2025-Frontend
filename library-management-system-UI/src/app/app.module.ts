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
    BorrowRequestsComponent

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
