import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  template: `
    <div class="auth-container">
      <mat-card class="auth-card">
        <div class="auth-header">
          <mat-icon class="auth-icon">pets</mat-icon>
          <h1>欢迎回来</h1>
          <p>登录萌宠社区，开启温暖领养之旅</p>
        </div>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline">
            <mat-label>用户名</mat-label>
            <input matInput formControlName="username" placeholder="请输入用户名" />
            <mat-icon matSuffix>person</mat-icon>
            <mat-error *ngIf="loginForm.get('username')?.hasError('required')">
              用户名不能为空
            </mat-error>
          </mat-form-field>
          
          <mat-form-field appearance="outline">
            <mat-label>密码</mat-label>
            <input matInput formControlName="password" [type]="hidePassword ? 'password' : 'text'" placeholder="请输入密码" />
            <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
              <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
              密码不能为空
            </mat-error>
          </mat-form-field>
          
          <button mat-raised-button type="submit" class="submit-btn" [disabled]="loginForm.invalid || isLoading">
            <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
            <span *ngIf="!isLoading">登录</span>
          </button>
        </form>
        
        <div class="auth-footer">
          <p>还没有账号？<a routerLink="/register">立即注册</a></p>
        </div>
        
        <div class="quick-login">
          <p>测试账号：</p>
          <div class="test-account">
            <span>管理员：admin / admin123</span>
          </div>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 120px);
      padding: 24px;
    }
    
    .auth-card {
      width: 100%;
      max-width: 450px;
      padding: 32px;
    }
    
    .auth-header {
      text-align: center;
      margin-bottom: 32px;
    }
    
    .auth-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #FF9A8B;
      margin-bottom: 16px;
    }
    
    .auth-header h1 {
      font-size: 28px;
      font-weight: 700;
      color: #4A3728;
      margin: 0 0 8px 0;
    }
    
    .auth-header p {
      color: #A89A8D;
      margin: 0;
    }
    
    form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .submit-btn {
      height: 50px;
      font-size: 16px;
      background: linear-gradient(135deg, #FF9A8B 0%, #FF7B6B 100%) !important;
      color: white !important;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
    }
    
    .auth-footer {
      text-align: center;
      margin-top: 24px;
      padding-top: 24px;
      border-top: 1px solid #FFECD2;
    }
    
    .auth-footer p {
      color: #A89A8D;
      margin: 0;
    }
    
    .auth-footer a {
      color: #FF9A8B;
      text-decoration: none;
      font-weight: 600;
    }
    
    .quick-login {
      margin-top: 24px;
      padding: 16px;
      background: #FFF5E6;
      border-radius: 12px;
    }
    
    .quick-login p {
      color: #7A6B5D;
      font-size: 12px;
      margin: 0 0 8px 0;
    }
    
    .test-account {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .test-account span {
      color: #4A3728;
      font-size: 13px;
      background: white;
      padding: 4px 12px;
      border-radius: 8px;
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  returnUrl: string;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    
    this.isLoading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.snackBar.open('登录成功！', '关闭', { duration: 2000 });
        this.router.navigate([this.returnUrl]);
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
