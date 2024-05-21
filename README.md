# GitHub Repository Viewer/Scraper

This project is a GitHub Repository Viewer that allows users to search for GitHub users and view their repositories with pagination. Users can select the number of repositories to display per page, and navigate through the pages. The application uses Angular and integrates with the GitHub API to fetch user data and repositories.

## Table of Contents

-   [Features](#features)
-   [Prerequisites](#prerequisites)
-   [Installation](#installation)
-   [Running the Application](#running-the-application)
-   [Running Tests](#running-tests)
-   [Usage](#usage)
-   [API Rate Limiting](#api-rate-limiting)
-   [Acknowledgements](#acknowledgements)
-   [Notes for Developers](#notes-for-developers)

## Features

-   Search for GitHub users
-   View user profile information
-   View paginated list of repositories
-   Select the number of repositories to display per page
-   Caching of repositories to minimize API calls
-   Skeleton loaders during API calls
-   Error handling with Toastr notifications

## Prerequisites

Before you begin, ensure you have met the following requirements:

-   You have installed Node.js (version 14 or later)
-   You have installed Angular CLI (version 11 or later)
-   You have a GitHub account for API access

## Installation

Follow these steps to install the application and its dependencies:

1.  **Clone the repository**:
	
		git clone https://github.com/your-username/github-repo-viewer.git
		cd github-repo-viewer
		
2. **Install dependencies**:

		npm install

## Running the Application

To run the application locally, follow these steps:

1.  **Start the development server**:

		ng serve

2. **Open your browser** and navigate to:

	```arduino
	http://localhost:4200
	```

## Running Tests

To run unit tests and ensure code coverage, use the following commands:

1.  **Run all tests**:

		ng test

2.  **Run tests with code coverage**:

		ng test --code-coverage

3. **Check coverage report**: After running the tests, open the generated coverage report in your browser. It can be found under the path: 

		/fyle-internship-challenge-23/coverage/

## Usage

1.  **Search for a GitHub User**:
    
    -   Enter the GitHub username in the search box.
    -   Click the "Search" button to fetch user details and repositories.
2.  **View Repositories**:
    
    -   Repositories are displayed in a paginated view.
    -   Use the pagination controls at the bottom to navigate through pages.
3.  **Select Number of Repositories per Page**:
    
    -   Use the dropdown menu to select how many repositories to display per page.
    -   The available options are 10, 20, 50, and 100.

## API Rate Limiting

GitHub imposes rate limits on API calls. If you exceed the rate limit, you will see a Toastr notification indicating the rate limit has been exceeded. To avoid this, minimize frequent searches and navigation.

## Acknowledgements

-   This project uses the [GitHub API](https://developer.github.com/v3/).
-   Skeleton loaders are implemented using [Tailwind CSS](https://tailwindcss.com/).
-   Toastr notifications are implemented using [ngx-toastr](https://github.com/scttcper/ngx-toastr).

## Notes for Developers

### Directory Structure

-   **src/app/components**: Contains all the Angular components.
-   **src/app/services**: Contains the service for API calls.

