import { Component, OnInit } from '@angular/core';
import { WishlistServiceService } from '../../service/wishlist/wishlist-service.service';
import { TokenStorageService } from 'src/app/shared/token-storage/token-storage.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {

  studentId = 0;
  wishlist: any[] = [];
  bookIdInput = '';

  constructor(
    private wishlistServiceService: WishlistServiceService,
    private tokenService: TokenStorageService
  ) {}

  ngOnInit(): void {
    this.studentId = this.tokenService.getUserId();
    this.loadWishlist();
  }

  loadWishlist() {
    this.wishlistServiceService.getWishlist(this.studentId).subscribe({
      next: res => this.wishlist = res,
      error: () => alert('Failed to load wishlist')
    });
  }

  addToWishlist() {
    if (!this.bookIdInput.trim()) return alert('Enter a Book ID');
    const payload = { studentId: this.studentId, bookId: +this.bookIdInput };
    this.wishlistServiceService.addToWishlist(payload).subscribe({
      next: () => {
        this.bookIdInput = '';
        this.loadWishlist();
        alert('Book added to wishlist');
      },
      error: () => alert('Failed to add to wishlist')
    });
  }

  removeFromWishlist(id: number) {
    this.wishlistServiceService.removeFromWishlist(id).subscribe({
      next: () => this.loadWishlist(),
      error: () => alert('Failed to remove from wishlist')
    });
  }
}
