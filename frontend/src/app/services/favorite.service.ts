import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pet } from '../models/pet.model';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private apiUrl = 'http://localhost:8080/api/favorites';

  constructor(private http: HttpClient) { }

  getMyFavorites(): Observable<Pet[]> {
    return this.http.get<Pet[]>(this.apiUrl);
  }

  isFavorited(petId: number): Observable<{ favorited: boolean }> {
    return this.http.get<{ favorited: boolean }>(`${this.apiUrl}/check/${petId}`);
  }

  toggleFavorite(petId: number): Observable<{ message: string; favorited: boolean }> {
    return this.http.post<{ message: string; favorited: boolean }>(`${this.apiUrl}/${petId}`, {});
  }
}
