import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PetService } from '../../services/pet.service';
import { Pet, PageResponse } from '../../models/pet.model';

@Component({
  selector: 'app-home',
  template: `
    <div class="home-container">
      <div class="hero-section">
        <div class="hero-content">
          <h1>给它们一个温暖的家</h1>
          <p>每一个生命都值得被爱，让领养代替购买，用温暖点亮希望</p>
          <div class="search-box">
            <mat-form-field appearance="outline" class="search-input">
              <mat-label>搜索宠物（名字、品种、物种）</mat-label>
              <input matInput [formControl]="searchControl" placeholder="输入关键词搜索..." />
              <mat-icon matSuffix>search</mat-icon>
            </mat-form-field>
          </div>
        </div>
        <div class="hero-image">
          <img src="https://picsum.photos/seed/petcommunity/800/500" alt="hero" />
        </div>
      </div>
      
      <div class="filter-section">
        <div class="filter-tabs">
          <button mat-button [class.active]="selectedStatus === null" (click)="filterByStatus(null)">
            全部
          </button>
          <button mat-button [class.active]="selectedStatus === 'AVAILABLE'" (click)="filterByStatus('AVAILABLE')">
            <mat-icon>pets</mat-icon>
            可领养
          </button>
          <button mat-button [class.active]="selectedStatus === 'ADOPTED'" (click)="filterByStatus('ADOPTED')">
            <mat-icon>favorite</mat-icon>
            已领养
          </button>
        </div>
      </div>
      
      <div class="pets-section page-container">
        <h2 class="section-title">
          <mat-icon>pets</mat-icon>
          等待回家的宝贝们
        </h2>
        
        <div *ngIf="isLoading" class="loading-container">
          <mat-spinner diameter="50"></mat-spinner>
        </div>
        
        <div *ngIf="!isLoading && pets.length === 0" class="empty-state">
          <mat-icon>pets</mat-icon>
          <p>暂无宠物信息</p>
        </div>
        
        <div class="pets-grid" *ngIf="!isLoading && pets.length > 0">
          <app-pet-card 
            *ngFor="let pet of pets" 
            [pet]="pet"
          ></app-pet-card>
        </div>
        
        <div class="pagination" *ngIf="totalPages > 1">
          <button mat-icon-button (click)="previousPage()" [disabled]="currentPage === 0">
            <mat-icon>chevron_left</mat-icon>
          </button>
          <span>第 {{ currentPage + 1 }} 页 / 共 {{ totalPages }} 页</span>
          <button mat-icon-button (click)="nextPage()" [disabled]="currentPage >= totalPages - 1">
            <mat-icon>chevron_right</mat-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      min-height: 100vh;
    }
    
    .hero-section {
      display: flex;
      align-items: center;
      padding: 48px 24px;
      background: linear-gradient(135deg, #FFECD2 0%, #FCB69F 50%, #FFECD2 100%);
      margin-bottom: 32px;
    }
    
    .hero-content {
      flex: 1;
      max-width: 600px;
      padding: 24px;
    }
    
    .hero-content h1 {
      font-size: 42px;
      font-weight: 700;
      color: #4A3728;
      margin: 0 0 16px 0;
      line-height: 1.2;
    }
    
    .hero-content p {
      font-size: 18px;
      color: #7A6B5D;
      margin: 0 0 32px 0;
      line-height: 1.6;
    }
    
    .search-box {
      max-width: 450px;
    }
    
    .search-input {
      width: 100%;
    }
    
    .hero-image {
      flex: 1;
      max-width: 600px;
      padding: 24px;
    }
    
    .hero-image img {
      width: 100%;
      border-radius: 24px;
      box-shadow: 0 12px 40px rgba(255, 154, 139, 0.3);
    }
    
    .filter-section {
      padding: 0 24px;
      margin-bottom: 24px;
    }
    
    .filter-tabs {
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
    }
    
    .filter-tabs button {
      padding: 12px 24px;
      border-radius: 25px;
      font-size: 15px;
      background: white;
      color: #7A6B5D;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
    
    .filter-tabs button:hover,
    .filter-tabs button.active {
      background: linear-gradient(135deg, #FF9A8B 0%, #FF7B6B 100%);
      color: white;
    }
    
    .pets-section {
      max-width: 1400px;
      margin: 0 auto;
      padding: 24px;
    }
    
    .section-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 28px;
      font-weight: 700;
      color: #4A3728;
      margin: 0 0 32px 0;
    }
    
    .section-title .mat-icon {
      color: #FF9A8B;
    }
    
    .pets-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
    }
    
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      margin-top: 32px;
      padding: 16px;
    }
    
    .pagination span {
      color: #7A6B5D;
      font-size: 14px;
    }
    
    @media (max-width: 768px) {
      .hero-section {
        flex-direction: column;
        text-align: center;
      }
      
      .hero-content h1 {
        font-size: 28px;
      }
      
      .hero-image {
        display: none;
      }
      
      .pets-grid {
        grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  searchControl = new FormControl('');
  selectedStatus: string | null = null;
  pets: Pet[] = [];
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;
  isLoading = false;

  constructor(private petService: PetService) { }

  ngOnInit(): void {
    this.loadPets();
    
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(() => {
      this.currentPage = 0;
      this.loadPets();
    });
  }

  filterByStatus(status: string | null): void {
    this.selectedStatus = status;
    this.currentPage = 0;
    this.loadPets();
  }

  loadPets(): void {
    this.isLoading = true;
    const keyword = this.searchControl.value || '';
    
    let request;
    if (keyword) {
      request = this.petService.searchPets(keyword, this.currentPage, 12);
    } else if (this.selectedStatus) {
      request = this.petService.getPetsByStatus(this.selectedStatus, this.currentPage, 12);
    } else {
      request = this.petService.getApprovedPets(this.currentPage, 12);
    }
    
    request.subscribe({
      next: (response: PageResponse<Pet>) => {
        this.pets = response.content;
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadPets();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadPets();
    }
  }
}
