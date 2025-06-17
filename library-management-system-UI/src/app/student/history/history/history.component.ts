// import { Component, OnInit } from '@angular/core';
// import { BorrowServiceService } from 'src/app/student/borrow-service/borrow-service.service';
// import { TokenStorageService } from 'src/app/shared/token-storage/token-storage.service';
// import { Router } from '@angular/router';
// @Component({
//   selector: 'app-history',
//   templateUrl: './history.component.html',
//   styleUrls: ['./history.component.scss']
// })
// export class HistoryComponent implements OnInit {
//   history: any[] = [];
//   studentId: number = 0;

//   constructor(private borrowServiceService: BorrowServiceService, private tokenStore: TokenStorageService) {}

//   // ngOnInit(): void {
//   //   const payload = this.tokenStore.getTokenPayload();
//   //   this.studentId = +payload.nameid;
//   //   this.loadHistory();
//   // }

//   // loadHistory() {
//   //   this.borrowService.getStudentRequests(this.studentId).subscribe({
//   //     next: (res: any) => this.history = res,
//   //     error: () => alert('Failed to load history')
//   //   });
//   // }
  
//   ngOnInit(): void {
//     const token = this.tokenStore.getToken();
//     if (token) {
//       const payload = JSON.parse(atob(token.split('.')[1]));
//       this.studentId = +payload["nameid"]; // 🔁 Change this if your token uses a different key
//       this.loadHistory();
//     } else {
//       alert('No token found!');
//     }
//   }

//   loadHistory() {
//     this.borrowServiceService.getStudentRequests(this.studentId).subscribe({
//       next: (res: any) => this.history = res,
//       error: () => alert('Failed to load history')
//     });
//   }
// }


import { Component, OnInit } from '@angular/core';
import { BorrowServiceService } from 'src/app/student/borrow-service/borrow-service.service';
import { TokenStorageService } from 'src/app/shared/token-storage/token-storage.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  history: any[] = [];
  studentId: number = 0;

  constructor(
    private borrowServiceService: BorrowServiceService,
    private tokenStore: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.studentId = this.tokenStore.getUserId();

    if (!this.studentId) {
      alert('Student ID not found in token!');
      return;
    }

    this.loadHistory();
  }

  loadHistory() {
    this.borrowServiceService.getStudentRequests(this.studentId).subscribe({
      next: (res: any) => this.history = res,
      error: (err) => {
        console.error('Failed to load history:', err);
        alert('Failed to load history');
      }
    });
  }
  getStatusLabel(status: number): string {
  switch (status) {
    case 1: return 'Pending';
    case 2: return 'Approved';
    case 12: return 'Returned';
    default: return 'Unknown';
  }
}

}
