import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Educacion } from '../model/educacion';

@Injectable({
  providedIn: 'root',
})
export class EducacionService {
  URL = environment.URL + 'educacion/';
  

  private _refresh$ = new Subject<void>();

get refresh$(){
  return this._refresh$;
}

  constructor(private httpClient: HttpClient) {}

  public lista(): Observable<Educacion[]> {
    return this.httpClient.get<Educacion[]>(this.URL + 'lista');
  }

  public detail(id: number): Observable<Educacion> {
    return this.httpClient.get<Educacion>(this.URL + `detail/${id}`)
    .pipe(
      tap(() => {
        this._refresh$.next();
      })
    )
  }

  public save(educacion: Educacion): Observable<any> {
    return this.httpClient.post<any>(this.URL + 'create', educacion)
    .pipe(
      tap(() => {
        this._refresh$.next();
      })
    )
  }

  public update(id: number, educacion: Educacion): Observable<any> {
    return this.httpClient.put<any>(this.URL + `update/${id}`, educacion)
    .pipe(
      tap(() => {
        this._refresh$.next();
      })
    )
  }

  public delete(id:number): Observable<any>{
    return this.httpClient.delete<any>(this.URL + `delete/${id}`);
  }

}
