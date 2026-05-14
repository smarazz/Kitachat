import { Routes } from '@angular/router';
import { ChatComponent } from './components/chat/chat';
import { AdminComponent } from './components/admin/admin';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: 'chat',
    component: ChatComponent,
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard]
  },
  { path: '', redirectTo: '/chat', pathMatch: 'full' },
  { path: '**', redirectTo: '/chat' }
];
