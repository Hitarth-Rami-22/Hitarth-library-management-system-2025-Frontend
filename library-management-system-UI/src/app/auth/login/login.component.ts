import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TokenStorageService } from 'src/app/shared/token-storage/token-storage.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
 form = { email: '', password: '' };
 userList: any[] = [];
 message = '';  // success message
 error = '';    // error message
  constructor(
    private auth: AuthService,
    private router: Router,
    private tokenStore: TokenStorageService
  ) {}

  
  ngOnInit(): void {
    this.auth.getAdminsAndLibrarians().subscribe({
      next: (res: any) => this.userList = res,
      error: (err) => console.error('Failed to load users', err)
    });
     // Auto-login logic
    if (this.tokenStore.getToken()) {
      this.router.navigate(['/dashboard']);
    return;
    }
  }
    isFieldInvalid(value: string): boolean {
    return !value || value.trim() === '';
  }

  // login() {
  //     this.message = '';
  //   this.error = '';

  //   if (this.isFieldInvalid(this.form.email) || this.isFieldInvalid(this.form.password)) {
  //     this.error = 'Email and password cannot be empty or whitespace.';
  //     return;
  //   }

  //   this.auth.login(this.form).subscribe({
  //     next: (res: any) => {
  //       this.tokenStore.saveToken(res.token);
  //       this.message = '✅ Login successful! Redirecting to dashboard...';
  //       setTimeout(() => {
  //         this.router.navigate(['/dashboard']);
  //          }, 1500);
  //     },
  //     error: (err) => {
  //        this.error = 'Login failed: ' + ('Invalid credentials');
  //         const errorMsg = err.error || 'Login failed. Please try again.';
  //         //alert(errorMsg); // You can improve this with a toast/snackbar
  //     }
  //   });
  // }
  login() {
  this.message = '';
  this.error = '';

  // Validation: Empty or whitespace check
  if (this.isFieldInvalid(this.form.email) || this.isFieldInvalid(this.form.password)) {
    this.error = 'Email and password cannot be empty or whitespace.';
    return;
  }

  this.auth.login(this.form).subscribe({
    next: (res: any) => {
      this.tokenStore.saveToken(res.token);
      this.message = '✅ Login successful! Redirecting to dashboard...';

      const role = this.tokenStore.getUserRole(); // Assumes role is stored in token or decoded by tokenStore

      // Slight delay for user to see the success message
      setTimeout(() => {
        if (role === 'Admin') {
          this.router.navigate(['/dashboard']);
        } else if (role === 'Librarian') {
          this.router.navigate(['/librarian-dashboard']);
        } else if (role === 'Student') {
          this.router.navigate(['/student-dashboard']);
        } else {
          this.error = 'Invalid role.';
        }
      }, 1500);
    },
    error: (err) => {
      this.error = 'Login failed: Invalid credentials';
      const errorMsg = err.error || 'Login failed. Please try again.';
      // Optional improvement: show errorMsg in a toast/snackbar
    }
  });
}

}
