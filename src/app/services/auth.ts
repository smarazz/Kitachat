import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isInternalOperatorSubject = new BehaviorSubject<boolean>(true);
  isInternalOperator$: Observable<boolean> = this.isInternalOperatorSubject.asObservable();

  constructor() {}

  isAuthenticated(): boolean {
    return this.isInternalOperatorSubject.value;
  }

  setInternalStatus(status: boolean): void {
    this.isInternalOperatorSubject.next(status);
  }
}
