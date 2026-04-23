export interface AdoptionApplication {
  id: number;
  petId: number;
  petName?: string;
  petPhotos?: string[];
  applicantId?: number;
  applicantName?: string;
  applicantEmail?: string;
  applicantPhone?: string;
  reason: string;
  livingEnvironment?: string;
  petExperience?: string;
  contactPhone?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reviewComment?: string;
  createdAt: Date;
  reviewedAt?: Date;
}
