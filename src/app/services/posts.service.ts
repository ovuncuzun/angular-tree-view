import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  postsData: string = '/assets/data.json';

  constructor(private http: HttpClient) {
  }

  getTimeTableData() {
    return this.http.get(this.postsData);
  }
}
