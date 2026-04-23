export interface Comment {
  id: number;
  petId: number;
  userId?: number;
  userName?: string;
  userAvatar?: string;
  content: string;
  approved: boolean;
  createdAt: Date;
}
