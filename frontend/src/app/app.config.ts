import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import {
  MSAL_INSTANCE,
  MsalService,
  MsalBroadcastService,
  MsalModule
} from '@azure/msal-angular';
import {
  PublicClientApplication,
  BrowserCacheLocation,
  LogLevel
} from '@azure/msal-browser';
import { environment } from '../environments/environment';
import { routes } from './app.routes';

const msalInstance = new PublicClientApplication({
  auth: {
    clientId:              environment.msalConfig.auth.clientId,
    authority:             environment.msalConfig.auth.authority,
    knownAuthorities:      environment.msalConfig.auth.knownAuthorities,
    redirectUri:           environment.msalConfig.auth.redirectUri,
    postLogoutRedirectUri: environment.msalConfig.auth.postLogoutRedirectUri,
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage,
  },
  system: {
    loggerOptions: {
      logLevel: LogLevel.Warning,
      piiLoggingEnabled: false,
    },
  },
});

export function MSALInstanceFactory(): PublicClientApplication {
  return msalInstance;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // Sin interceptor MSAL — adjuntamos el token manualmente en el servicio
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(MsalModule),
    { provide: MSAL_INSTANCE, useFactory: MSALInstanceFactory },
    MsalService,
    MsalBroadcastService,
  ],
};
