import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  
  if (password?.value !== confirmPassword?.value) {
    return { passwordMismatch: true };
  }
  return null;
};

@Component({
  selector: 'app-register',
  template: `
    <div class="auth-container">
      <mat-card class="auth-card">
        <div class="auth-header">
          <mat-icon class="auth-icon">favorite</mat-icon>
          <h1>加入萌宠社区</h1>
          <p>创建账号，为流浪宠物寻找温暖的家</p>
        </div>
        
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <mat-form-field appearance="outline">
            <mat-label>用户名</mat-label>
            <input matInput formControlName="username" placeholder="请输入用户名" />
            <mat-icon matSuffix>person</mat-icon>
            <mat-error *ngIf="registerForm.get('username')?.hasError('required')">
              用户名不能为空
            </mat-error>
            <mat-error *ngIf="registerForm.get('username')?.hasError('minlength')">
              用户名至少3个字符
            </mat-error>
          </mat-form-field>
          
          <mat-form-field appearance="outline">
            <mat-label>邮箱</mat-label>
            <input matInput formControlName="email" placeholder="请输入邮箱" type="email" />
            <mat-icon matSuffix>email</mat-icon>
            <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
              邮箱不能为空
            </mat-error>
            <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
              请输入有效的邮箱地址
            </mat-error>
          </mat-form-field>
          
          <mat-form-field appearance="outline">
            <mat-label>手机号（选填）</mat-label>
            <input matInput formControlName="phone" placeholder="请输入手机号" />
            <mat-icon matSuffix>phone</mat-icon>
          </mat-form-field>
          
          <mat-form-field appearance="outline">
            <mat-label>密码</mat-label>
            <input matInput formControlName="password" [type]="hidePassword ? 'password' : 'text'" placeholder="请输入密码" />
            <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
              <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
              密码不能为空
            </mat-error>
            <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
              密码至少6个字符
            </mat-error>
          </mat-form-field>
          
          <mat-form-field appearance="outline">
            <mat-label>确认密码</mat-label>
            <input matInput formControlName="confirmPassword" [type]="hideConfirmPassword ? 'password' : 'text'" placeholder="请再次输入密码" />
            <button mat-icon-button matSuffix (click)="hideConfirmPassword = !hideConfirmPassword" type="button">
              <mat-icon>{{ hideConfirmPassword ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            <mat-error *ngIf="registerForm.get('confirmPassword')?.hasError('required')">
              请确认密码
            </mat-error>
            <mat-error *ngIf="registerForm.hasError('passwordMismatch') && registerForm.get('confirmPassword')?.dirty">
              两次输入的密码不一致
            </mat-error>
          </mat-form-field>
          
          <button mat-raised-button type="submit" class="submit-btn" [disabled]="registerForm.invalid || isLoading">
            <mat-spinner diameter="20" *ngIf="isLoading"></mat-spinner>
            <span *ngIf="!isLoading">注册</span>
          </button>
        </form>
        
        <div class="auth-footer">
          <p>已有账号？<a routerLink="/login">立即登录</a></p>
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
      gap: 16px;
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
      margin-top: 8px;
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
  `]
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;
    
    this.isLoading = true;
    const { confirmPassword, ...registerData } = this.registerForm.value;
    
    this.authService.register(registerData).subscribe({
      next: () => {
        this.snackBar.open('注册成功！请登录', '关闭', { duration: 3000 });
        this.router.navigate(['/login']);
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
