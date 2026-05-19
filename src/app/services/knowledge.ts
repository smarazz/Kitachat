import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Source {
  documentName: string;
  section: string;
}

export interface Message {
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  sources?: Source[];
}

export interface DocumentInfo {
  name: string;
  uploadDate: Date;
  status: 'indexed' | 'processing';
}

@Injectable({
  providedIn: 'root'
})
export class KnowledgeService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  private documentsSubject = new BehaviorSubject<DocumentInfo[]>([]);

  constructor() {
    this.refreshDocuments();
  }

  private refreshDocuments(): void {
    this.http.get<DocumentInfo[]>(`${this.apiUrl}/documents`).subscribe(docs => {
      this.documentsSubject.next(docs);
    });
  }

  getDocuments(): Observable<DocumentInfo[]> {
    return this.documentsSubject.asObservable();
  }

  uploadFile(file: File): Observable<DocumentInfo> {
    const formData = new FormData();
    formData.append('file', file);

    return new Observable<DocumentInfo>(observer => {
      this.http.post<DocumentInfo>(`${this.apiUrl}/documents`, formData).subscribe({
        next: (newDoc) => {
          this.refreshDocuments();
          observer.next(newDoc);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  deleteDocument(name: string): Observable<boolean> {
    return new Observable<boolean>(observer => {
      this.http.delete(`${this.apiUrl}/documents/${name}`).subscribe({
        next: () => {
          this.refreshDocuments();
          observer.next(true);
          observer.complete();
        },
        error: () => {
          observer.next(false);
          observer.complete();
        }
      });
    });
  }

  sendMessage(query: string): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/chat`, { query });
  }
}
