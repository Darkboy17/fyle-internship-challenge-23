import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr'; // Import ToastrService

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  username: string = '';
  userData: any = {};
  repositories: any[] = [];
  totalItems: number = 0;
  currentPage: number = 1;
  cache: { [key: number]: any[] } = {}; // Cache to store repositories by page number
  apiCallCount: number = 0; // Counter for API calls
  isLoadingUser: boolean = false;
  isLoadingRepo: boolean = false;
  pageSizes: number[] = [10, 20, 50, 100]; // Available page sizes
  pageSize: number = this.pageSizes[0]; //default number of repos
  // Placeholder array for skeleton cards
  placeholderArray: number[] = Array(this.pageSize).fill(0); // Adjust the number as needed

  constructor(private apiService: ApiService, private toastr: ToastrService) {}

  // to fetch user info
  fetchUser(username: string) {
    this.isLoadingUser = true; // Set loading state
    this.apiService.getUser(username).subscribe(
      (data) => {
        this.isLoadingUser = false; // Clear loading state when API call finishes
        this.userData = data;
        this.fetchRepositories(this.currentPage, this.pageSize);
        this.fetchTotalRepositories(username);
        console.log('User data:', this.userData);
      },
      (error: HttpErrorResponse) => {
        //console.error('Error fetching repositories', error);
        if (error.error && error.error.message) {
          // Display error message as a toast notification
          this.toastr.info('User ' + error.error.message, 'Error', {
            timeOut: 5000,
            closeButton: true, // Optional: show close button
            positionClass: 'toast-top-center',
          });
        } else {
          // Default error message
          this.toastr.error(
            'An error occurred while fetching the User.',
            'Error'
          );
        }
        this.isLoadingUser = false;
      }
    );
  }

  // to fetch repos for a particular page based on number of repos per page
  fetchRepositories(page: number, per_page: number) {
    this.isLoadingRepo = true;
    if (this.cache[page]) {
      this.isLoadingRepo = false; // Set loading state
      this.repositories = this.cache[page]; // Use cached data if available
    } else {
      // Fetch from API if not cached
      this.apiService.getRepos(this.username, page, per_page).subscribe(
        (data: any[]) => {
          this.repositories = data;
          this.cache[page] = data; // Store in cache
          this.isLoadingRepo = false; // Clear loading state
        },
        (error) => {
          this.isLoadingRepo = false; // Clear loading state on error
          console.error('Error fetching repositories', error);
        }
      );
      this.apiCallCount++; // track API calls
      //console.log(`API Call Count: ${this.apiCallCount}`);
    }
  }

  // to fetch total repos of current user
  fetchTotalRepositories(username: string) {
    this.apiService.getNoOfRepos(username).subscribe(
      (data: any[]) => {
        this.totalItems = data.length;
        // console.log('total repos:', this.totalItems);
      },
      (error) => {
        console.error('Error fetching total repositories', error);
      }
    );
  }

  // to fetch repos for some page
  onPageChange(page: number) {
    this.isLoadingRepo = true;
    this.currentPage = page;
    this.fetchRepositories(this.currentPage, this.pageSize);
  }

  // to call when a user changes page size
  onPageSizeChange(size: number) {
    this.pageSize = size;
    this.resetCacheAndPagination();
    this.fetchTotalRepositories(this.username);
    this.fetchRepositories(this.currentPage, this.pageSize);
  }

  // to reset cache and current pagination
  resetCacheAndPagination() {
    this.cache = {}; // Reset cache
    this.currentPage = 1; // Reset to the first page
    this.apiCallCount = 0;
    this.isLoadingRepo = true;
  }

  // Call this method when searching for a new user
  onSearch() {
    this.resetCacheAndPagination();
    this.fetchUser(this.username);
    this.fetchRepositories(this.currentPage, this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }
}
