import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';

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
  private initialDocuments: DocumentInfo[] = [
    { name: 'Manuale_Utente_GestiPharm.pdf', uploadDate: new Date(2023, 10, 5), status: 'indexed' },
    { name: 'FAQ_Tecniche_2024.docx', uploadDate: new Date(2024, 0, 15), status: 'indexed' }
  ];

  private documentsSubject = new BehaviorSubject<DocumentInfo[]>(this.initialDocuments);

  constructor() {}

  getDocuments(): Observable<DocumentInfo[]> {
    return this.documentsSubject.asObservable();
  }

  uploadFile(file: File): Observable<DocumentInfo> {
    const newDoc: DocumentInfo = {
      name: file.name,
      uploadDate: new Date(),
      status: 'indexed'
    };
    const currentDocs = this.documentsSubject.value;
    this.documentsSubject.next([...currentDocs, newDoc]);
    return of(newDoc);
  }

  deleteDocument(name: string): Observable<boolean> {
    const currentDocs = this.documentsSubject.value;
    const index = currentDocs.findIndex(d => d.name === name);
    if (index !== -1) {
      const updatedDocs = [...currentDocs];
      updatedDocs.splice(index, 1);
      this.documentsSubject.next(updatedDocs);
      return of(true);
    }
    return of(false);
  }

  sendMessage(query: string): Observable<Message> {
    const aiResponse: Message = {
      sender: 'ai',
      timestamp: new Date(),
      text: this.getMockResponse(query),
      sources: [
        { documentName: 'Manuale_Utente_GestiPharm.pdf', section: 'Capitolo 4: Gestione Magazzino' },
        { documentName: 'FAQ_Tecniche_2024.docx', section: 'Errori comuni invio ricette' }
      ]
    };

    return of(aiResponse);
  }

  private getMockResponse(query: string): string {
    const q = query.toLowerCase();
    if (q.includes('ricetta') || q.includes('invio')) {
      return "Per l'invio delle ricette elettroniche, assicurati che il lettore smart card sia collegato correttamente. Se riscontri l'errore E04, verifica la configurazione dei certificati nel menu Impostazioni > Servizi TS.";
    }
    if (q.includes('magazzino') || q.includes('scorte')) {
      return "Il modulo magazzino consente di automatizzare il riordino basandosi sulle vendite medie degli ultimi 30 giorni. Puoi configurare le soglie critiche nella sezione Articoli.";
    }
    return "Grazie per la domanda. In base alla documentazione tecnica, questa operazione richiede l'accesso con privilegi di amministratore e la verifica del database locale.";
  }
}
