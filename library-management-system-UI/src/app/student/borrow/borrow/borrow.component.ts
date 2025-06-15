import { Component, OnInit } from '@angular/core';
import { BorrowServiceService } from 'src/app/student/borrow-service/borrow-service.service';
import { TokenStorageService } from 'src/app/shared/token-storage/token-storage.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import { BookServiceService } from 'src/app/book/book/book/book-service/book-service.service';
import { BookServiceService } from 'src/app/book/book/book/book-service/book-service.service';
@Component({
  selector: 'app-borrow',
  templateUrl: './borrow.component.html',
  styleUrls: ['./borrow.component.scss']
})
export class BorrowComponent implements OnInit{
   books: any[] = [];
  studentId: number = 0;

  constructor(
    private bookServiceService: BookServiceService,
    private borrowServiceService: BorrowServiceService,
    private tokenStore: TokenStorageService
  ) {}

  // ngOnInit(): void {
  //   const payload = this.tokenStore.getTokenPayload();
  //   this.studentId = +payload.nameid; // id from token
  //   this.loadBooks();
  // }
ngOnInit(): void {
  const token = this.tokenStore.getToken();
  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    this.studentId = +payload["nameid"]; // adjust the key based on your token's structure
  } else {
    alert('No token found!');
  }

  this.loadBooks();
}
  loadBooks() {
    this.bookServiceService.getAll().subscribe({
      next: (res: any) => this.books = res,
      error: () => alert('Failed to load books')
    });
  }

  borrow(bookId: number) {
    this.borrowServiceService.requestBorrow({ bookId, studentId: this.studentId }).subscribe({
      next: (res: any) => alert(res.message),
      error: (err) => alert(err.error)
    });
  }

}
