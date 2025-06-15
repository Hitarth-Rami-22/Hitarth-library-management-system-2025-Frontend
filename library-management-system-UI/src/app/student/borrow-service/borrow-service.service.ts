import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BorrowServiceService {
    private baseUrl = 'https://localhost:7255//api/Borrow';
  constructor(private http: HttpClient) { }
  
  requestBorrow(data: any) {
    return this.http.post(`${this.baseUrl}`, data);
  }

  getStudentRequests(studentId: number) {
    return this.http.get(`${this.baseUrl}/student/${studentId}`);
  }

  getAllRequests() {
    return this.http.get(`${this.baseUrl}/all`);
  }

  updateStatus(data: any) {
    return this.http.put(`${this.baseUrl}/status`, data);
  }
  
}
