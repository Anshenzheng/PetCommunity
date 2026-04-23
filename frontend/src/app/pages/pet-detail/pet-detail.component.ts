import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Pet } from '../../models/pet.model';
import { Comment } from '../../models/comment.model';
import { PetService } from '../../services/pet.service';
import { FavoriteService } from '../../services/favorite.service';
import { AuthService } from '../../services/auth.service';
import { AdoptionDialogComponent } from '../../components/adoption-dialog/adoption-dialog.component';

@Component({
  selector: 'app-pet-detail',
  template: `
    <div class="detail-container" *ngIf="pet; else loading">
      <button mat-icon-button class="back-btn" (click)="goBack()">
        <mat-icon>arrow_back</mat-icon>
      </button>
      
      <div class="detail-content">
        <div class="image-section">
          <div class="main-image">
            <img [src]="getMainPhoto()" alt="{{ pet.name }}" />
            <div class="favorite-btn" [class.active]="isFavorited" (click)="toggleFavorite()">
              <mat-icon>{{ isFavorited ? 'favorite' : 'favorite_border' }}</mat-icon>
            </div>
            <div class="status-badge" [class]="'status-' + pet.status.toLowerCase()">
              {{ getStatusText() }}
            </div>
          </div>
          
          <div class="thumbnails" *ngIf="pet.photos && pet.photos.length > 1">
            <div class="thumbnail" 
                 *ngFor="let photo of pet.photos; let i = index"
                 [class.active]="currentImageIndex === i"
                 (click)="currentImageIndex = i">
              <img [src]="photo" alt="" />
            </div>
          </div>
        </div>
        
        <div class="info-section">
          <div class="pet-header">
            <h1>{{ pet.name }}</h1>
            <span class="species-badge">{{ pet.species }}</span>
          </div>
          
          <div class="pet-meta">
            <span class="owner">
              <mat-icon>person</mat-icon>
              发布者：{{ pet.ownerName || '未知' }}
            </span>
            <span class="post-time">
              <mat-icon>schedule</mat-icon>
              发布时间：{{ pet.createdAt | date:'yyyy-MM-dd HH:mm' }}
            </span>
          </div>
          
          <div class="info-cards">
            <mat-card class="info-card">
              <mat-icon>category</mat-icon>
              <div class="info-label">品种</div>
              <div class="info-value">{{ pet.breed || '未知' }}</div>
            </mat-card>
            
            <mat-card class="info-card">
              <mat-icon>calendar_today</mat-icon>
              <div class="info-label">年龄</div>
              <div class="info-value">{{ pet.age || '未知' }}</div>
            </mat-card>
            
            <mat-card class="info-card">
              <mat-icon>{{ pet.gender === '公' ? 'male' : 'female' }}</mat-icon>
              <div class="info-label">性别</div>
              <div class="info-value">{{ pet.gender || '未知' }}</div>
            </mat-card>
            
            <mat-card class="info-card">
              <mat-icon>palette</mat-icon>
              <div class="info-label">颜色</div>
              <div class="info-value">{{ pet.color || '未知' }}</div>
            </mat-card>
          </div>
          
          <div class="description-section" *ngIf="pet.personality">
            <h3><mat-icon>psychology</mat-icon>性格特点</h3>
            <p>{{ pet.personality }}</p>
          </div>
          
          <div class="description-section" *ngIf="pet.description">
            <h3><mat-icon>article</mat-icon>详细介绍</h3>
            <p>{{ pet.description }}</p>
          </div>
          
          <div class="action-buttons" *ngIf="authService.isLoggedIn()">
            <ng-container *ngIf="isAdmin">
              <div class="admin-hint">
                <mat-icon>admin_panel_settings</mat-icon>
                <span>管理员身份不可申请领养宠物</span>
              </div>
            </ng-container>
            
            <ng-container *ngIf="!isAdmin && isOwner">
              <div class="owner-hint">
                <mat-icon>info</mat-icon>
                <span>您不能领养自己发布的宠物</span>
              </div>
            </ng-container>
            
            <ng-container *ngIf="!isAdmin && !isOwner">
              <button mat-raised-button 
                      class="adopt-btn"
                      [disabled]="pet.status !== 'AVAILABLE'"
                      (click)="openAdoptionDialog()">
                <mat-icon>favorite_border</mat-icon>
                <span *ngIf="pet.status === 'AVAILABLE'">申请领养</span>
                <span *ngIf="pet.status === 'PENDING'">待审核中</span>
                <span *ngIf="pet.status === 'ADOPTED'">已被领养</span>
              </button>
            </ng-container>
          </div>
          
          <div class="action-buttons" *ngIf="!authService.isLoggedIn()">
            <button mat-raised-button class="login-hint" (click)="goToLogin()">
              <mat-icon>login</mat-icon>
              登录后可申请领养
            </button>
          </div>
        </div>
      </div>
      
      <app-comment-section [petId]="pet.id"></app-comment-section>
    </div>
    
    <ng-template #loading>
      <div class="loading-container">
        <mat-spinner diameter="50"></mat-spinner>
      </div>
    </ng-template>
  `,
  styles: [`
    .detail-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 24px;
    }
    
    .back-btn {
      margin-bottom: 24px;
      background: white;
    }
    
    .detail-content {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 48px;
      margin-bottom: 48px;
    }
    
    .image-section {
      position: sticky;
      top: 24px;
    }
    
    .main-image {
      position: relative;
      width: 100%;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(255, 154, 139, 0.2);
    }
    
    .main-image img {
      width: 100%;
      height: 500px;
      object-fit: cover;
    }
    
    .status-badge {
      position: absolute;
      top: 20px;
      left: 20px;
      padding: 8px 20px;
      border-radius: 25px;
      font-size: 14px;
      font-weight: 600;
    }
    
    .thumbnails {
      display: flex;
      gap: 12px;
      margin-top: 16px;
      overflow-x: auto;
      padding-bottom: 8px;
    }
    
    .thumbnail {
      width: 80px;
      height: 80px;
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      border: 3px solid transparent;
      flex-shrink: 0;
    }
    
    .thumbnail.active {
      border-color: #FF9A8B;
    }
    
    .thumbnail img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .pet-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;
    }
    
    .pet-header h1 {
      font-size: 36px;
      font-weight: 700;
      color: #4A3728;
      margin: 0;
    }
    
    .species-badge {
      background: linear-gradient(135deg, #FFECD2 0%, #FFF8E7 100%);
      color: #4A3728;
      padding: 8px 20px;
      border-radius: 25px;
      font-size: 14px;
      font-weight: 600;
    }
    
    .pet-meta {
      display: flex;
      gap: 24px;
      margin-bottom: 32px;
      flex-wrap: wrap;
    }
    
    .pet-meta span {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #A89A8D;
      font-size: 14px;
    }
    
    .pet-meta .mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
    
    .info-cards {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-bottom: 32px;
    }
    
    .info-card {
      text-align: center;
      padding: 20px;
    }
    
    .info-card .mat-icon {
      color: #FF9A8B;
      font-size: 32px;
      width: 32px;
      height: 32px;
      margin-bottom: 8px;
    }
    
    .info-label {
      color: #A89A8D;
      font-size: 12px;
      margin-bottom: 4px;
    }
    
    .info-value {
      color: #4A3728;
      font-size: 16px;
      font-weight: 600;
    }
    
    .description-section {
      margin-bottom: 24px;
    }
    
    .description-section h3 {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 18px;
      font-weight: 600;
      color: #4A3728;
      margin: 0 0 12px 0;
    }
    
    .description-section h3 .mat-icon {
      color: #FF9A8B;
    }
    
    .description-section p {
      color: #7A6B5D;
      line-height: 1.8;
      margin: 0;
      white-space: pre-wrap;
    }
    
    .action-buttons {
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #FFECD2;
    }
    
    .adopt-btn {
      width: 100%;
      height: 56px;
      font-size: 18px;
      background: linear-gradient(135deg, #FF9A8B 0%, #FF7B6B 100%) !important;
      color: white !important;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
    }
    
    .adopt-btn:disabled {
      background: #ccc !important;
    }
    
    .login-hint {
      width: 100%;
      height: 56px;
      font-size: 16px;
      background: linear-gradient(135deg, #FFECD2 0%, #FFF8E7 100%) !important;
      color: #4A3728 !important;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
    }
    
    .admin-hint,
    .owner-hint {
      width: 100%;
      height: 56px;
      font-size: 16px;
      background: #F5F5F5 !important;
      color: #7A6B5D !important;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      border-radius: 8px;
    }
    
    .admin-hint .mat-icon,
    .owner-hint .mat-icon {
      color: #A89A8D;
    }
    
    @media (max-width: 768px) {
      .detail-content {
        grid-template-columns: 1fr;
        gap: 32px;
      }
      
      .image-section {
        position: static;
      }
      
      .main-image img {
        height: 300px;
      }
      
      .info-cards {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .pet-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }
      
      .pet-header h1 {
        font-size: 28px;
      }
    }
  `]
})
export class PetDetailComponent implements OnInit {
  pet!: Pet;
  currentImageIndex = 0;
  isFavorited = false;
  isOwner = false;
  isAdmin = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private petService: PetService,
    private favoriteService: FavoriteService,
    public authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadPet(id);
    }
  }

  loadPet(id: number): void {
    this.petService.getPetById(id).subscribe({
      next: (pet) => {
        this.pet = pet;
        if (this.authService.isLoggedIn()) {
          this.checkFavorite();
          this.isAdmin = this.authService.isAdmin();
          const currentUser = this.authService.currentUserValue;
          if (currentUser && pet.ownerId) {
            this.isOwner = currentUser.id === pet.ownerId;
          }
        }
      },
      error: () => {
        this.snackBar.open('加载失败', '关闭', { duration: 3000 });
        this.router.navigate(['/']);
      }
    });
  }

  checkFavorite(): void {
    this.favoriteService.isFavorited(this.pet.id).subscribe({
      next: (result) => {
        this.isFavorited = result.favorited;
      }
    });
  }

  getMainPhoto(): string {
    if (this.pet.photos && this.pet.photos.length > 0) {
      return this.pet.photos[this.currentImageIndex] || this.pet.photos[0];
    }
    return this.getDefaultImage();
  }

  getDefaultImage(): string {
    const species = this.pet.species ? this.pet.species.toLowerCase() : 'cat';
    const seed: Record<string, number> = {
      'dog': 237,
      'cat': 40,
      '兔子': 158,
      '仓鼠': 102,
      '其他': 169
    };
    const imageSeed = seed[species] || seed['cat'];
    return `https://picsum.photos/seed/${imageSeed}${this.pet.id % 100}/600/600`;
  }

  getStatusText(): string {
    const statusMap: Record<string, string> = {
      'AVAILABLE': '可领养',
      'PENDING': '待审核',
      'ADOPTED': '已领养'
    };
    return statusMap[this.pet.status] || this.pet.status;
  }

  toggleFavorite(): void {
    if (!this.authService.isLoggedIn()) {
      this.snackBar.open('请先登录', '关闭', { duration: 3000 });
      this.router.navigate(['/login']);
      return;
    }
    
    this.favoriteService.toggleFavorite(this.pet.id).subscribe({
      next: (result) => {
        this.isFavorited = result.favorited;
        this.snackBar.open(result.message, '关闭', { duration: 2000 });
      }
    });
  }

  openAdoptionDialog(): void {
    if (this.isAdmin) {
      this.snackBar.open('管理员身份不可申请领养宠物', '关闭', { duration: 3000 });
      return;
    }
    if (this.isOwner) {
      this.snackBar.open('您不能领养自己发布的宠物', '关闭', { duration: 3000 });
      return;
    }
    const dialogRef = this.dialog.open(AdoptionDialogComponent, {
      width: '500px',
      data: { petId: this.pet.id, petName: this.pet.name }
    });
    
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.snackBar.open('申请提交成功！等待审核中', '关闭', { duration: 3000 });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  goToLogin(): void {
    this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
  }
}
