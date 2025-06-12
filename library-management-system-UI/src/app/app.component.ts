import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
   constructor(private auth: AuthService, private router: Router) {}
   ngOnInit() {
    if (this.auth.autoLogin()) {
      this.router.navigate(['/dashboard']);
    }
  }
  title = 'library-management-system-UI';
}
