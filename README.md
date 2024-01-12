# MyAnimeList Clone API

MyAnimeList Clone API is a RESTful web service that provides functionalities similar to MyAnimeList, offering information about anime, manga, and characters. Users can explore, add to favorites, and get detailed information about various anime, manga, and characters. The API is built using NestJS, JWT for authentication, MongoDB for data storage, and supports Google OAuth for user authentication.

## What is MyAnimeList?

MyAnimeList (MAL) is a platform that allows users to track and discover anime and manga. It provides information about various titles, user ratings, reviews, and recommendations, serving as a comprehensive database for anime and manga enthusiasts.

## Technology Used

- **NestJS:** A progressive Node.js framework for building efficient, scalable server-side applications.
- **JWT (JSON Web Tokens):** A standard for securely transmitting information between parties.
- **MongoDB:** A NoSQL database used for efficient data storage and retrieval.
- **Google OAuth:** Used for user authentication.
- **Cloudinary:** A cloud-based image and video management service used for handling media uploads and transformations.

## Myanimelist Swagger Documentation
```bash
    http://localhost:4000/api
```
## Roles

The API supports two roles:

- **Admin:** Has access to additional functionalities for adding anime, manga, and characters.
- **Normal User:** Can access general features like getting top anime, manga, adding to favorites, and more.

## Features

### For User

- **Get Top Anime and Manga by Ratings**
- **Get Anime, Manga by ID**
- **Get Anime Data Only**
- **Get Manga Data Only**
- **Get Single Character Data**
- **Get All Character Data of Anime or Manga**
- **Get Anime or Manga by Genre and Type**
- **Get Anime or Manga by Status and Type**
- **Search Manga, Character, and Anime**
- **Add to Favorites (Anime, Manga, Character)**
- **Get Favorites List Data by Anime, Manga, and Characters**
- **Delete from Favorites List**
- **Get Top Characters**
- **Get And Post Reviews And Ratings

### For Admin

- **Add Manga, Anime, and Characters**
- **Get Manga, Anime, and Characters (similar to user features)**
- **Get Favorite Count for Anime, Manga, and Characters**

## Getting Started

1. Clone the repository:

    ```bash
   git clone <repository-url> -b dev

2. Navigate to the project directory:
   ```bash
   cd vartalaap
   ```
3. Install project dependencies:
   ```
   npm install
   ```
4. Create a .env file in the project root and add the following configurations:
  ```
   MONGODB_URI = <your_mongodb_uri>
   SECRET_KEY = <your_secret_key>

   GOOGLE_CLIENT_ID = <your_google_client_id>
   GOOGLE_CLIENT_SECRET = <your_google_client_secret>
   GOOGLE_CALLBACK_URL = <your_google_callback_url>

   cloud_name = <your_cloud_name>
  api_key =  <your_api_key>
  api_secret = <your_api_secret>

   URL = http://localhost:4000
```
6. Run the application:
  ```
  npm run start:dev
  ```


