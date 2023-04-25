import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  constructor(private http: HttpClient) {}

  addComment(comment: string, routeId: string) {
    this.http
      .post(`/route/${routeId}/comments/${comment}`, { comment, routeId })
      .subscribe(
        (response) => {
          console.log(response);
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
