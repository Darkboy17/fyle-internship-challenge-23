import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch user data', () => {
    const mockUser = { login: 'testUser' };

    service.getUser('testUser').subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne('https://api.github.com/users/testUser');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should fetch user repositories', () => {
    const mockRepos = [{ name: 'repo1' }];
    const username = 'testUser';
    const page = 1;
    const pageSize = 10;

    service.getRepos(username, page, pageSize).subscribe((repos) => {
      expect(repos).toEqual(mockRepos);
    });

    const req = httpMock.expectOne(
      `https://api.github.com/users/${username}/repos?page=${page}&per_page=${pageSize}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockRepos);
  });
});
