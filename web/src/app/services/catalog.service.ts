import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CatalogResponse, Training } from '../models/training.model';
import { environment } from '../../environments/environment';

/**
 * Service de catalogue IC-Campus.
 *
 * Les appels HTTP sont effectués sans en-tête Authorization :
 * l'authentification Basic Auth est ajoutée par le reverse-proxy nginx
 * via la variable d'environnement API_BASIC_AUTH injectée au démarrage
 * du conteneur ic-web. Aucun credential ne transite dans le code Angular.
 */
@Injectable({ providedIn: 'root' })
export class CatalogService {
  constructor(private readonly http: HttpClient) {}

  getCatalog(): Observable<CatalogResponse> {
    return this.http.get<CatalogResponse>(`${environment.apiBaseUrl}/catalog`);
  }

  getTraining(id: number): Observable<Training> {
    return this.http.get<Training>(`${environment.apiBaseUrl}/catalog/${id}`);
  }
}
