import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, tap } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ReportService {
  // private url = 'https://bikebrosv2.herokuapp.com';
  private url = 'http://localhost:3300';

  private refreshReports$ = new Subject<void>();

  constructor(private http: HttpClient) {}

  get refresh$() {
    return this.refreshReports$;
  }

  addReport(routeId: string, reason: string, description: string) {
    const url = `${this.url}/api/reports/${routeId}`;
    return this.http.post(url, { reason, description }).pipe(
      tap(() => {
        this.refreshReports$.next();
      })
    );
  }

  addReportEvent(eventId: string, reason: string, description: string) {
    const url = `${this.url}/api/reportsEvent/${eventId}`;
    return this.http.post(url, { reason, description }).pipe(
      tap(() => {
        this.refreshReports$.next();
      })
    );
  }
}
