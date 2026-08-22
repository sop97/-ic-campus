import { Component } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeroComponent } from './components/hero/hero.component';
import { CatalogComponent } from './components/catalog/catalog.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, HeroComponent, CatalogComponent, FooterComponent],
  template: `
    <app-navbar />
    <main>
      <app-hero />
      <app-catalog />
    </main>
    <app-footer />
  `,
  styles: [`:host { display: block; min-height: 100vh; }`],
})
export class AppComponent {}
