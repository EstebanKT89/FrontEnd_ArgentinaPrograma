import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Skill } from '../model/skill';

@Injectable({
  providedIn: 'root',
})
export class SkillService {
  URL = environment.URL + 'skill/';

  private _refresh$ = new Subject<void>();

get refresh$(){
  return this._refresh$;
}

  constructor(private httpClient: HttpClient) {}

  public lista(): Observable<Skill[]> {
    return this.httpClient.get<Skill[]>(this.URL + 'lista');
  }

  public detail(id: number): Observable<Skill> {
    return this.httpClient.get<Skill>(this.URL + `detail/${id}`)
    .pipe(
      tap(() => {
        this._refresh$.next();
      })
    )
  }

  public save(skill: Skill): Observable<any> {
    return this.httpClient.post<any>(this.URL + 'create', skill)
    .pipe(
      tap(() => {
        this._refresh$.next();
      })
    )
  }

  public update(id: number, skill: Skill): Observable<any> {
    return this.httpClient.put<any>(this.URL + `update/${id}`, skill)
    .pipe(
      tap(() => {
        this._refresh$.next();
      })
    )
  }

  public delete(id: number): Observable<any> {
    return this.httpClient.delete(this.URL + `delete/${id}`);
  }
}
