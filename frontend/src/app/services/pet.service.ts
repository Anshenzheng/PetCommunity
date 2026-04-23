import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pet, PageResponse } from '../models/pet.model';

@Injectable({
  providedIn: 'root'
})
export class PetService {
  private apiUrl = 'http://localhost:8080/api/pets';

  constructor(private http: HttpClient) { }

  getApprovedPets(page: number = 0, size: number = 12): Observable<PageResponse<Pet>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PageResponse<Pet>>(`${this.apiUrl}/public`, { params });
  }

  getPetsByStatus(status: string, page: number = 0, size: number = 12): Observable<PageResponse<Pet>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PageResponse<Pet>>(`${this.apiUrl}/public/status/${status}`, { params });
  }

  searchPets(keyword: string, page: number = 0, size: number = 12): Observable<PageResponse<Pet>> {
    const params = new HttpParams()
      .set('keyword', keyword)
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PageResponse<Pet>>(`${this.apiUrl}/public/search`, { params });
  }

  getPetById(id: number): Observable<Pet> {
    return this.http.get<Pet>(`${this.apiUrl}/public/${id}`);
  }

  getMyPets(): Observable<Pet[]> {
    return this.http.get<Pet[]>(`${this.apiUrl}/my`);
  }

  createPet(pet: Partial<Pet>): Observable<Pet> {
    return this.http.post<Pet>(this.apiUrl, pet);
  }

  updatePet(id: number, pet: Partial<Pet>): Observable<Pet> {
    return this.http.put<Pet>(`${this.apiUrl}/${id}`, pet);
  }

  deletePet(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
