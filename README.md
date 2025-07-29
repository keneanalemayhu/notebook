
# Notible - Web-Based Notes App

A full-stack web-based note-taking application. The frontend is built with  **React and TypeScript** , offering a responsive and interactive UI for note creation, editing, tagging, and searching. Backend development is in progress, with the database schema already set up using MySQL.

## Table of Contents

* [Features](#features)
* [Technologies](#technologies)
* [How to Run](#how-to-run)
* [Backend Setup](#backend-setup)
* [Structure](#structure)
* [Group Members](#group-members)

## Features

* User authentication (sign up and login)
* Create, edit, and delete personal notes
* Tag notes with keywords for filtering
* Search notes by title or content
* Responsive and modern UI with React
* Modal-based note editor
* Dynamic updates using React hooks and state management

## Technologies

* **Frontend** : React, TypeScript, CSS Modules
* **Backend** : *In progress*
* **Database** : MySQL
* **Icons** : FontAwesome
* **Typography** : Google Fonts (Inter)

## How to Run

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/notible-app.git
cd notible-app
```

### 2. Install Dependencies

Make sure you have Node.js installed, then run:

```bash
npm install
```

### 3. Start the React Development Server

```bash
npm start
```

This will open the app at `http://localhost:3000/` in your browser.

> ⚠️ Backend APIs are not yet connected. Full functionality will be available once the backend is complete.

---

## Backend Setup

### Database Setup

1. Open a terminal and import the schema:
   ```bash
   mysql -u your_username -p < sql/schema.sql
   ```
2. The schema will:
   * Create a database called `notible_db`
   * Create two tables: `users` and `notes`
   * Set up a foreign key between notes and users

#### `users` table:

* `id`: Primary key
* `username`, `email`: Unique and required
* `password_hash`: Securely stores hashed password
* `created_at`: Timestamp of registration

#### `notes` table:

* `id`: Primary key
* `user_id`: Foreign key linked to users
* `title`, `content`, `tags`: Note content
* `created_at`, `updated_at`: Automatic timestamps

The schema file is located at:

```plaintext
sql/schema.sql
```

### API Configuration

*(Coming soon)*

### Running the Backend Server

*(Coming soon)*

---

## Structure

```plaintext
notible-app/
├── backend/
│   └── schema.sql          # MySQL schema for users and notes
├── public/                 # Static assets and index.html
├── src/
│   ├── components/         # Reusable React components
│   ├── pages/              # Page-level components (Login, Dashboard, etc.)
│   ├── styles/             # CSS Modules and global styles
│   ├── utils/              # Helper functions
│   ├── App.tsx             # Root component
│   └── index.tsx           # Entry point
├── package.json            # Project metadata and scripts
├── tsconfig.json           # TypeScript configuration
├── README.md               # Project overview and setup
└── .gitignore
```

---

## Group Members

* Dagim Bireda
* Fikir Samuel
* Kenean Alemayhu
