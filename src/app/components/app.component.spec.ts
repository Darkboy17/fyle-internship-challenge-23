import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppComponent } from './app.component';
import { ApiService } from '../services/api.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let apiService: ApiService;
  let toastrService: ToastrService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [HttpClientTestingModule, ToastrModule.forRoot(), FormsModule],
      providers: [ApiService, ToastrService],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    apiService = TestBed.inject(ApiService);
    toastrService = TestBed.inject(ToastrService);
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user data and repositories on fetchUser', () => {
    const userData = { login: 'testuser' };
    const repoData = [{ name: 'repo1' }];
    spyOn(apiService, 'getUser').and.returnValue(of(userData));
    spyOn(apiService, 'getRepos').and.returnValue(of(repoData));
    spyOn(component, 'fetchRepositories').and.callThrough();

    component.fetchUser('testuser');

    expect(component.isLoadingUser).toBeFalse();
    expect(component.userData).toEqual(userData);
    expect(component.fetchRepositories).toHaveBeenCalledWith(
      1,
      component.pageSize
    );
  });

  it('should handle error on fetchUser', () => {
    const errorResponse = new HttpErrorResponse({
      error: { message: 'API rate limit exceeded' },
      status: 403,
    });
    spyOn(apiService, 'getUser').and.returnValue(throwError(errorResponse));
    spyOn(toastrService, 'info');
    spyOn(toastrService, 'error');
    component.fetchUser('testuser');

    expect(component.isLoadingUser).toBeFalse();
    expect(toastrService.info).toHaveBeenCalledWith(
      'User API rate limit exceeded',
      'Error',
      {
        timeOut: 5000,
        closeButton: true,
        positionClass: 'toast-top-center',
      }
    );
  });

  it('should fetch repositories and cache them', () => {
    const repoData = [{ name: 'repo1' }];
    spyOn(apiService, 'getRepos').and.returnValue(of(repoData));
    component.fetchRepositories(1, 10);

    expect(component.isLoadingRepo).toBeFalse();
    expect(component.repositories).toEqual(repoData);
    expect(component.cache[1]).toEqual(repoData);
  });

  it('should handle default error message on fetchUser', () => {
    const errorResponse = new HttpErrorResponse({
      error: {}, // No specific error message
      status: 500,
    });
    spyOn(apiService, 'getUser').and.returnValue(throwError(errorResponse));
    spyOn(toastrService, 'error');

    component.fetchUser('testuser');

    expect(component.isLoadingUser).toBeFalse();
    expect(toastrService.error).toHaveBeenCalledWith(
      'An error occurred while fetching the User.',
      'Error'
    );
  });

  it('should fetch repositories from cache when available', () => {
    const page = 1;
    const per_page = 10;
    const cachedRepositories = [
      { name: 'CachedRepo1' },
      { name: 'CachedRepo2' },
    ];
    component.cache[page] = cachedRepositories;

    component.fetchRepositories(page, per_page);

    expect(component.isLoadingRepo).toBeFalse();
    expect(component.repositories).toEqual(cachedRepositories);
  });

  it('should handle error and clear loading state in fetchRepositories', () => {
    const page = 2;
    const per_page = 10;
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404,
      statusText: 'Not Found',
    });
    spyOn(apiService, 'getRepos').and.returnValue(throwError(errorResponse));
    spyOn(console, 'error');

    component.fetchRepositories(page, per_page);

    expect(component.isLoadingRepo).toBeFalse();
    expect(console.error).toHaveBeenCalledWith(
      'Error fetching repositories',
      errorResponse
    );
  });

  it('should reset currentPage, call fetchUser and fetchRepositories on search', () => {
    const fetchUserSpy = spyOn(component, 'fetchUser').and.callThrough();
    const fetchRepositoriesSpy = spyOn(
      component,
      'fetchRepositories'
    ).and.callThrough();
    component.username = 'testuser';
    component.pageSize = 10;

    component.onSearch();

    expect(component.currentPage).toBe(1);
    expect(fetchUserSpy).toHaveBeenCalledWith('testuser');
    expect(fetchRepositoriesSpy).toHaveBeenCalledWith(1, 10);
  });

  it('should set totalItems on successful API call', () => {
    const username = 'testuser';
    const repositories = [{}, {}, {}]; // Example data for the response
    spyOn(apiService, 'getNoOfRepos').and.returnValue(of(repositories));

    component.fetchTotalRepositories(username);

    expect(component.totalItems).toBe(repositories.length);
  });

  it('should log error on API call failure', () => {
    const username = 'testuser';
    const errorResponse = new HttpErrorResponse({
      error: 'test 500 error',
      status: 500,
      statusText: 'Internal Server Error',
    });
    spyOn(apiService, 'getNoOfRepos').and.returnValue(
      throwError(errorResponse)
    );
    spyOn(console, 'error');

    component.fetchTotalRepositories(username);

    expect(console.error).toHaveBeenCalledWith(
      'Error fetching total repositories',
      errorResponse
    );
  });

  it('should handle page change', () => {
    spyOn(component, 'fetchRepositories');
    component.onPageChange(2);

    expect(component.currentPage).toBe(2);
    expect(component.fetchRepositories).toHaveBeenCalledWith(
      2,
      component.pageSize
    );
  });

  it('should handle page size change', () => {
    spyOn(component, 'resetCacheAndPagination');
    spyOn(component, 'fetchRepositories');
    component.pageSize = 20;
    component.onPageSizeChange(component.pageSize);

    expect(component.resetCacheAndPagination).toHaveBeenCalled();
    expect(component.currentPage).toBe(1);
    expect(component.cache).toEqual({});
    expect(component.fetchRepositories).toHaveBeenCalledWith(1, 20);
  });

  it('should reset cache and pagination', () => {
    component.cache = { 1: [{ name: 'repo1' }] };
    component.apiCallCount = 5;
    component.resetCacheAndPagination();

    expect(component.cache).toEqual({});
    expect(component.currentPage).toBe(1);
    expect(component.apiCallCount).toBe(0);
  });

  it('should calculate total pages correctly', () => {
    component.totalItems = 55;
    component.pageSize = 10;
    expect(component.totalPages).toBe(6);
  });

  it('should generate pages array correctly', () => {
    component.totalItems = 55;
    component.pageSize = 10;
    expect(component.pages).toEqual([1, 2, 3, 4, 5, 6]);
  });
});
