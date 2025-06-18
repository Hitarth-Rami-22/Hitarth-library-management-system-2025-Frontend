
import { Component, OnInit } from '@angular/core';
import { PenaltyServiceService } from '../../penalty-service/penalty-service.service';
import { Penalty } from 'src/app/models/penalty.model';

@Component({
  selector: 'app-penalty-list',
  templateUrl: './penalty-list.component.html',
  styleUrls: ['./penalty-list.component.scss']
})
export class PenaltyListComponent implements OnInit {
  penalties: Penalty[] = [];
  isLoading: boolean = true;

  constructor(private penaltyServiceService: PenaltyServiceService) {}

  ngOnInit(): void {
    this.loadPenalties();
  }

  loadPenalties(): void {
    this.isLoading = true;
    this.penaltyServiceService.getPenalties().subscribe({
      next: (data) => {
        this.penalties = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('❌ Failed to load penalties:', err);
        this.isLoading = false;
      }
    });
  }

  getTotalPenalty(): number {
    return this.penalties.reduce((total, penalty) => total + penalty.penaltyAmount, 0);
  }
}