import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Pet } from '../../models/pet.model';
import { FavoriteService } from '../../services/favorite.service';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pet-card',
  template: `
    <mat-card class="pet-card card-hover" (click)="goToDetail()">
      <div class="pet-image">
        <img [src]="getMainPhoto()" alt="{{ pet.name }}" />
        <div class="favorite-btn" [class.active]="isFavorited" (click)="toggleFavorite($event)">
          <mat-icon>{{ isFavorited ? 'favorite' : 'favorite_border' }}</mat-icon>
        </div>
        <div class="status-badge" [class]="'status-' + pet.status.toLowerCase()">
          {{ getStatusText() }}
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
          <span *ngIf="pet.gender" class="pet-tag">
            <mat-icon>{{ pet.gender === '公' ? 'male' : 'female' }}</mat-icon>
            {{ pet.gender }}
          </span>
        </div>
        
        <p class="pet-description" *ngIf="pet.personality">
          {{ pet.personality | slice:0:50 }}...
        </p>
      </mat-card-content>
      
      <mat-card-footer>
        <div class="owner-info">
          <mat-icon>person</mat-icon>
          <span>{{ pet.ownerName || '未知' }}</span>
        </div>
        <div class="post-time">
          {{ pet.createdAt | date:'yyyy-MM-dd' }}
        </div>
      </mat-card-footer>
    </mat-card>
  `,
  styles: [`
    .pet-card {
      width: 100%;
      max-width: 320px;
      overflow: hidden;
    }
    
    .pet-image {
      position: relative;
      width: 100%;
      height: 200px;
      overflow: hidden;
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
      margin-bottom: 12px;
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
    
    .pet-description {
      color: #A89A8D;
      font-size: 14px;
      line-height: 1.5;
      margin: 0;
    }
    
    mat-card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      border-top: 1px solid #FFECD2;
    }
    
    .owner-info, .post-time {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #A89A8D;
    }
    
    .owner-info .mat-icon, .post-time .mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
  `]
})
export class PetCardComponent implements OnInit {
  @Input() pet!: Pet;
  @Output() favoriteChanged = new EventEmitter<boolean>();
  
  isFavorited = false;

  constructor(
    private router: Router,
    private favoriteService: FavoriteService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.favoriteService.isFavorited(this.pet.id).subscribe(
        result => this.isFavorited = result.favorited
      );
    }
  }

  getMainPhoto(): string {
    if (this.pet.photos && this.pet.photos.length > 0) {
      return this.pet.photos[0];
    }
    return this.getDefaultImage();
  }

  getDefaultImage(): string {
    const species = this.pet.species ? this.pet.species.toLowerCase() : 'cat';
    const prompts: Record<string, string> = {
      'dog': 'a cute golden retriever puppy looking happy and friendly, warm soft lighting, pastel background, professional pet photography',
      'cat': 'a cute orange tabby cat sitting comfortably, warm cozy atmosphere, soft lighting, pet portrait',
      '兔子': 'a cute fluffy bunny with soft fur, pastel background, warm lighting, pet photography',
      '仓鼠': 'a cute golden hamster sitting in a tiny cup, warm lighting, cute pet portrait'
    };
    const prompt = prompts[species] || prompts['cat'];
    return `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=square_hd`;
  }

  getStatusText(): string {
    const statusMap: Record<string, string> = {
      'AVAILABLE': '可领养',
      'PENDING': '待审核',
      'ADOPTED': '已领养'
    };
    return statusMap[this.pet.status] || this.pet.status;
  }

  goToDetail(): void {
    this.router.navigate(['/pet', this.pet.id]);
  }

  toggleFavorite(event: Event): void {
    event.stopPropagation();
    
    if (!this.authService.isLoggedIn()) {
      this.snackBar.open('请先登录', '关闭', { duration: 3000 });
      this.router.navigate(['/login']);
      return;
    }
    
    this.favoriteService.toggleFavorite(this.pet.id).subscribe(
      result => {
        this.isFavorited = result.favorited;
        this.favoriteChanged.emit(result.favorited);
        this.snackBar.open(result.message, '关闭', { duration: 2000 });
      }
    );
  }
}
