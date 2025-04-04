import { computed, inject, Injectable } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class ResponsiveService {
  breakPointObserver: BreakpointObserver = inject(BreakpointObserver);

  private readonly small = '(max-width: 700px)';
  private readonly medium = '(min-width: 701px) and (max-width: 1200px)';
  private readonly large = '(min-width: 1201px)';

  // private readonly small = Breakpoints.Handset;
  // private readonly medium = Breakpoints.TabletLandscape;
  // private readonly large = Breakpoints.Large;

  screenWidth = toSignal(
    this.breakPointObserver.observe([this.small, this.medium, this.large]),
  );

  smallWidth = computed(() => this.screenWidth()?.breakpoints[this.small]);
  mediumWidth = computed(() => this.screenWidth()?.breakpoints[this.medium]);
  largeWidth = computed(() => this.screenWidth()?.breakpoints[this.large]);
}
