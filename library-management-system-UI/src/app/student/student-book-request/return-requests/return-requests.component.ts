import { Component, OnInit } from '@angular/core';
import { BookServiceService } from 'src/app/book/book/book/book-service/book-service.service';
import { TokenStorageService } from 'src/app/shared/token-storage/token-storage.service'; 
import { BorrowServiceService } from '../../borrow-service/borrow-service.service';

@Component({
  selector: 'app-return-requests',
  templateUrl: './return-requests.component.html',
  styleUrls: ['./return-requests.component.scss']
})
export class ReturnRequestsComponent implements OnInit {
approvedBooks: any[] = [];
  studentId: number = 0;

  constructor(
    private borrowService: BorrowServiceService,
    private tokenService: TokenStorageService
  ) {}

  ngOnInit(): void {
    const token = this.tokenService.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.studentId = +payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
      this.loadApprovedBooks();
    }
  }

 loadApprovedBooks() {
  this.borrowService.getStudentRequests(this.studentId).subscribe({
    next: (res: any[]) => {
      // Show books that are Approved (1) and not yet returned or requested again
      this.approvedBooks = res.filter(r => r.status === 1);
    },
    error: () => alert('Failed to load approved books')
  });
}

  returnBook(requestId: number) {
    const payload = {
      requestId: requestId,
      newStatus: 3  // 3 = Returned
    };

    this.borrowService.updateStatus(payload).subscribe({
      next: (res: any) => {
        alert('✅ Return submitted!');
        this.loadApprovedBooks();
      },
      error: () => alert('❌ Failed to return book')
    });
  }
  submitReturnRequest(borrowId: number) {
  const payload = {
    requestId: borrowId,
    newStatus: 4  // 4 = Return Requested
  };
  this.borrowService.updateStatus(payload).subscribe({
    next: () => {
      alert('Return request sent!');
      this.loadApprovedBooks(); // Refresh list
    },
    error: () => alert('Failed to send return request.')
  });
}

}
