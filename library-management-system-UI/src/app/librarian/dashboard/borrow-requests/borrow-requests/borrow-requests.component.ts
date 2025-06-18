import { Component, OnInit } from '@angular/core';
import { BorrowServiceService } from 'src/app/student/borrow-service/borrow-service.service';



@Component({
  selector: 'app-borrow-requests',
  templateUrl: './borrow-requests.component.html',
  styleUrls: ['./borrow-requests.component.scss']
})
export class BorrowRequestsComponent implements OnInit {
  requests: any[] = [];
  searchTerm: string = '';
  //borrowStatus = BorrowStatus;
  constructor(private borrowServiceService: BorrowServiceService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests() {
    this.borrowServiceService.getAllRequests().subscribe({
      next: (res: any) => this.requests = res,
      error: () => alert('Error loading requests')
    });
  }


updateStatus(id: number, newStatus: number) {
  this.borrowServiceService.updateStatus({ requestId: id, newStatus }).subscribe({
    next: () => this.loadRequests(),
    error: (err) => alert(err.error?.message || 'Failed to update')
  });
}
getStatusText(status: number): string {
  switch (status) {
    case 0: return 'Pending';
    case 1: return 'Approved';
    case 2: return 'Rejected';
    case 3: return 'Returned';
    default: return 'Unknown';
  }
}

}
