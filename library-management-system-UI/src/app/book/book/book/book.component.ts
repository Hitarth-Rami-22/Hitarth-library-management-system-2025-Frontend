import { Component, OnInit } from '@angular/core';
import { BookServiceService } from './book-service/book-service.service';
import { HttpClientModule } from '@angular/common/http';
import { TokenStorageService } from 'src/app/shared/token-storage/token-storage.service';
@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit{

  books: any[] = [];
  form = { title: '', author: '', isbn: '', quantity: 1 };
  isEditing = false;
  editId: number | null = null;
  role: string = '';
  submitted = false;
  formError = '';
  constructor(private bookServiceService: BookServiceService, private tokenStore: TokenStorageService) {}

  ngOnInit(): void {
    this.role = this.tokenStore.getUserRole();
    console.log('User Role:', this.role);
    this.loadBooks();
  }

  loadBooks() {
    this.bookServiceService.getAll().subscribe({
      next: (res: any) => this.books = res,
      error: () => alert('Failed to load books.')
    });
  }

  saveBook() {
    this.submitted = true;

  if (!this.isFormValid()) return;

  if (this.isEditing && this.editId !== null) {
    this.bookServiceService.update(this.editId, this.form).subscribe({
      next: () => {
        this.loadBooks();
        this.resetForm();
      }
    });
  } else {
    this.bookServiceService.add(this.form).subscribe({
      next: () => {
        this.loadBooks();
        this.resetForm();
      }
    });
  }
}

  editBook(book: any) {
    this.form = { ...book };
    this.editId = book.id;
    this.isEditing = true;
  }

  deleteBook(id: number) {
    if (confirm('Are you sure you want to delete this book?')) {
      this.bookServiceService.delete(id).subscribe({
        next: () => this.loadBooks()
      });
    }
  }

  resetForm() {
    this.form = { title: '', author: '', isbn: '', quantity: 1 };
    this.editId = null;
    this.isEditing = false;
    this.submitted = false;
  }

  isAdmin() {
    return this.role === 'Admin';
  }

  isLibrarianOrAdmin() {
    return this.role === 'Admin' || this.role === 'Librarian';
  }

  isValidTitle() {
  return this.form.title.trim().length >= 3;
}

isValidAuthor() {
  return this.form.author.trim().length >= 3;
}

isFormValid() {
  return (
    this.form.title.trim().length >= 3 &&
    this.form.author.trim().length >= 3 &&
    this.form.isbn.trim() &&
    this.form.quantity >= 1
  );
}
}
