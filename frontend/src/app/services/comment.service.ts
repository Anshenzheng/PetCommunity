import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://localhost:8080/api/comments';
  private adminApiUrl = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) { }

  getByPet(petId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/pet/${petId}`);
  }

  createComment(comment: Partial<Comment>): Observable<Comment> {
    return this.http.post<Comment>(this.apiUrl, comment);
  }

  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getPendingComments(): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.adminApiUrl}/comments/pending`);
  }

  approveComment(id: number): Observable<Comment> {
    return this.http.post<Comment>(`${this.adminApiUrl}/comments/${id}/approve`, {});
  }
}
