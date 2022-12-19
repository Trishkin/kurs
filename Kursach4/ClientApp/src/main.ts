import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { NavMenuComponent } from './app/nav-menu/nav-menu.component';
import { environment } from './environments/environment';

export function getBaseUrl() {
  return "http://localhost:30923/";
}
export function appInitializer(navMenuComponent: NavMenuComponent) {
  navMenuComponent.logOut();
  }
const providers = [
  { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] }
];

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic(providers).bootstrapModule(AppModule)
  .catch(err => console.log(err));
