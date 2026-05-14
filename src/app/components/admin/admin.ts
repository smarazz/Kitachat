import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { KnowledgeService, DocumentInfo } from '../../services/knowledge';
import { LucideAngularModule, Upload, File, CheckCircle, RefreshCcw } from 'lucide-angular';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule,
    MatIconModule,
    MatCardModule,
    MatProgressBarModule,
    LucideAngularModule
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class AdminComponent implements OnInit {
  documents: DocumentInfo[] = [];
  displayedColumns: string[] = ['name', 'date', 'status'];
  isUploading: boolean = false;

  readonly UploadIcon = Upload;
  readonly FileIcon = File;
  readonly CheckIcon = CheckCircle;
  readonly RefreshIcon = RefreshCcw;

  constructor(private knowledgeService: KnowledgeService) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.knowledgeService.getDocuments().subscribe(docs => {
      this.documents = docs;
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.isUploading = true;
      this.knowledgeService.uploadFile(file as any).subscribe(() => {
        this.isUploading = false;
        this.loadDocuments();
      });
    }
  }
}
