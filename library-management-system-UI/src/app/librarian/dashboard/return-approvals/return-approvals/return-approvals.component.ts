import { Component, OnInit } from '@angular/core';
import { BorrowServiceService } from 'src/app/student/borrow-service/borrow-service.service';
@Component({
  selector: 'app-return-approvals',
  templateUrl: './return-approvals.component.html',
  styleUrls: ['./return-approvals.component.scss']
})
export class ReturnApprovalsComponent implements OnInit {
   returnRequests: any[] = [];
   approvedBooks: any[] = [];
   studentId: number = 0;

  constructor(private borrowService: BorrowServiceService) {}

  ngOnInit(): void {
    this.loadReturnRequests();
  }

 loadReturnRequests() {
  this.borrowService.getAllRequests().subscribe({
    next: (res: any[]) => {
      this.returnRequests = res.filter(r => r.status === 4); // 4 = Return Requested
    },
    error: () => alert('Failed to load return requests')
  });
}



  approveReturn(borrowId: number) {
    this.borrowService.updateStatus({ requestId: borrowId, newStatus: 3 }).subscribe({
      next: () => {
        alert('✅ Book marked as Returned');
        this.loadReturnRequests();
      },
      error: () => alert('❌ Failed to approve return')
    });
  }
}
