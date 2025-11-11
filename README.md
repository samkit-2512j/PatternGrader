# PatternGrader

**PatternGrader** is an interactive, AI-powered web platform for developers to learn, practice, and master software design patterns.

Unlike traditional resources that focus only on theory, PatternGrader provides a complete hands-on loop: learn a concept, solve a coding challenge in a live editor, and receive immediate, detailed feedback from an AI evaluator.

<!-- **(Recommended: Add a high-quality screenshot or GIF of the app dashboard and challenge editor here!)**
`![PatternGrader Demo](link-to-your-screenshot-or-gif.gif)` -->

## Core Features

* **Interactive Learning Module:** Structured lessons, practical theory, code examples, and quizzes for a wide range of design patterns.
* **Hands-On Challenge Editor:** An in-browser IDE (powered by Monaco Editor) to solve real-world coding problems.
* **AI-Powered Evaluation:** Submissions are analyzed by the Google Gemini AI, which provides a detailed report on correctness, code quality, and adherence to the specific design pattern.
* **Gamified Progress:** Earn ratings for completed challenges and track your performance over time with a personal dashboard and rating charts.
* **Secure Authentication:** Full user authentication and profile management using stateless JSON Web Tokens (JWT).

## Architecture

This project is built with a clear separation of concerns:

* **Backend (Service-Oriented Architecture):** The backend follows a **Service-Oriented Architecture (SOA)**, decoupling features like Auth, Content, Challenges, and Ratings into logical services using Flask Blueprints.
* **Frontend (MVC):** The React frontend is structured using **Model-View-Controller (MVC)** principles to separate data logic (Models), UI rendering (Views), and user input handling (Controllers).

## Tech Stack

| Category | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | **React** | A component-based library for building the user interface. |
| | **TypeScript** | Adds static typing to JavaScript for improved code quality. |
| | **Material-UI (MUI)** | A comprehensive library of pre-built, customizable UI components. |
| | **Monaco Editor** | The editor that powers VS Code, for a rich in-browser coding experience. |
| | **Recharts** | A composable charting library for the user rating dashboard. |
| **Backend** | **Python** | The primary language for the backend and AI services. |
| | **Flask** | A lightweight web framework for building the REST API. |
| | **Flask-JWT-Extended** | For handling stateless JWT authentication. |
| | **MongoEngine** | An Object-Document Mapper (ODM) for interacting with MongoDB. |
| **Database** | **MongoDB (Atlas)** | A NoSQL database used to store user, lesson, and submission data. |
| **AI** | **Google Gemini API** | Powers the core code evaluation and feedback generation service. |

## Getting Started

To run this project locally, you will need:
* Python 3.10+
* Node.js v18+ & npm
* A MongoDB Atlas (or local) connection string
* A Google AI Studio (Gemini) API Key

```bash
git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
cd your-repo-name
