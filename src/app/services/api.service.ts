import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private url = `https://www.googleapis.com/youtube/v3/search`;

  constructor(private http: HttpClient) { }

  public getTableData(): Observable<any> {
    const queryParams = {
      params: {
        part: 'snippet',
        maxResults: '50',
        type: 'video',
        key: 'AIzaSyDOfT_BO81aEZScosfTYMruJobmpjqNeEk',
        q: 'john'
      }
    };
    return this.http.get(this.url, queryParams);
  }
}
