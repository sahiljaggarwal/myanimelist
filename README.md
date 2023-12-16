# Vartalaap Chat API

## Overview

Vartalaap is a robust chat API developed using NestJS, MongoDB, WebSockets, JWT, and Google Authentication. This project provides a platform for real-time communication, user authentication, and message storage.

## Technology Used

- **NestJS Framework:**
  - A powerful TypeScript framework for building scalable and modular server-side applications.

- **MongoDB:**
  - A NoSQL database used for storing and managing data related to user profiles and chat messages.

- **WebSockets:**
  - Real-time communication is facilitated through WebSockets, allowing instant messaging between users.

- **JWT (JSON Web Tokens):**
  - Token-based authentication is implemented using JWT for secure user authentication and authorization.

- **Google Authentication:**
  - Users can sign up and sign in securely using their Google accounts, enhancing the authentication process.

## Features

- **Google Authentication:**
  - **Signup/Signin:** Users can authenticate themselves using their Google accounts.

- **Real-time Chat:**
  - **Instant Messaging:** Users can send real-time messages to each other using WebSockets.
  - **Message Storage:** All messages are securely stored in the MongoDB database.

- **User Interaction:**
  - **Search Users:** Users can search for others based on their usernames.
  - **Real-time Connections:** Establishing real-time connections with other users is facilitated through WebSockets.

- **Security:**
  - **JWT Authentication:** Token-based authentication ensures a secure and authenticated user experience.
  - **Authorization:** Access to real-time connections and message retrieval is protected, and unauthorized access is restricted.

## Key Points

- **WebSockets for Real-time Communication:**
  - WebSockets enable efficient and instant messaging between users, creating a seamless chat experience.

- **JWT for Secure Authentication:**
  - JSON Web Tokens are used to authenticate users securely, providing a token-based authorization mechanism.

- **Google Authentication Integration:**
  - Users can sign up and log in using their Google accounts, enhancing the authentication process.

- **Message Persistence:**
  - All chat messages are stored securely in the MongoDB database, ensuring data persistence and retrieval.

- **Search Functionality:**
  - Users can search for other users based on their usernames, facilitating user interaction.

- **Token-Based Authorization:**
  - Real-time connections and message retrieval are protected by JWT-based authorization, ensuring a secure environment.

## Getting Started

To set up and run the Vartalaap Chat API, follow the instructions provided in the project's documentation.

**Note:** Ensure that you have the required dependencies installed, including Node.js, npm, and MongoDB.

