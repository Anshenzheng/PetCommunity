import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Comment } from '../../models/comment.model';
import { CommentService } from '../../services/comment.service';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comment-section',
  template: `
    <div class="comment-section">
      <h3 class="section-title">
        <mat-icon>chat_bubble</mat-icon>
        留言互动 ({{ comments.length }})
      </h3>
      
      <div class="comment-input-section" *ngIf="authService.isLoggedIn(); else loginHint">
        <form [formGroup]="commentForm" (ngSubmit)="submitComment()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>说点什么吧...</mat-label>
            <textarea matInput 
                      formControlName="content"
                      placeholder="分享您的领养经验或咨询宠物详情..."
                      rows="3"></textarea>
            <mat-error *ngIf="commentForm.get('content')?.hasError('required') && commentForm.get('content')?.touched">
              留言内容不能为空
            </mat-error>
          </mat-form-field>
          
          <div class="action-row">
            <span class="hint">留言需管理员审核后显示</span>
            <button mat-raised-button 
                    type="submit" 
                    class="submit-btn"
                    [disabled]="commentForm.invalid || isSubmitting">
              发布留言
            </button>
          </div>
        </form>
      </div>
      
      <ng-template #loginHint>
        <div class="login-hint">
          <p>
            <mat-icon>login</mat-icon>
            登录后即可参与留言互动
            <a (click)="goToLogin()">立即登录</a>
          </p>
        </div>
      </ng-template>
      
      <div class="comments-list" *ngIf="comments.length > 0; else emptyState">
        <div class="comment-item" *ngFor="let comment of comments">
          <div class="comment-avatar">
            <mat-icon>person</mat-icon>
          </div>
          
          <div class="comment-content">
            <div class="comment-header">
              <span class="comment-author">{{ comment.userName }}</span>
              <span class="comment-time">{{ comment.createdAt | date:'yyyy-MM-dd HH:mm' }}</span>
            </div>
            <p class="comment-text">{{ comment.content }}</p>
          </div>
        </div>
      </div>
      
      <ng-template #emptyState>
        <div class="empty-comments">
          <mat-icon>chat_bubble_outline</mat-icon>
          <p>暂无留言，快来抢沙发吧~</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .comment-section {
      margin-top: 48px;
      padding: 24px;
      background: white;
      border-radius: 24px;
      box-shadow: 0 4px 20px rgba(255, 154, 139, 0.1);
    }
    
    .section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 20px;
      font-weight: 600;
      color: #4A3728;
      margin: 0 0 24px 0;
    }
    
    .section-title .mat-icon {
      color: #FF9A8B;
    }
    
    .comment-input-section {
      margin-bottom: 32px;
      padding: 20px;
      background: #FFF5E6;
      border-radius: 16px;
    }
    
    .full-width {
      width: 100%;
    }
    
    .action-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 8px;
    }
    
    .hint {
      color: #A89A8D;
      font-size: 12px;
    }
    
    .submit-btn {
      background: linear-gradient(135deg, #FF9A8B 0%, #FF7B6B 100%) !important;
      color: white !important;
    }
    
    .login-hint {
      margin-bottom: 32px;
      padding: 20px;
      background: #FFF5E6;
      border-radius: 16px;
      text-align: center;
    }
    
    .login-hint p {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: #7A6B5D;
      margin: 0;
    }
    
    .login-hint a {
      color: #FF9A8B;
      text-decoration: none;
      font-weight: 600;
      cursor: pointer;
    }
    
    .comments-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    .comment-item {
      display: flex;
      gap: 16px;
      padding: 16px;
      background: #FFF9F5;
      border-radius: 16px;
    }
    
    .comment-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: linear-gradient(135deg, #FF9A8B 0%, #FFECD2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    
    .comment-avatar .mat-icon {
      color: white;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }
    
    .comment-content {
      flex: 1;
    }
    
    .comment-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    
    .comment-author {
      font-weight: 600;
      color: #4A3728;
    }
    
    .comment-time {
      color: #A89A8D;
      font-size: 12px;
    }
    
    .comment-text {
      color: #7A6B5D;
      line-height: 1.6;
      margin: 0;
    }
    
    .empty-comments {
      text-align: center;
      padding: 40px;
      color: #A89A8D;
    }
    
    .empty-comments .mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      opacity: 0.5;
    }
  `]
})
export class CommentSectionComponent implements OnInit {
  @Input() petId!: number;
  @ViewChild(FormGroupDirective) formDirective!: FormGroupDirective;
  
  comments: Comment[] = [];
  commentForm: FormGroup;
  isSubmitting = false;

  constructor(
    private commentService: CommentService,
    public authService: AuthService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.commentForm = this.fb.group({
      content: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    this.commentService.getByPet(this.petId).subscribe({
      next: (comments) => {
        this.comments = comments;
      }
    });
  }

  submitComment(): void {
    if (this.commentForm.invalid) return;
    
    this.isSubmitting = true;
    
    this.commentService.createComment({
      petId: this.petId,
      content: this.commentForm.value.content
    }).subscribe({
      next: () => {
        this.snackBar.open('留言已提交，等待审核', '关闭', { duration: 3000 });
        if (this.formDirective) {
          this.formDirective.resetForm();
        }
        this.isSubmitting = false;
        this.loadComments();
      },
      error: () => {
        this.isSubmitting = false;
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
  }
}
