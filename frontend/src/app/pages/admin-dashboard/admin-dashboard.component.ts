import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PetService } from '../../services/pet.service';
import { AdoptionService } from '../../services/adoption.service';
import { CommentService } from '../../services/comment.service';
import { Pet } from '../../models/pet.model';
import { AdoptionApplication } from '../../models/adoption.model';
import { Comment } from '../../models/comment.model';
import { PageResponse } from '../../models/pet.model';

@Component({
  selector: 'app-admin-dashboard',
  template: `
    <div class="admin-container">
      <div class="page-header">
        <h1 class="page-title">
          <mat-icon>admin_panel_settings</mat-icon>
          管理后台
        </h1>
      </div>
      
      <mat-tab-group animationDuration="0ms">
        <mat-tab label="宠物审核">
          <div class="tab-content">
            <div *ngIf="loadingPets" class="loading-container">
              <mat-spinner diameter="50"></mat-spinner>
            </div>
            
            <div class="content" *ngIf="!loadingPets">
              <div class="pets-list" *ngIf="pendingPets.length > 0">
                <mat-card class="pet-card" *ngFor="let pet of pendingPets">
                  <div class="pet-image">
                    <img [src]="getMainPhoto(pet)" alt="{{ pet.name }}" />
                  </div>
                  
                  <div class="pet-info">
                    <div class="pet-header">
                      <h3>{{ pet.name }}</h3>
                      <span class="species-badge">{{ pet.species }}</span>
                    </div>
                    
                    <div class="pet-details">
                      <span *ngIf="pet.breed">品种：{{ pet.breed }}</span>
                      <span *ngIf="pet.age">年龄：{{ pet.age }}</span>
                      <span *ngIf="pet.gender">性别：{{ pet.gender }}</span>
                      <span>发布者：{{ pet.ownerName }}</span>
                    </div>
                    
                    <div class="pet-desc" *ngIf="pet.personality || pet.description">
                      <p *ngIf="pet.personality"><strong>性格：</strong>{{ pet.personality }}</p>
                      <p *ngIf="pet.description"><strong>介绍：</strong>{{ pet.description }}</p>
                    </div>
                    
                    <div class="action-buttons">
                      <button mat-raised-button class="approve-btn" (click)="approvePet(pet)">
                        <mat-icon>check</mat-icon>
                        通过
                      </button>
                      <button mat-raised-button class="reject-btn" (click)="rejectPet(pet)">
                        <mat-icon>close</mat-icon>
                        拒绝
                      </button>
                    </div>
                  </div>
                </mat-card>
              </div>
              
              <div class="empty-state" *ngIf="pendingPets.length === 0">
                <mat-icon>check_circle</mat-icon>
                <h3>暂无待审核的宠物</h3>
                <p>所有宠物信息都已审核完成</p>
              </div>
            </div>
          </div>
        </mat-tab>
        
        <mat-tab label="领养申请审核">
          <div class="tab-content">
            <div *ngIf="loadingApplications" class="loading-container">
              <mat-spinner diameter="50"></mat-spinner>
            </div>
            
            <div class="content" *ngIf="!loadingApplications">
              <div class="applications-list" *ngIf="pendingApplications.length > 0">
                <mat-card class="application-card" *ngFor="let app of pendingApplications">
                  <div class="application-header">
                    <div class="pet-info">
                      <div class="pet-avatar" *ngIf="app.petPhotos && app.petPhotos.length > 0">
                        <img [src]="app.petPhotos[0]" alt="{{ app.petName }}" />
                      </div>
                      <div class="pet-details">
                        <h3>{{ app.petName }}</h3>
                        <span class="apply-info">
                          申请人：{{ app.applicantName }} | 
                          申请时间：{{ app.createdAt | date:'yyyy-MM-dd HH:mm' }}
                        </span>
                      </div>
                    </div>
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
                    
                    <div class="review-input">
                      <mat-form-field appearance="outline" class="full-width">
                        <mat-label>审核意见（选填）</mat-label>
                        <textarea matInput 
                                  [formControl]="getReviewControl(app.id)"
                                  placeholder="请输入审核意见..."
                                  rows="2"></textarea>
                      </mat-form-field>
                    </div>
                    
                    <div class="action-buttons">
                      <button mat-raised-button class="approve-btn" (click)="approveApplication(app)">
                        <mat-icon>check</mat-icon>
                        通过
                      </button>
                      <button mat-raised-button class="reject-btn" (click)="rejectApplication(app)">
                        <mat-icon>close</mat-icon>
                        拒绝
                      </button>
                    </div>
                  </div>
                </mat-card>
              </div>
              
              <div class="empty-state" *ngIf="pendingApplications.length === 0">
                <mat-icon>check_circle</mat-icon>
                <h3>暂无待审核的申请</h3>
                <p>所有领养申请都已审核完成</p>
              </div>
            </div>
          </div>
        </mat-tab>
        
        <mat-tab label="留言审核">
          <div class="tab-content">
            <div *ngIf="loadingComments" class="loading-container">
              <mat-spinner diameter="50"></mat-spinner>
            </div>
            
            <div class="content" *ngIf="!loadingComments">
              <div class="comments-list" *ngIf="pendingComments.length > 0">
                <mat-card class="comment-card" *ngFor="let comment of pendingComments">
                  <div class="comment-header">
                    <div class="user-avatar">
                      <mat-icon>person</mat-icon>
                    </div>
                    <div class="user-info">
                      <span class="user-name">{{ comment.userName }}</span>
                      <span class="comment-time">{{ comment.createdAt | date:'yyyy-MM-dd HH:mm' }}</span>
                    </div>
                  </div>
                  
                  <div class="comment-content">
                    <p>{{ comment.content }}</p>
                  </div>
                  
                  <div class="action-buttons">
                    <button mat-raised-button class="approve-btn" (click)="approveComment(comment)">
                      <mat-icon>check</mat-icon>
                      通过
                    </button>
                    <button mat-raised-button class="reject-btn" (click)="deleteComment(comment)">
                      <mat-icon>close</mat-icon>
                      删除
                    </button>
                  </div>
                </mat-card>
              </div>
              
              <div class="empty-state" *ngIf="pendingComments.length === 0">
                <mat-icon>check_circle</mat-icon>
                <h3>暂无待审核的留言</h3>
                <p>所有留言都已审核完成</p>
              </div>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .admin-container {
      max-width: 1200px;
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
    
    ::ng-deep .mat-mdc-tab-header {
      background: white;
      border-radius: 16px 16px 0 0;
    }
    
    ::ng-deep .mat-mdc-tab-group {
      background: #FFF5E6;
      border-radius: 16px;
    }
    
    .tab-content {
      padding: 24px;
      background: #FFF5E6;
      border-radius: 0 0 16px 16px;
    }
    
    .pets-list, .applications-list, .comments-list {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    
    .pet-card {
      display: flex;
      gap: 24px;
      padding: 24px;
    }
    
    .pet-image {
      width: 160px;
      height: 160px;
      border-radius: 16px;
      overflow: hidden;
      flex-shrink: 0;
    }
    
    .pet-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .pet-info {
      flex: 1;
    }
    
    .pet-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }
    
    .pet-header h3 {
      font-size: 22px;
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
    
    .pet-details {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 12px;
      color: #7A6B5D;
      font-size: 14px;
    }
    
    .pet-desc {
      margin-bottom: 16px;
    }
    
    .pet-desc p {
      color: #7A6B5D;
      font-size: 14px;
      line-height: 1.6;
      margin: 0 0 8px 0;
    }
    
    .action-buttons {
      display: flex;
      gap: 12px;
    }
    
    .approve-btn {
      background: linear-gradient(135deg, #81C784 0%, #66BB6A 100%) !important;
      color: white !important;
    }
    
    .reject-btn {
      background: linear-gradient(135deg, #EF5350 0%, #E53935 100%) !important;
      color: white !important;
    }
    
    .application-card {
      padding: 24px;
    }
    
    .application-header {
      margin-bottom: 16px;
    }
    
    .pet-info {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .pet-avatar {
      width: 56px;
      height: 56px;
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
    
    .apply-info {
      color: #A89A8D;
      font-size: 13px;
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
    
    .review-input {
      margin-top: 16px;
      margin-bottom: 16px;
    }
    
    .full-width {
      width: 100%;
    }
    
    .comment-card {
      padding: 20px;
    }
    
    .comment-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }
    
    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #FF9A8B 0%, #FFECD2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .user-avatar .mat-icon {
      color: white;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
    
    .user-info {
      display: flex;
      flex-direction: column;
    }
    
    .user-name {
      font-weight: 600;
      color: #4A3728;
    }
    
    .comment-time {
      color: #A89A8D;
      font-size: 12px;
    }
    
    .comment-content p {
      color: #7A6B5D;
      line-height: 1.6;
      margin: 0 0 12px 0;
    }
    
    .empty-state {
      text-align: center;
      padding: 60px 24px;
      color: #A89A8D;
    }
    
    .empty-state .mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: 16px;
      opacity: 0.5;
    }
    
    .empty-state h3 {
      font-size: 20px;
      font-weight: 600;
      color: #7A6B5D;
      margin: 0 0 8px 0;
    }
    
    .empty-state p {
      font-size: 14px;
      margin: 0;
    }
    
    @media (max-width: 768px) {
      .pet-card {
        flex-direction: column;
      }
      
      .pet-image {
        width: 100%;
        height: 200px;
      }
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  pendingPets: Pet[] = [];
  pendingApplications: AdoptionApplication[] = [];
  pendingComments: Comment[] = [];
  
  loadingPets = false;
  loadingApplications = false;
  loadingComments = false;
  
  reviewControls: Map<number, FormControl> = new Map();

  constructor(
    private petService: PetService,
    private adoptionService: AdoptionService,
    private commentService: CommentService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadPendingPets();
    this.loadPendingApplications();
    this.loadPendingComments();
  }

  getReviewControl(appId: number): FormControl {
    if (!this.reviewControls.has(appId)) {
      this.reviewControls.set(appId, this.fb.control(''));
    }
    return this.reviewControls.get(appId)!;
  }

  loadPendingPets(): void {
    this.loadingPets = true;
    this.petService.findPendingApprovals(0, 100).subscribe({
      next: (response: PageResponse<Pet>) => {
        this.pendingPets = response.content;
        this.loadingPets = false;
      },
      error: () => {
        this.loadingPets = false;
      }
    });
  }

  loadPendingApplications(): void {
    this.loadingApplications = true;
    this.adoptionService.getPendingApplications(0, 100).subscribe({
      next: (response: PageResponse<AdoptionApplication>) => {
        this.pendingApplications = response.content;
        this.loadingApplications = false;
      },
      error: () => {
        this.loadingApplications = false;
      }
    });
  }

  loadPendingComments(): void {
    this.loadingComments = true;
    this.commentService.getPendingComments().subscribe({
      next: (comments) => {
        this.pendingComments = comments;
        this.loadingComments = false;
      },
      error: () => {
        this.loadingComments = false;
      }
    });
  }

  getMainPhoto(pet: Pet): string {
    if (pet.photos && pet.photos.length > 0) {
      return pet.photos[0];
    }
    return `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent('cute ' + pet.species)}&image_size=square_hd`;
  }

  approvePet(pet: Pet): void {
    this.petService.approvePet(pet.id).subscribe({
      next: () => {
        this.snackBar.open('审核通过', '关闭', { duration: 2000 });
        this.loadPendingPets();
      }
    });
  }

  rejectPet(pet: Pet): void {
    if (confirm(`确定要拒绝宠物"${pet.name}"的发布申请吗？`)) {
      this.petService.rejectPet(pet.id).subscribe({
        next: () => {
          this.snackBar.open('已拒绝', '关闭', { duration: 2000 });
          this.loadPendingPets();
        }
      });
    }
  }

  approveApplication(app: AdoptionApplication): void {
    const reviewControl = this.getReviewControl(app.id);
    const comment = reviewControl.value;
    
    this.adoptionService.approveApplication(app.id, comment).subscribe({
      next: () => {
        this.snackBar.open('申请已通过', '关闭', { duration: 2000 });
        this.loadPendingApplications();
      }
    });
  }

  rejectApplication(app: AdoptionApplication): void {
    const reviewControl = this.getReviewControl(app.id);
    const comment = reviewControl.value;
    
    this.adoptionService.rejectApplication(app.id, comment).subscribe({
      next: () => {
        this.snackBar.open('申请已拒绝', '关闭', { duration: 2000 });
        this.loadPendingApplications();
      }
    });
  }

  approveComment(comment: Comment): void {
    this.commentService.approveComment(comment.id).subscribe({
      next: () => {
        this.snackBar.open('留言已通过', '关闭', { duration: 2000 });
        this.loadPendingComments();
      }
    });
  }

  deleteComment(comment: Comment): void {
    if (confirm('确定要删除这条留言吗？')) {
      this.commentService.deleteComment(comment.id).subscribe({
        next: () => {
          this.snackBar.open('留言已删除', '关闭', { duration: 2000 });
          this.loadPendingComments();
        }
      });
    }
  }
}
