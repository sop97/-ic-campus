export type TrainingLevel = 'Débutant' | 'Intermédiaire' | 'Avancé';

export interface Training {
  id: number;
  title: string;
  description: string;
  duration: string;
  level: TrainingLevel;
  instructor: string;
  price: number;
  category: string;
  topics: string[];
}

export interface CatalogResponse {
  catalog: Training[];
  total: number;
  version: string;
}
