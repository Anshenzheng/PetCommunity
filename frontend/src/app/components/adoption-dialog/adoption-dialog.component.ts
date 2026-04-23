import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdoptionService } from '../../services/adoption.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface AdoptionDialogData {
  petId: number;
  petName: string;
}

@Component({
  selector: 'app-adoption-dialog',
  template: `
    <h2 mat-dialog-title>
      <mat-icon>favorite</mat-icon>
      申请领养 {{ data.petName }}
    </h2>
    
    <mat-dialog-content>
      <form [formGroup]="adoptionForm" class="adoption-form">
        <p class="form-hint">请认真填写以下信息，让我们更好地了解您</p>
        
        <mat-form-field appearance="outline">
          <mat-label>领养原因 *</mat-label>
          <textarea matInput 
                    formControlName="reason"
                    placeholder="请详细描述您为什么想要领养这只宠物..."
                    rows="4"></textarea>
          <mat-error *ngIf="adoptionForm.get('reason')?.hasError('required')">
            领养原因不能为空
          </mat-error>
        </mat-form-field>
        
        <mat-form-field appearance="outline">
          <mat-label>居住环境</mat-label>
          <mat-select formControlName="livingEnvironment">
            <mat-option value="公寓">公寓</mat-option>
            <mat-option value="别墅">别墅</mat-option>
            <mat-option value="农村">农村</mat-option>
            <mat-option value="其他">其他</mat-option>
          </mat-select>
        </mat-form-field>
        
        <mat-form-field appearance="outline">
          <mat-label>养宠经验</mat-label>
          <mat-select formControlName="petExperience">
            <mat-option value="无经验">无经验</mat-option>
            <mat-option value="有过经验">有过经验</mat-option>
            <mat-option value="经验丰富">经验丰富</mat-option>
          </mat-select>
        </mat-form-field>
        
        <mat-form-field appearance="outline">
          <mat-label>联系电话</mat-label>
          <input matInput formControlName="contactPhone" placeholder="请输入您的联系电话" />
        </mat-form-field>
      </form>
    </mat-dialog-content>
    
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">取消</button>
      <button mat-raised-button 
              class="submit-btn"
              [disabled]="adoptionForm.invalid || isSubmitting"
              (click)="onSubmit()">
        <mat-spinner diameter="20" *ngIf="isSubmitting"></mat-spinner>
        <span *ngIf="!isSubmitting">提交申请</span>
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    h2 {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #4A3728;
    }
    
    h2 .mat-icon {
      color: #FF9A8B;
    }
    
    .adoption-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      min-width: 400px;
    }
    
    .form-hint {
      color: #A89A8D;
      font-size: 14px;
      margin: 0 0 8px 0;
    }
    
    textarea {
      min-height: 100px;
    }
    
    .submit-btn {
      background: linear-gradient(135deg, #FF9A8B 0%, #FF7B6B 100%) !important;
      color: white !important;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    mat-dialog-actions {
      padding: 16px 24px;
    }
  `]
})
export class AdoptionDialogComponent {
  adoptionForm: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AdoptionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AdoptionDialogData,
    private adoptionService: AdoptionService,
    private snackBar: MatSnackBar
  ) {
    this.adoptionForm = this.fb.group({
      reason: ['', Validators.required],
      livingEnvironment: [''],
      petExperience: [''],
      contactPhone: ['']
    });
  }

  onSubmit(): void {
    if (this.adoptionForm.invalid) return;
    
    this.isSubmitting = true;
    
    const applicationData = {
      petId: this.data.petId,
      ...this.adoptionForm.value
    };
    
    this.adoptionService.submitApplication(applicationData).subscribe({
      next: () => {
        this.snackBar.open('申请提交成功！', '关闭', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: () => {
        this.isSubmitting = false;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
