import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, map, tap } from 'rxjs';
import { CommentsResponse } from '../interfaces/comment.interface';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  // private url = 'https://bikebrosv2.herokuapp.com';
  private url = 'http://localhost:3300';
  private refreshComments$ = new Subject<void>();

  constructor(private http: HttpClient) {}

  get refresh$() {
    return this.refreshComments$;
  }

  addComment(
    routeId: string,
    content: string,
    authorId: string,
    authorNick: string
  ) {
    const url = `${this.url}/route/comments/${routeId}`;
    return this.http
      .post(url, {
        routeId,
        content,
        authorId,
        authorNick,
      })
      .pipe(
        tap(() => {
          this.refreshComments$.next();
        })
      );
  }

  getRouteComments(routeId: string): Observable<CommentsResponse> {
    return this.http
      .get<CommentsResponse>(`${this.url}/route/getAllComments/${routeId}`)
      .pipe(map((resp) => resp));
  }
  // async getRouteComments(routeId: string) {
  //   // return this.http.get<CommentsResponse[]>(
  //   //   `${this.url}/route/${routeId}/getAllComments`
  //   // );
  //   const res: any = await firstValueFrom(
  //     this.http.get(`${this.url}/route/${routeId}/getAllComments`)
  //   );
  //   return res.comments as Comment[];
  // }
}
