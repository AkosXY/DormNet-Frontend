import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
@Injectable({ providedIn: 'root' })
export class SidenavService {
  private collapsed = signal(false);

  isCollapsed = this.collapsed.asReadonly();

  toggle() {
    this.collapsed.set(!this.collapsed());
  }

  close() {
    this.collapsed.set(true);
  }

  open() {
    this.collapsed.set(false);
  }
}
