import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, throwError } from 'rxjs';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly BASE_URL = 'https://api.github.com/users';

  constructor(private httpClient: HttpClient) {}

  // to get the user information
  getUser(githubUsername: string) {
    return this.httpClient.get(
      `https://api.github.com/users/${githubUsername}`
    );
  }

  // to get the repositories of a given user
  getRepos(
    githubUsername: string,
    page: number,
    per_page: number
  ): Observable<any[]> {
    return this.httpClient.get<any[]>(
      `https://api.github.com/users/${githubUsername}/repos`,
      {
        params: {
          page: page.toString(),
          per_page: per_page.toString(),
        },
      }
    );
  }

  // get number of repos of the current user
  getNoOfRepos(githubUsername: string): Observable<any[]> {
    return this.httpClient.get<any[]>(
      `https://api.github.com/users/${githubUsername}/repos`
    );
  }
}
