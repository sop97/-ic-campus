import { Component } from '@angular/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
})
export class HeroComponent {
  readonly stats = [
    { value: '6',    label: 'Formations disponibles' },
    { value: '10+',  label: 'Années de terrain'       },
    { value: '100%', label: 'Orienté production'      },
    { value: '< 10', label: 'Apprenants par cohorte'  },
  ] as const;
}
