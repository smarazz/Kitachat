import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { KnowledgeService, DocumentInfo } from '../../services/knowledge';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog';
import { LucideAngularModule, Upload, File, CheckCircle, RefreshCcw, Trash2 } from 'lucide-angular';

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
    MatDialogModule,
    MatSnackBarModule,
    LucideAngularModule
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class AdminComponent implements OnInit {
  documents: DocumentInfo[] = [];
  displayedColumns: string[] = ['name', 'date', 'status', 'actions'];
  isUploading: boolean = false;

  readonly UploadIcon = Upload;
  readonly FileIcon = File;
  readonly CheckIcon = CheckCircle;
  readonly RefreshIcon = RefreshCcw;
  readonly TrashIcon = Trash2;

  constructor(
    private knowledgeService: KnowledgeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.knowledgeService.getDocuments().subscribe(docs => {
      this.documents = [...docs];
      this.cdr.detectChanges();
    });
  }

  onFileSelected(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      this.isUploading = true;
      this.knowledgeService.uploadFile(file).subscribe(() => {
        this.isUploading = false;
        this.loadDocuments();
        this.snackBar.open('File caricato con successo', 'Chiudi', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      });
    }
  }

  deleteDocument(doc: DocumentInfo): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { fileName: doc.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.knowledgeService.deleteDocument(doc.name).subscribe(() => {
          this.loadDocuments();
          this.snackBar.open('File eliminato', 'Chiudi', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
        });
      }
    });
  }
}
