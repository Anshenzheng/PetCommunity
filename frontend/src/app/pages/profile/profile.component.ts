import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  template: `
    <div class="profile-container">
      <div class="page-header">
        <h1 class="page-title">
          <mat-icon>person</mat-icon>
          个人中心
        </h1>
      </div>
      
      <div class="profile-content" *ngIf="user">
        <mat-card class="profile-card">
          <div class="avatar-section">
            <div class="avatar">
              <mat-icon>person</mat-icon>
            </div>
            <div class="user-info">
              <h2>{{ user.username }}</h2>
              <span class="role-badge" [class.admin]="user.role === 'ADMIN'">
                {{ user.role === 'ADMIN' ? '管理员' : '普通用户' }}
              </span>
            </div>
          </div>
          
          <mat-divider></mat-divider>
          
          <div class="info-section">
            <div class="info-item">
              <mat-icon>email</mat-icon>
              <div class="info-content">
                <span class="info-label">邮箱</span>
                <span class="info-value">{{ user.email }}</span>
              </div>
            </div>
            
            <div class="info-item">
              <mat-icon>phone</mat-icon>
              <div class="info-content">
                <span class="info-label">手机号</span>
                <span class="info-value">{{ user.phone || '未设置' }}</span>
              </div>
            </div>
            
            <div class="info-item">
              <mat-icon>calendar_today</mat-icon>
              <div class="info-content">
                <span class="info-label">注册时间</span>
                <span class="info-value">{{ user.createdAt | date:'yyyy-MM-dd HH:mm' }}</span>
              </div>
            </div>
          </div>
        </mat-card>
        
        <div class="quick-actions">
          <h3 class="section-title">快捷操作</h3>
          
          <div class="actions-grid">
            <mat-card class="action-card card-hover" routerLink="/my-pets">
              <mat-icon>pets</mat-icon>
              <span>我的宠物</span>
            </mat-card>
            
            <mat-card class="action-card card-hover" routerLink="/my-applications">
              <mat-icon>assignment</mat-icon>
              <span>我的申请</span>
            </mat-card>
            
            <mat-card class="action-card card-hover" routerLink="/favorites">
              <mat-icon>favorite</mat-icon>
              <span>我的收藏</span>
            </mat-card>
            
            <mat-card class="action-card card-hover" routerLink="/pet-add">
              <mat-icon>add_circle</mat-icon>
              <span>发布宠物</span>
            </mat-card>
            
            <mat-card class="action-card card-hover" routerLink="/admin" *ngIf="user.role === 'ADMIN'">
              <mat-icon>admin_panel_settings</mat-icon>
              <span>管理后台</span>
            </mat-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 24px;
    }
    
    .page-header {
      margin-bottom: 24px;
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
    
    .profile-card {
      padding: 24px;
      margin-bottom: 32px;
    }
    
    .avatar-section {
      display: flex;
      align-items: center;
      gap: 24px;
      padding: 16px 0;
    }
    
    .avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background: linear-gradient(135deg, #FF9A8B 0%, #FFECD2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .avatar .mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: white;
    }
    
    .user-info h2 {
      font-size: 28px;
      font-weight: 700;
      color: #4A3728;
      margin: 0 0 8px 0;
    }
    
    .role-badge {
      background: linear-gradient(135deg, #FFECD2 0%, #FFF8E7 100%);
      color: #4A3728;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 600;
    }
    
    .role-badge.admin {
      background: linear-gradient(135deg, #FF9A8B 0%, #FF7B6B 100%);
      color: white;
    }
    
    .info-section {
      padding: 16px 0;
    }
    
    .info-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 0;
      border-bottom: 1px solid #FFECD2;
    }
    
    .info-item:last-child {
      border-bottom: none;
    }
    
    .info-item .mat-icon {
      color: #FF9A8B;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }
    
    .info-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .info-label {
      color: #A89A8D;
      font-size: 12px;
    }
    
    .info-value {
      color: #4A3728;
      font-size: 16px;
      font-weight: 500;
    }
    
    .section-title {
      font-size: 20px;
      font-weight: 600;
      color: #4A3728;
      margin: 0 0 20px 0;
    }
    
    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 16px;
    }
    
    .action-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px;
      cursor: pointer;
      text-align: center;
    }
    
    .action-card .mat-icon {
      color: #FF9A8B;
      font-size: 36px;
      width: 36px;
      height: 36px;
      margin-bottom: 12px;
    }
    
    .action-card span {
      color: #4A3728;
      font-size: 14px;
      font-weight: 500;
    }
  `]
})
export class ProfileComponent implements OnInit {
  user: User | null = null;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });
  }
}
