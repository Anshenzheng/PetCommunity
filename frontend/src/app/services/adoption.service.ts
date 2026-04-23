import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdoptionApplication } from '../models/adoption.model';
import { PageResponse } from '../models/pet.model';

@Injectable({
  providedIn: 'root'
})
export class AdoptionService {
  private apiUrl = 'http://localhost:8080/api/adoptions';
  private adminApiUrl = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) { }

  getMyApplications(): Observable<AdoptionApplication[]> {
    return this.http.get<AdoptionApplication[]>(`${this.apiUrl}/my`);
  }

  getApplicationsByPet(petId: number): Observable<AdoptionApplication[]> {
    return this.http.get<AdoptionApplication[]>(`${this.apiUrl}/pet/${petId}`);
  }

  submitApplication(application: Partial<AdoptionApplication>): Observable<AdoptionApplication> {
    return this.http.post<AdoptionApplication>(this.apiUrl, application);
  }

  getAllApplications(page: number = 0, size: number = 10): Observable<PageResponse<AdoptionApplication>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PageResponse<AdoptionApplication>>(`${this.adminApiUrl}/adoptions`, { params });
  }

  getPendingApplications(page: number = 0, size: number = 10): Observable<PageResponse<AdoptionApplication>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PageResponse<AdoptionApplication>>(`${this.adminApiUrl}/adoptions/pending`, { params });
  }

  approveApplication(id: number, comment?: string): Observable<AdoptionApplication> {
    return this.http.post<AdoptionApplication>(`${this.adminApiUrl}/adoptions/${id}/approve`, { comment });
  }

  rejectApplication(id: number, comment?: string): Observable<AdoptionApplication> {
    return this.http.post<AdoptionApplication>(`${this.adminApiUrl}/adoptions/${id}/reject`, { comment });
  }
}
