
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
  isLoading = true;

  constructor(
    private notificationService: NotificationServiceService,
    private tokenService: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.studentId = this.tokenService.getUserId();
    this.loadNotifications();
  }

  loadNotifications() {
    this.isLoading = true;
    this.notificationService.getStudentNotifications(this.studentId).subscribe({
      next: res => {
        this.notifications = res;
        this.isLoading = false;
      },
      error: () => {
        alert('Failed to load notifications');
        this.isLoading = false;
      }
    });
  }

  markAsRead(notificationId: number) {
    this.notificationService.markAsRead(notificationId).subscribe({
      next: () => {
        // Optimistically update UI
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
          notification.isRead = true;
        }
      },
      error: () => alert('Failed to mark as read')
    });
  }
}