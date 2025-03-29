import {APP_INITIALIZER, ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { KeycloakService, KeycloakAngularModule } from 'keycloak-angular';

function initializeKeycloak(keycloak: KeycloakService) {
  console.log('Initializing Keycloak...');
  return () =>
    keycloak.init({
      config: {
        url: 'http://localhost',
        realm: 'dormnet',
        clientId: 'dormnet-api',
      },
      initOptions: {
        onLoad: 'login-required',
        checkLoginIframe: false,
        flow: "standard"
      },
    });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    KeycloakService,
    KeycloakAngularModule,
    {
      provide:
      APP_INITIALIZER,
      useFactory: initializeKeycloak,
      deps: [KeycloakService],
      multi: true,
    }
  ]
};
