import { Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat';
import { AdminComponent } from './components/admin/admin';

export const routes: Routes = [
  { path: 'chat', component: ChatComponent },
  { path: 'admin', component: AdminComponent },
  { path: '', redirectTo: '/chat', pathMatch: 'full' },
  { path: '**', redirectTo: '/chat' }
];
