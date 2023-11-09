<a href="https://news.roka.dev"><picture>
  <source media="(prefers-color-scheme: dark)" srcset="/assets/RokaLogoDarkMode.svg">
  <source media="(prefers-color-scheme: light)" srcset="/assets/RokaLogo.svg">
  <img alt="logo" src="/assets/RokaLogoDarkMode.svg">
</picture></a>

## Overview
This repository contains the code for a dynamic news website that aggregates and displays content from CNN, including articles, videos, and photos. It features a search functionality leveraging CNN's search endpoint, a financial data section with local radio streams, live TV broadcasting, and a dedicated stream for Big Brother VIP Kosova. The site also implements user authentication and profile management with Firebase Auth and Firestore database.

## Features

- **News Content Fetching**: Parses and displays news data from CNN.
- **Search Functionality**: Uses CNN's search endpoint for real-time news search results.
- **Multimedia Content**: Displays videos, photos, and other multimedia content from various sources.
- **Financial Data Section**: Includes a radio player for 3 local stations and endpoints for financial data.
- **Live TV**: Streams multiple news TV channels and two channels specifically for Big Brother VIP Kosova.
- **User Authentication**: Integrates Firebase authentication for user login and registration.
- **Profile Management**: Uses Firestore database to store and manage user profile information.
- **Dynamic UI Interactions**: Implements jQuery for enhanced animations and interactivity.
- **Web Workers**: Utilizes web workers to fetch data for Big Brother live streams without UI interruption.
- **Stock Data Visualization**: Visualizes stock market data using canvas and JavaScript.

## Technologies Used

- HTML
- CSS
- Vanilla JavaScript
- jQuery
- Firebase Auth (for authentication)
- Firestore DB (for storing user profiles)
- Web Workers (for background data fetching)
- Canvas API (for data visualization)

## Accessing the Website

The website is hosted at [news.roka.dev](https://news.roka.dev). Visit this URL to view the live site.
