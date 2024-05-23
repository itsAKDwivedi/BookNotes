# Book Notes Website

Welcome to the Book Notes Website! This is a full stack website of Books Notes management system for single user without authentication. This web application allows you to manage your book collection by adding, deleting, editing, and viewing book details.

## Functionality

- **Add Books:** Add new books to your collection by providing details such as title, author, genre, notes, and introduction.
- **Delete Books:** Remove books from your collection permanently.
- **Edit Books:** Update existing book details, including title, author, genre, notes, and introduction.
- **View Books:** Browse through your book collection and view details of each book.

## Getting Started

To run the Book Notes Website locally on your machine, follow these steps:

1. **Clone the repository:**
   ```
   git clone [https://github.com/itsAKDwivedi/BookNotes](https://github.com/itsAKDwivedi/BookNotes)
   ```

2. **Navigate to the project directory:**
   ```
   cd BookNotes
   ```

3. **Install dependencies:**
   ```
   npm install
   ```

4. **Set up environment variables:**
   - Create a `.env` file in the root directory.
   - Define environment variables such as database connection string, session secret, etc. Example:
     ```
     DB_CONNECTION_STRING=your_database_connection_string
     SESSION_SECRET=your_session_secret
     ```

5. **Start the server:**
   ```
   node index.js
   ```

6. **Open your web browser and go to [http://localhost:3000](http://localhost:3000) to access the Book Notes Website.**

## Technologies Used

- Node.js
- Express.js
- PostgreSQL
- HTML, CSS, JavaScript (Frontend)
- Other dependencies (list any additional libraries or frameworks used)

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvement, please open an issue or submit a pull request.
