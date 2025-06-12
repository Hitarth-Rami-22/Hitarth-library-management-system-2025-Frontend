import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
form = { fullName: '', email: '', password: '', userType: 'Student' };
  message = '';
  error = '';

  slideshowImages = [
    'assets/images/library_image.jpg',
    'assets/images/library_image2.jpg',
    'assets/images/library_image3.jpg',
    'assets/images/library_image4.jpeg',
    'assets/images/library_image5.webp',
  ];
  currentImageIndex = 0;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.slideshowImages.length;
    }, 3000); // change image every 3s
  }

  register() {
    this.error = '';
    this.message = '';
    
    const hasWhitespace = (val: string) => val.trim().length !== val.length;

    // Trim values
    const fullName = this.form.fullName.trim();
    const email = this.form.email.trim();
    const password = this.form.password.trim();

    // Basic validation
    if (!fullName || !email || !password) {
      this.error = 'All fields are required.';
      return;
    }

    if (!this.form.fullName || !this.form.email || !this.form.password) {
      this.error = 'All fields are required.';
      return;
    }
    if (hasWhitespace(this.form.fullName) || hasWhitespace(this.form.email)) {
      this.error = 'Leading/trailing whitespaces are not allowed.';
      return;
    }
     // Submit form with trimmed values
    const trimmedForm = {
      fullName,
      email,
      password,
      userType: this.form.userType
    };

    // if (!this.form.fullName.trim() || !this.form.email.trim() || !this.form.password.trim()) {
    //   this.error = 'All fields must be filled without leading/trailing spaces.';
    //   return;
    // }

    this.auth.register(this.form).subscribe({
      next: (res: any) => {
        this.message = res.message || 'Register successful🥳!';
        this.message = res.message;
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) =>{
         // Check for user-exists error
      if (
        typeof err.error === 'string' &&
        (err.error.toLowerCase().includes('user already exists') ||
         err.error.toLowerCase().includes('email already exists'))
      ) {
        this.error = 'Email is already registered. Please use a different one.';
      } else {
        this.error = 'Registration failed. Please try again.';
      }
    }
    });
  }
}
