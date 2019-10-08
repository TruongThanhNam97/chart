import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModeService {

  private modeSource = new BehaviorSubject(false);
  currentMode = this.modeSource.asObservable();

  constructor() { }

  changeMessage(message: boolean) {
    this.modeSource.next(message);
  }
}
