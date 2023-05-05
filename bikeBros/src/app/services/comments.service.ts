import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Comment } from '../interfaces/comment.interface';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  // private url = 'https://bikebrosv2.herokuapp.com';
  private url = 'http://localhost:3300';

  constructor(private http: HttpClient) {}

  addComment(
    routeId: string,
    content: string,
    authorId: string,
    authorNick: string
  ) {
    this.http
      .post(`${this.url}/route/${routeId}/comments`, {
        routeId,
        content,
        authorId,
        authorNick,
      })
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  async getRouteComments(routeId: string) {
    // return this.http.get<CommentsResponse[]>(
    //   `${this.url}/route/${routeId}/getAllComments`
    // );
    const res: any = await firstValueFrom(
      this.http.get(`${this.url}/route/${routeId}/getAllComments`)
    );
    return res.comments as Comment[];
  }
}
