import { Component, OnInit } from '@angular/core';
import { NotificationServiceService } from '../../notification/notification-service.service'; 
import { TokenStorageService } from 'src/app/shared/token-storage/token-storage.service';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  studentId = 0;
  notifications: any[] = [];

  constructor(
    private notificationService: NotificationServiceService,
    private tokenService: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.studentId = this.tokenService.getUserId();
    this.loadNotifications();
  }

  loadNotifications() {
    this.notificationService.getStudentNotifications(this.studentId).subscribe({
      next: res => this.notifications = res,
      error: () => alert('Failed to load notifications')
    });
  }

  markAsRead(notificationId: number) {
    this.notificationService.markAsRead(notificationId).subscribe({
      next: () => this.loadNotifications(),
      error: () => alert('Failed to mark as read')
    });
  }
}
