import { Component } from '@angular/core';

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss']
})
export class StudentDashboardComponent {
  studentMenu = [
  { label: '📚 Borrow Book', route: 'borrow' },
  { label: '🕓 View History', route: 'history' },
  { label: '🧡 Wishlist', route: 'wishlist' }
  // Add more in future
];

}
