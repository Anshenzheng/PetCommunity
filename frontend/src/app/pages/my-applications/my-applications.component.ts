import { Component, OnInit } from '@angular/core';
import { AdoptionService } from '../../services/adoption.service';
import { AdoptionApplication } from '../../models/adoption.model';

@Component({
  selector: 'app-my-applications',
  template: `
    <div class="applications-container">
      <div class="page-header">
        <h1 class="page-title">
          <mat-icon>assignment</mat-icon>
          我的申请
        </h1>
      </div>
      
      <div *ngIf="isLoading" class="loading-container">
        <mat-spinner diameter="50"></mat-spinner>
      </div>
      
      <div class="content" *ngIf="!isLoading">
        <div class="applications-list" *ngIf="applications.length > 0">
          <mat-card class="application-card" *ngFor="let app of applications">
            <div class="application-header">
              <div class="pet-info">
                <div class="pet-avatar" *ngIf="app.petPhotos && app.petPhotos.length > 0">
                  <img [src]="app.petPhotos[0]" alt="{{ app.petName }}" />
                </div>
                <div class="pet-details">
                  <h3>{{ app.petName }}</h3>
                  <span class="apply-time">申请时间：{{ app.createdAt | date:'yyyy-MM-dd HH:mm' }}</span>
                </div>
              </div>
              
              <span class="status-badge" [class]="'status-' + app.status.toLowerCase()">
                {{ getStatusText(app.status) }}
              </span>
            </div>
            
            <mat-divider></mat-divider>
            
            <div class="application-content">
              <div class="info-row">
                <span class="label">领养原因：</span>
                <span class="value">{{ app.reason }}</span>
              </div>
              
              <div class="info-row" *ngIf="app.livingEnvironment">
                <span class="label">居住环境：</span>
                <span class="value">{{ app.livingEnvironment }}</span>
              </div>
              
              <div class="info-row" *ngIf="app.petExperience">
                <span class="label">养宠经验：</span>
                <span class="value">{{ app.petExperience }}</span>
              </div>
              
              <div class="info-row" *ngIf="app.contactPhone">
                <span class="label">联系电话：</span>
                <span class="value">{{ app.contactPhone }}</span>
              </div>
            </div>
            
            <div class="review-section" *ngIf="app.reviewComment">
              <mat-divider></mat-divider>
              <div class="review-info">
                <span class="review-label">审核意见：</span>
                <span class="review-content">{{ app.reviewComment }}</span>
              </div>
              <span class="review-time" *ngIf="app.reviewedAt">
                审核时间：{{ app.reviewedAt | date:'yyyy-MM-dd HH:mm' }}
              </span>
            </div>
          </mat-card>
        </div>
        
        <div class="empty-state" *ngIf="applications.length === 0">
          <mat-icon>assignment_late</mat-icon>
          <h3>暂无领养申请</h3>
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
    .applications-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 24px;
    }
    
    .page-header {
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
    
    .applications-list {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    
    .application-card {
      padding: 24px;
    }
    
    .application-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    
    .pet-info {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .pet-avatar {
      width: 64px;
      height: 64px;
      border-radius: 12px;
      overflow: hidden;
    }
    
    .pet-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .pet-details h3 {
      font-size: 18px;
      font-weight: 600;
      color: #4A3728;
      margin: 0 0 4px 0;
    }
    
    .apply-time {
      color: #A89A8D;
      font-size: 13px;
    }
    
    .status-badge {
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
    }
    
    .application-content {
      padding: 16px 0;
    }
    
    .info-row {
      display: flex;
      margin-bottom: 12px;
    }
    
    .info-row:last-child {
      margin-bottom: 0;
    }
    
    .info-row .label {
      color: #A89A8D;
      font-size: 14px;
      min-width: 80px;
    }
    
    .info-row .value {
      color: #4A3728;
      flex: 1;
    }
    
    .review-section {
      padding-top: 16px;
    }
    
    .review-info {
      display: flex;
      margin-top: 16px;
    }
    
    .review-label {
      color: #A89A8D;
      font-size: 14px;
      min-width: 80px;
    }
    
    .review-content {
      color: #4A3728;
      flex: 1;
    }
    
    .review-time {
      display: block;
      color: #A89A8D;
      font-size: 12px;
      margin-top: 8px;
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
export class MyApplicationsComponent implements OnInit {
  applications: AdoptionApplication[] = [];
  isLoading = true;

  constructor(private adoptionService: AdoptionService) { }

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.isLoading = true;
    this.adoptionService.getMyApplications().subscribe({
      next: (apps) => {
        this.applications = apps;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      'PENDING': '待审核',
      'APPROVED': '已通过',
      'REJECTED': '已拒绝'
    };
    return statusMap[status] || status;
  }
}
