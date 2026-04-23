export interface Pet {
  id: number;
  name: string;
  species: string;
  breed?: string;
  age?: string;
  gender?: string;
  color?: string;
  personality?: string;
  description?: string;
  photos: string[];
  status: 'AVAILABLE' | 'ADOPTED' | 'PENDING';
  approved: boolean;
  ownerId?: number;
  ownerName?: string;
  ownerAvatar?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}
