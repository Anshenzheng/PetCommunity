import { Component, OnInit } from '@angular/core';
import { FavoriteService } from '../../services/favorite.service';
import { Pet } from '../../models/pet.model';

@Component({
  selector: 'app-favorites',
  template: `
    <div class="favorites-container">
      <div class="page-header">
        <h1 class="page-title">
          <mat-icon>favorite</mat-icon>
          我的收藏
        </h1>
        <span class="count-badge" *ngIf="pets.length > 0">共 {{ pets.length }} 只</span>
      </div>
      
      <div *ngIf="isLoading" class="loading-container">
        <mat-spinner diameter="50"></mat-spinner>
      </div>
      
      <div class="content" *ngIf="!isLoading">
        <div class="pets-grid" *ngIf="pets.length > 0">
          <app-pet-card 
            *ngFor="let pet of pets" 
            [pet]="pet"
          ></app-pet-card>
        </div>
        
        <div class="empty-state" *ngIf="pets.length === 0">
          <mat-icon>favorite_border</mat-icon>
          <h3>暂无收藏</h3>
          <p>去首页看看有没有喜欢的宠物吧~</p>
          <button mat-raised-button routerLink="/" class="go-btn">
            <mat-icon>home</mat-icon>
            去首页
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .favorites-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 24px;
    }
    
    .page-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 32px;
    }
    
    .page-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 28px;
      font-weight: 700;
      color: #4A3728;
      margin: 0;
    }
    
    .page-title .mat-icon {
      color: #FF9A8B;
    }
    
    .count-badge {
      background: linear-gradient(135deg, #FFECD2 0%, #FFF8E7 100%);
      color: #7A6B5D;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 14px;
    }
    
    .pets-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
    }
    
    .empty-state {
      text-align: center;
      padding: 80px 24px;
      color: #A89A8D;
    }
    
    .empty-state .mat-icon {
      font-size: 80px;
      width: 80px;
      height: 80px;
      margin-bottom: 24px;
      opacity: 0.5;
    }
    
    .empty-state h3 {
      font-size: 24px;
      font-weight: 600;
      color: #7A6B5D;
      margin: 0 0 8px 0;
    }
    
    .empty-state p {
      font-size: 16px;
      margin: 0 0 24px 0;
    }
    
    .go-btn {
      background: linear-gradient(135deg, #FF9A8B 0%, #FF7B6B 100%) !important;
      color: white !important;
    }
  `]
})
export class FavoritesComponent implements OnInit {
  pets: Pet[] = [];
  isLoading = true;

  constructor(private favoriteService: FavoriteService) { }

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.isLoading = true;
    this.favoriteService.getMyFavorites().subscribe({
      next: (pets) => {
        this.pets = pets;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
