import { Component, OnInit, computed, signal } from '@angular/core';
import { CatalogService } from '../../services/catalog.service';
import { Training } from '../../models/training.model';
import { TrainingCardComponent } from '../training-card/training-card.component';

type LevelFilter = 'Tous' | 'Débutant' | 'Intermédiaire' | 'Avancé';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [TrainingCardComponent],
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
})
export class CatalogComponent implements OnInit {
  readonly filters: LevelFilter[] = ['Tous', 'Débutant', 'Intermédiaire', 'Avancé'];

  trainings  = signal<Training[]>([]);
  loading    = signal(true);
  error      = signal<string | null>(null);
  activeFilter = signal<LevelFilter>('Tous');

  filteredTrainings = computed(() => {
    const f   = this.activeFilter();
    const all = this.trainings();
    return f === 'Tous' ? all : all.filter(t => t.level === f);
  });

  constructor(private readonly catalogService: CatalogService) {}

  ngOnInit(): void {
    this.catalogService.getCatalog().subscribe({
      next: ({ catalog }) => {
        this.trainings.set(catalog);
        this.loading.set(false);
      },
      error: err => {
        this.error.set(
          "Impossible de charger le catalogue. Vérifiez que l'API est démarrée et accessible."
        );
        this.loading.set(false);
        console.error('[CatalogComponent] API error:', err);
      },
    });
  }

  setFilter(filter: LevelFilter): void {
    this.activeFilter.set(filter);
  }
}
