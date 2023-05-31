import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, map, tap } from 'rxjs';
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

  getRouteReports(routeId: string): Observable<any> {
    return this.http
      .get<any>(`${this.url}/api/showRouteReports/${routeId}`)
      .pipe(map((resp) => resp));
  }

  getEventReports(eventId: string): Observable<any> {
    return this.http
      .get<any>(`${this.url}/api/report/showEventReports/${eventId}`)
      .pipe(map((resp) => resp));
  }

  deleteRouteReportById(routeId: string, reportId: string): Observable<any> {
    const body = { routeId };
    return this.http
      .delete(`${this.url}/api/reports/route/delete/${reportId}`, {
        body,
      })
      .pipe(
        tap(() => {
          this.refreshReports$.next();
        })
      );
  }

  deleteEventReportById(eventId: string, reportId: string): Observable<any> {
    const body = { eventId };
    return this.http
      .delete(`${this.url}/api/reports/event/delete/${reportId}`, {
        body,
      })
      .pipe(
        tap(() => {
          this.refreshReports$.next();
        })
      );
  }
}
