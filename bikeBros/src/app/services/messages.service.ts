import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  private url = 'https://bikebrosv2.herokuapp.com';
  // private url = 'http://localhost:3300';
  private refreshMessages$ = new Subject<void>();
  constructor(private http: HttpClient) {}

  get refresh$() {
    return this.refreshMessages$;
  }

  sendMessage(
    sender: string | null,
    recipient: string | null,
    content: string
  ) {
    const url = `${this.url}/messages/send`;
    console.log(sender, recipient);
    return this.http.post(url, { sender, recipient, content }).pipe(
      tap(() => {
        this.refreshMessages$.next();
      })
    );
  }

  getMessages(userId: string) {
    return this.http
      .get<any>(`${this.url}/messages/recieved/${userId}`)
      .pipe(map((resp) => resp));
  }

  getMessageById(messageId: string | null) {
    return this.http
      .get<any>(`${this.url}/message/${messageId}`)
      .pipe(map((resp) => resp));
  }
}
