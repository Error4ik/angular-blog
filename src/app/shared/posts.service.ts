import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FirebaseCreateResponse, Post} from './interfaces';
import {environment} from '../../environments/environment';
import {map} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class PostsService {
  constructor(private httpClient: HttpClient) {
  }

  create(post: Post): Observable<Post> {
    return this.httpClient.post(`${environment.firebaseUrl}/posts.json`, post)
      .pipe(map((response: FirebaseCreateResponse) => {
        return {
          ...post,
          id: response.name,
          date: new Date(post.date)
        };
      }));
  }

  getPosts(): Observable<Post[]> {
    return this.httpClient.get(`${environment.firebaseUrl}/posts.json`)
      .pipe(map((response: {[ket: string]: any}) => {
        return Object.keys(response).map(key => ({
          ...response[key],
          id: key,
          date: new Date(response[key].date)
        }));
      }));
  }

  getPostById(id: string): Observable<Post> {
    return this.httpClient.get<Post>(`${environment.firebaseUrl}/posts/${id}.json`)
      .pipe(map((post: Post) => {
        return {
          ...post,
          id,
          date: new Date(post.date)
        };
      }));
  }

  removePostById(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${environment.firebaseUrl}/posts/${id}.json`);
  }
}
