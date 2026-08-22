import { Component, Input } from '@angular/core';
import { Training } from '../../models/training.model';

@Component({
  selector: 'app-training-card',
  standalone: true,
  imports: [],
  templateUrl: './training-card.component.html',
  styleUrl: './training-card.component.scss',
})
export class TrainingCardComponent {
  @Input({ required: true }) training!: Training;

  get priceFormatted(): string {
    return new Intl.NumberFormat('fr-FR').format(this.training.price) + ' €';
  }

  get cardImage(): string {
    const t = this.training.title.toLowerCase();
    if (t.includes('docker'))                                return 'assets/img/card-docker.jpeg';
    if (t.includes('kubernetes'))                            return 'assets/img/card-kubernetes.jpeg';
    if (t.includes('ansible'))                               return 'assets/img/card-ansible.jpeg';
    if (t.includes('terraform'))                             return 'assets/img/card-terraform.jpeg';
    if (t.includes('ci/cd') || t.includes('jenkins'))       return 'assets/img/card-cicd.jpeg';
    if (t.includes('devsecops') || t.includes('sécurité'))  return 'assets/img/card-devsecops.jpeg';
    return 'assets/img/card-docker.jpeg';
  }
}
