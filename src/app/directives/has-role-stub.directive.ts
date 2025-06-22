import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[hasRole]',
  standalone: true,
})
export class HasRoleStubDirective {
  @Input() hasRole: string | string[];
}
