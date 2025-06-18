
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
  isLoading: boolean = true;

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
    this.isLoading = true;
    this.borrowServiceService.getStudentRequests(this.studentId).subscribe({
      next: (res: any) => {
        this.history = res;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load history:', err);
        alert('Failed to load history');
        this.isLoading = false;
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

  getStatusClass(status: number): string {
    switch (status) {
      case 1: return 'status-pending';
      case 2: return 'status-approved';
      case 12: return 'status-returned';
      default: return 'status-unknown';
    }
  }
}