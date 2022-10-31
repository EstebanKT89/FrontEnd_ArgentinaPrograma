import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Experiencia } from '../model/experiencia';

@Injectable({
  providedIn: 'root',
})
export class ExperienciaService {
  expURL = environment.URL + 'expLab/';

  private _refresh$ = new Subject<void>();

get refresh$(){
  return this._refresh$;
}

  constructor(private httpClient: HttpClient) {}

  public lista(): Observable<Experiencia[]> {
    return this.httpClient.get<Experiencia[]>(this.expURL + 'lista');
  }

  public detail(id: number): Observable<Experiencia> {
    return this.httpClient.get<Experiencia>(this.expURL + `detail/${id}`)
    .pipe(
      tap(() => {
        this._refresh$.next();
      })
    )
  }

  public save(experiencia: Experiencia): Observable<any> {
    return this.httpClient.post<any>(this.expURL + 'create', experiencia)
    .pipe(
      tap(() => {
        this._refresh$.next();
      })
    )
  }

  public update(id: number, experiencia: Experiencia): Observable<any> {
    return this.httpClient.put<any>(this.expURL + `update/${id}`, experiencia)
    .pipe(
      tap(() => {
        this._refresh$.next();
      })
    )
  }

  public delete(id: number): Observable<any> {
    return this.httpClient.delete<any>(this.expURL + `delete/${id}`);
  }
}
