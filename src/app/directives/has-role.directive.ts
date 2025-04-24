import {
  Directive,
  inject,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import Keycloak from 'keycloak-js';

@Directive({
  selector: '[hasRole]',
})
export class HasRoleDirective implements OnInit {
  private requiredRoles: string[] = [];

  private readonly keycloak: Keycloak = inject(Keycloak);
  private viewContainer: ViewContainerRef = inject(ViewContainerRef);
  private templateRef: TemplateRef<any> = inject(TemplateRef);

  constructor() {}

  @Input()
  set hasRole(roles: string | string[]) {
    this.requiredRoles = Array.isArray(roles) ? roles : [roles];
  }

  ngOnInit(): void {
    const hasRole = this.requiredRoles.some((role) =>
      this.keycloak.hasRealmRole(role),
    );

    if (hasRole) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
