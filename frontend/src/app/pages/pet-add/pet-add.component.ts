import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PetService } from '../../services/pet.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Pet } from '../../models/pet.model';

@Component({
  selector: 'app-pet-add',
  template: `
    <div class="add-container">
      <div class="page-header">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1 class="page-title">{{ isEdit ? '编辑宠物信息' : '发布宠物信息' }}</h1>
      </div>
      
      <mat-card class="form-card">
        <form [formGroup]="petForm" (ngSubmit)="onSubmit()">
          <div class="form-section">
            <h3 class="section-title">
              <mat-icon>camera_alt</mat-icon>
              宠物照片
            </h3>
            <div class="photo-upload">
              <div class="photo-preview" *ngFor="let photo of photoUrls; let i = index">
                <img [src]="photo" alt="预览" />
                <button type="button" mat-icon-button class="remove-btn" (click)="removePhoto(i)">
                  <mat-icon>close</mat-icon>
                </button>
              </div>
              <div class="photo-placeholder" *ngIf="photoUrls.length < 5" (click)="fileInput.click()">
                <mat-icon>add_photo_alternate</mat-icon>
                <span>点击上传照片</span>
                <span class="hint">最多5张</span>
                <input type="file" 
                       accept="image/*" 
                       multiple 
                       (change)="onFileSelected($event)"
                       hidden 
                       #fileInput />
              </div>
            </div>
          </div>
          
          <div class="form-section">
            <h3 class="section-title">
              <mat-icon>info</mat-icon>
              基本信息
            </h3>
            
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>宠物名称 *</mat-label>
                <input matInput formControlName="name" placeholder="请输入宠物名称" />
                <mat-error *ngIf="petForm.get('name')?.hasError('required')">
                  宠物名称不能为空
                </mat-error>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>物种 *</mat-label>
                <mat-select formControlName="species">
                  <mat-option value="狗">狗</mat-option>
                  <mat-option value="猫">猫</mat-option>
                  <mat-option value="兔子">兔子</mat-option>
                  <mat-option value="仓鼠">仓鼠</mat-option>
                  <mat-option value="其他">其他</mat-option>
                </mat-select>
                <mat-error *ngIf="petForm.get('species')?.hasError('required')">
                  请选择物种
                </mat-error>
              </mat-form-field>
            </div>
            
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>品种</mat-label>
                <input matInput formControlName="breed" placeholder="例如：金毛、布偶等" />
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>年龄</mat-label>
                <input matInput formControlName="age" placeholder="例如：1岁、3个月等" />
              </mat-form-field>
            </div>
            
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>性别</mat-label>
                <mat-select formControlName="gender">
                  <mat-option value="公">公</mat-option>
                  <mat-option value="母">母</mat-option>
                </mat-select>
              </mat-form-field>
              
              <mat-form-field appearance="outline">
                <mat-label>毛色</mat-label>
                <input matInput formControlName="color" placeholder="例如：金色、黑白等" />
              </mat-form-field>
            </div>
          </div>
          
          <div class="form-section">
            <h3 class="section-title">
              <mat-icon>psychology</mat-icon>
              详细介绍
            </h3>
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>性格特点</mat-label>
              <textarea matInput 
                        formControlName="personality"
                        placeholder="描述宠物的性格特点，例如：活泼开朗、温顺粘人等..."
                        rows="3"></textarea>
            </mat-form-field>
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>详细描述</mat-label>
              <textarea matInput 
                        formControlName="description"
                        placeholder="详细描述宠物的情况、健康状况、送养原因等..."
                        rows="5"></textarea>
            </mat-form-field>
          </div>
          
          <div class="form-actions">
            <button mat-button type="button" (click)="goBack()">取消</button>
            <button mat-raised-button 
                    type="submit" 
                    class="submit-btn"
                    [disabled]="petForm.invalid || isSubmitting">
              <mat-spinner diameter="20" *ngIf="isSubmitting"></mat-spinner>
              <span *ngIf="!isSubmitting">{{ isEdit ? '保存修改' : '发布宠物' }}</span>
            </button>
          </div>
        </form>
      </mat-card>
    </div>
  `,
  styles: [`
    .add-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 24px;
    }
    
    .page-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
    }
    
    .page-title {
      font-size: 28px;
      font-weight: 700;
      color: #4A3728;
      margin: 0;
    }
    
    .form-card {
      padding: 32px;
    }
    
    .form-section {
      margin-bottom: 32px;
    }
    
    .section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 18px;
      font-weight: 600;
      color: #4A3728;
      margin: 0 0 20px 0;
      padding-bottom: 12px;
      border-bottom: 2px solid #FFECD2;
    }
    
    .section-title .mat-icon {
      color: #FF9A8B;
    }
    
    .photo-upload {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }
    
    .photo-preview {
      position: relative;
      width: 120px;
      height: 120px;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    .photo-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .remove-btn {
      position: absolute;
      top: 4px;
      right: 4px;
      width: 28px;
      height: 28px;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 50%;
    }
    
    .remove-btn .mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: white;
    }
    
    .photo-placeholder {
      width: 120px;
      height: 120px;
      border: 2px dashed #FF9A8B;
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      background: #FFF5E6;
      transition: all 0.3s ease;
    }
    
    .photo-placeholder:hover {
      background: #FFECD2;
      border-color: #FF7B6B;
    }
    
    .photo-placeholder .mat-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
      color: #FF9A8B;
      margin-bottom: 8px;
    }
    
    .photo-placeholder span {
      color: #7A6B5D;
      font-size: 13px;
    }
    
    .photo-placeholder .hint {
      font-size: 11px;
      color: #A89A8D;
      margin-top: 4px;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-bottom: 16px;
    }
    
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #FFECD2;
    }
    
    .submit-btn {
      height: 50px;
      min-width: 150px;
      font-size: 16px;
      background: linear-gradient(135deg, #FF9A8B 0%, #FF7B6B 100%) !important;
      color: white !important;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    
    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }
      
      .photo-preview, .photo-placeholder {
        width: 80px;
        height: 80px;
      }
    }
  `]
})
export class PetAddComponent implements OnInit {
  petForm: FormGroup;
  isEdit = false;
  petId!: number;
  photoUrls: string[] = [];
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private petService: PetService,
    private snackBar: MatSnackBar
  ) {
    this.petForm = this.fb.group({
      name: ['', Validators.required],
      species: ['', Validators.required],
      breed: [''],
      age: [''],
      gender: [''],
      color: [''],
      personality: [''],
      description: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.petId = Number(id);
      this.loadPet();
    }
  }

  loadPet(): void {
    this.petService.getPetById(this.petId).subscribe({
      next: (pet) => {
        this.petForm.patchValue({
          name: pet.name,
          species: pet.species,
          breed: pet.breed || '',
          age: pet.age || '',
          gender: pet.gender || '',
          color: pet.color || '',
          personality: pet.personality || '',
          description: pet.description || ''
        });
        this.photoUrls = pet.photos || [];
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      files.forEach(file => {
        if (this.photoUrls.length < 5) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.photoUrls.push(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  removePhoto(index: number): void {
    this.photoUrls.splice(index, 1);
  }

  onSubmit(): void {
    if (this.petForm.invalid) return;
    
    this.isSubmitting = true;
    
    const petData = {
      ...this.petForm.value,
      photos: this.photoUrls.length > 0 ? this.photoUrls : [
        this.getDefaultImage(this.petForm.value.species)
      ]
    };
    
    let request;
    if (this.isEdit) {
      request = this.petService.updatePet(this.petId, petData);
    } else {
      request = this.petService.createPet(petData);
    }
    
    request.subscribe({
      next: () => {
        this.snackBar.open(
          this.isEdit ? '保存成功！等待管理员审核' : '发布成功！等待管理员审核', 
          '关闭', 
          { duration: 3000 }
        );
        this.router.navigate(['/my-pets']);
      },
      error: () => {
        this.isSubmitting = false;
      }
    });
  }

  getDefaultImage(species: string): string {
    const seed: Record<string, number> = {
      '狗': 237,
      '猫': 40,
      '兔子': 158,
      '仓鼠': 102,
      '其他': 169
    };
    const imageSeed = seed[species] || seed['猫'];
    return `https://picsum.photos/seed/${imageSeed}/400/400`;
  }

  goBack(): void {
    this.router.navigate(['/my-pets']);
  }
}
