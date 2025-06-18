import { Component, OnInit } from '@angular/core';
import { BorrowServiceService } from 'src/app/student/borrow-service/borrow-service.service';
import { TokenStorageService } from 'src/app/shared/token-storage/token-storage.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import { BookServiceService } from 'src/app/book/book/book/book-service/book-service.service';
import { BookServiceService } from 'src/app/book/book/book/book-service/book-service.service';
import { WishlistServiceService } from '../../wishlist/service/wishlist/wishlist-service.service';


@Component({
  selector: 'app-borrow',
  templateUrl: './borrow.component.html',
  styleUrls: ['./borrow.component.scss']
})
export class BorrowComponent implements OnInit{
   books: any[] = [];
  studentId: number = 0;
  searchText: string = '';


  constructor(
    private bookServiceService: BookServiceService,
    private borrowServiceService: BorrowServiceService,
    private tokenStore: TokenStorageService,
    private wishlistService: WishlistServiceService
  ) {}

 

ngOnInit(): void {
  const token = this.tokenStore.getToken();

  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log('Token Payload:', payload);  // 👈 debug log

    
    const rawId = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];


    if (!rawId) {
      alert('User ID not found in token!');
    } else {
      this.studentId = +rawId;
    }

  } else {
    alert('No token found!');
  }

  //  Always call after checking token
  this.loadBooks();
}





  loadBooks() {
    this.bookServiceService.getAll().subscribe({
      next: (res: any) => this.books = res,
      error: () => alert('Failed to load books')
    });
  }


borrow(bookId: number) {
  this.studentId = this.tokenStore.getUserId();
  const payload = { bookId, studentId: this.studentId };
  console.log('📤 Borrow payload:', payload);

  this.borrowServiceService.requestBorrow(payload).subscribe({
    next: (res: any) => alert(res.message),
    error: (err) => {
      console.error('❌ Borrow failed:', err);
      alert(err.error?.message || 'Borrow failed!');
    }
  });
}
updateStatus(id: number, newStatus: number) {
  this.borrowServiceService.updateStatus({ requestId: id, newStatus }).subscribe({
    next: () => this.loadRequests(),
    error: (err) => alert(err.error?.message || 'Failed to update')
  });
}

loadRequests(): void {
  // Implement logic to load borrow requests here, or leave empty if not needed yet
  console.log('loadRequests() called - implement logic to fetch requests.');
}


addToWishlist(bookId: number) {
  const studentId = this.tokenStore.getUserId();

  if (!studentId || !bookId) {
    alert('Missing student or book ID');
    return;
  }

  const payload = {
    StudentId: studentId,  
    BookId: bookId         
  };

  this.wishlistService.addToWishlist(payload).subscribe({
    next: () => {
      alert('✅ Book added to wishlist');
    },
    error: (err) => {
      console.error('❌ Wishlist Error:', err);
      alert(err.error?.message || 'Failed to add to wishlist');
    }
  });
}
filteredBooks() {
  const search = this.searchText.trim().toLowerCase();
  return this.books.filter(book =>
    book.title.toLowerCase().includes(search) ||
    book.author.toLowerCase().includes(search)
  );
}



}
