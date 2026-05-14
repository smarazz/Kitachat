import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { KnowledgeService, Message } from '../../services/knowledge';
import { LucideAngularModule, Send, User, Bot, FileText } from 'lucide-angular';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    LucideAngularModule
  ],
  templateUrl: './chat.html',
  styleUrl: './chat.scss'
})
export class ChatComponent implements OnInit {
  messages: Message[] = [];
  userInput: string = '';
  isLoading: boolean = false;

  readonly SendIcon = Send;
  readonly UserIcon = User;
  readonly BotIcon = Bot;
  readonly FileTextIcon = FileText;

  constructor(private knowledgeService: KnowledgeService) {}

  ngOnInit(): void {
    this.messages.push({
      text: 'Ciao! Sono l\'assistente AI del supporto tecnico. Come posso aiutarti oggi?',
      sender: 'ai',
      timestamp: new Date()
    });
  }

  sendMessage(): void {
    if (!this.userInput.trim() || this.isLoading) return;

    const userMessage: Message = {
      text: this.userInput,
      sender: 'user',
      timestamp: new Date()
    };

    this.messages.push(userMessage);
    const query = this.userInput;
    this.userInput = '';
    this.isLoading = true;

    this.knowledgeService.sendMessage(query).subscribe({
      next: (response) => {
        this.messages.push(response);
        this.isLoading = false;
        this.scrollToBottom();
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const container = document.querySelector('.messages-container');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 100);
  }
}
