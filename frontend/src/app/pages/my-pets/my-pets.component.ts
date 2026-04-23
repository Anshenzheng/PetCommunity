import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PetService } from '../../services/pet.service';
import { Pet } from '../../models/pet.model';

@Component({
  selector: 'app-my-pets',
  template: `
    <div class="my-pets-container">
      <div class="page-header">
        <h1 class="page-title">
          <mat-icon>pets</mat-icon>
          我的宠物
        </h1>
        <button mat-raised-button routerLink="/pet-add" class="add-btn">
          <mat-icon>add</mat-icon>
          发布新宠物
        </button>
      </div>
      
      <div *ngIf="isLoading" class="loading-container">
        <mat-spinner diameter="50"></mat-spinner>
      </div>
      
      <div class="content" *ngIf="!isLoading">
        <div class="pets-grid" *ngIf="pets.length > 0">
          <mat-card class="pet-card card-hover" *ngFor="let pet of pets">
            <div class="pet-image" (click)="viewDetail(pet.id)">
              <img [src]="getMainPhoto(pet)" alt="{{ pet.name }}" />
              <div class="status-badge" [class]="'status-' + pet.status.toLowerCase()">
                {{ getStatusText(pet.status) }}
              </div>
              <div class="approve-badge" *ngIf="!pet.approved">
                待审核
              </div>
            </div>
            
            <mat-card-content>
              <div class="pet-header">
                <h3 class="pet-name">{{ pet.name }}</h3>
                <span class="species-badge">{{ pet.species }}</span>
              </div>
              
              <div class="pet-tags">
                <span *ngIf="pet.breed" class="pet-tag">
                  <mat-icon>category</mat-icon>
                  {{ pet.breed }}
                </span>
                <span *ngIf="pet.age" class="pet-tag">
                  <mat-icon>calendar_today</mat-icon>
                  {{ pet.age }}
                </span>
              </div>
            </mat-card-content>
            
            <mat-card-actions>
              <button mat-button (click)="editPet(pet.id)">
                <mat-icon>edit</mat-icon>
                编辑
              </button>
              <button mat-button (click)="deletePet(pet)">
                <mat-icon>delete</mat-icon>
                删除
              </button>
            </mat-card-actions>
          </mat-card>
        </div>
        
        <div class="empty-state" *ngIf="pets.length === 0">
          <mat-icon>pets</mat-icon>
          <h3>暂无发布的宠物</h3>
          <p>快来发布您的第一只宠物信息吧~</p>
          <button mat-raised-button routerLink="/pet-add" class="go-btn">
            <mat-icon>add</mat-icon>
            发布宠物
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .my-pets-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 24px;
    }
    
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
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
    
    .add-btn {
      background: linear-gradient(135deg, #FF9A8B 0%, #FF7B6B 100%) !important;
      color: white !important;
    }
    
    .pets-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 24px;
    }
    
    .pet-card {
      overflow: hidden;
    }
    
    .pet-image {
      position: relative;
      width: 100%;
      height: 200px;
      overflow: hidden;
      cursor: pointer;
    }
    
    .pet-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .status-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }
    
    .approve-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      background: rgba(255, 183, 77, 0.9);
      color: white;
    }
    
    .pet-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    
    .pet-name {
      font-size: 20px;
      font-weight: 700;
      color: #4A3728;
      margin: 0;
    }
    
    .species-badge {
      background: linear-gradient(135deg, #FFECD2 0%, #FFF8E7 100%);
      color: #4A3728;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }
    
    .pet-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    
    .pet-tag {
      display: flex;
      align-items: center;
      gap: 4px;
      background: #FFF5E6;
      color: #7A6B5D;
      padding: 4px 8px;
      border-radius: 16px;
      font-size: 12px;
    }
    
    .pet-tag .mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
    }
    
    mat-card-actions {
      display: flex;
      justify-content: flex-end;
      padding: 12px 16px !important;
      border-top: 1px solid #FFECD2;
    }
    
    mat-card-actions button {
      color: #7A6B5D;
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
export class MyPetsComponent implements OnInit {
  pets: Pet[] = [];
  isLoading = true;

  constructor(
    private petService: PetService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadPets();
  }

  loadPets(): void {
    this.isLoading = true;
    this.petService.getMyPets().subscribe({
      next: (pets) => {
        this.pets = pets;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  getMainPhoto(pet: Pet): string {
    if (pet.photos && pet.photos.length > 0) {
      return pet.photos[0];
    }
    const species = pet.species ? pet.species.toLowerCase() : 'cat';
    const seed: Record<string, number> = {
      'dog': 237,
      'cat': 40,
      '兔子': 158,
      '仓鼠': 102,
      '其他': 169
    };
    const imageSeed = seed[species] || seed['cat'];
    return `https://picsum.photos/seed/${imageSeed}${pet.id % 100}/400/400`;
  }

  getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      'AVAILABLE': '可领养',
      'PENDING': '待审核',
      'ADOPTED': '已领养'
    };
    return statusMap[status] || status;
  }

  viewDetail(id: number): void {
    this.router.navigate(['/pet', id]);
  }

  editPet(id: number): void {
    this.router.navigate(['/pet-edit', id]);
  }

  deletePet(pet: Pet): void {
    if (confirm(`确定要删除宠物"${pet.name}"吗？`)) {
      this.petService.deletePet(pet.id).subscribe({
        next: () => {
          this.snackBar.open('删除成功', '关闭', { duration: 2000 });
          this.loadPets();
        }
      });
    }
  }
}
