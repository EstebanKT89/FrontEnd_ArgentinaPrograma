import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Proyectos } from '../model/proyectos';

@Injectable({
  providedIn: 'root',
})
export class ProyectosService {
  URL = environment.URL + 'proyectos/';

  private _refresh$ = new Subject<void>();

  get refresh$(){
    return this._refresh$;
  }

  constructor(private httpClient: HttpClient) {}

  public lista(): Observable<Proyectos[]> {
    return this.httpClient.get<Proyectos[]>(this.URL + 'lista');
  }

  public detail(id: number): Observable<Proyectos> {
    return this.httpClient.get<Proyectos>(this.URL + `detail/${id}`)
    .pipe(
      tap(() => {
        this._refresh$.next();
      })
    )
  }

  public save(proyecto: Proyectos): Observable<any>{
    return this.httpClient.post<any>(this.URL + 'create', proyecto)
    .pipe(
      tap(() => {
        this._refresh$.next();
      })
    )
  }

  public update (id:number, proyecto: Proyectos): Observable<any>{
    return this.httpClient.put<any>(this.URL + `update/${id}`, proyecto)
    .pipe(
      tap(() => {
        this._refresh$.next();
      })
    )
  }

  public delete(id:number):Observable<any>{
    return this.httpClient.delete<any>(this.URL + `delete/${id}`);
  }
}
