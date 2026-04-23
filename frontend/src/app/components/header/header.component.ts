import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-header',
  template: `
    <mat-toolbar color="primary" class="toolbar">
      <div class="toolbar-left">
        <button mat-icon-button [routerLink]="['/']">
          <mat-icon>pets</mat-icon>
        </button>
        <span class="app-title" [routerLink]="['/']">萌宠社区</span>
        
        <div class="nav-links">
          <a mat-button [routerLink]="['/']" routerLinkActive="active-link" [routerLinkActiveOptions]="{exact: true}">
            <mat-icon>home</mat-icon>
            首页
          </a>
          <a mat-button [routerLink]="['/favorites']" routerLinkActive="active-link" *ngIf="authService.isLoggedIn() && !authService.isAdmin()">
            <mat-icon>favorite</mat-icon>
            我的收藏
          </a>
        </div>
      </div>
      
      <div class="toolbar-right">
        <ng-container *ngIf="!authService.isLoggedIn(); else loggedIn">
          <button mat-button [routerLink]="['/login']">
            <mat-icon>login</mat-icon>
            登录
          </button>
          <button mat-raised-button color="accent" [routerLink]="['/register']">
            注册
          </button>
        </ng-container>
        
        <ng-template #loggedIn>
          <button mat-raised-button class="add-pet-btn" [routerLink]="['/pet-add']" *ngIf="!authService.isAdmin()">
            <mat-icon>add</mat-icon>
            发布宠物
          </button>
          
          <button mat-icon-button [matMenuTriggerFor]="userMenu">
            <mat-icon>account_circle</mat-icon>
          </button>
          
          <mat-menu #userMenu="matMenu">
            <div class="menu-user-info" *ngIf="currentUser">
              <div class="menu-username">{{ currentUser.username }}</div>
              <div class="menu-role">{{ currentUser.role === 'ADMIN' ? '管理员' : '普通用户' }}</div>
            </div>
            <mat-divider></mat-divider>
            <button mat-menu-item [routerLink]="['/profile']">
              <mat-icon>person</mat-icon>
              个人中心
            </button>
            <ng-container *ngIf="!authService.isAdmin()">
              <button mat-menu-item [routerLink]="['/my-pets']">
                <mat-icon>pets</mat-icon>
                我的宠物
              </button>
              <button mat-menu-item [routerLink]="['/my-applications']">
                <mat-icon>assignment</mat-icon>
                我的申请
              </button>
              <button mat-menu-item [routerLink]="['/favorites']">
                <mat-icon>favorite</mat-icon>
                我的收藏
              </button>
            </ng-container>
            <ng-container *ngIf="authService.isAdmin()">
              <mat-divider></mat-divider>
              <button mat-menu-item [routerLink]="['/admin']">
                <mat-icon>admin_panel_settings</mat-icon>
                管理后台
              </button>
            </ng-container>
            <mat-divider></mat-divider>
            <button mat-menu-item (click)="logout()">
              <mat-icon>logout</mat-icon>
              退出登录
            </button>
          </mat-menu>
        </ng-template>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .toolbar {
      background: linear-gradient(135deg, #FF9A8B 0%, #FFECD2 100%);
      height: 80px;
      padding: 0 24px;
      box-shadow: 0 4px 20px rgba(255, 154, 139, 0.2);
    }
    
    .toolbar-left {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .app-title {
      font-size: 24px;
      font-weight: 700;
      color: #4A3728;
      cursor: pointer;
      margin-right: 24px;
    }
    
    .nav-links {
      display: flex;
      gap: 8px;
    }
    
    .nav-links a {
      color: #4A3728;
      border-radius: 25px;
      padding: 8px 16px;
    }
    
    .nav-links a:hover, .nav-links a.active-link {
      background: rgba(74, 55, 40, 0.1);
    }
    
    .toolbar-right {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .add-pet-btn {
      background: linear-gradient(135deg, #FF9A8B 0%, #FF7B6B 100%) !important;
      color: white !important;
    }
    
    .menu-user-info {
      padding: 8px 16px;
    }
    
    .menu-username {
      font-weight: 600;
      color: #4A3728;
    }
    
    .menu-role {
      font-size: 12px;
      color: #A89A8D;
    }
  `]
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;

  constructor(
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
