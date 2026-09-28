// const express = require('express');
// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(express.json());

// const books = [
//   {
//     isbn: '9780132350884',
//     title: 'Clean Code',
//     author: 'Robert C. Martin',
//     reviews: [
//       { user: 'alice', review: 'Great read for writing maintainable code.' },
//       { user: 'bob', review: 'Very practical examples and guidance.' }
//     ]
//   },
//   {
//     isbn: '9781617294532',
//     title: 'Node.js in Action',
//     author: 'Michael R. Bashorun',
//     reviews: [
//       { user: 'alice', review: 'Excellent for learning Node.js fundamentals.' }
//     ]
//   },
//   {
//     isbn: '9780596009205',
//     title: 'Head First JavaScript',
//     author: 'Eric Freeman',
//     reviews: [
//       { user: 'bob', review: 'Very approachable introduction to JavaScript.' }
//     ]
//   }
// ];

// const users = [
//   { username: 'alice', password: 'pass123' },
//   { username: 'bob', password: 'pass123' }
// ];

// const findBookByIsbn = (isbn) => books.find((book) => book.isbn === String(isbn));

// const getFilteredBooks = ({ isbn, author, title }) => {
//   let results = [...books];

//   if (isbn) {
//     results = results.filter((book) => book.isbn.toLowerCase() === String(isbn).toLowerCase());
//   }

//   if (author) {
//     results = results.filter((book) => book.author.toLowerCase().includes(String(author).toLowerCase()));
//   }

//   if (title) {
//     results = results.filter((book) => book.title.toLowerCase().includes(String(title).toLowerCase()));
//   }

//   return results;
// };

// const validateUser = (username, password) => users.find(
//   (user) => user.username === username && user.password === password
// );

// const ensureAuthenticated = (req, res, next) => {
//   const authHeader = req.headers.authorization || '';
//   const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

//   if (!token) {
//     return res.status(401).json({ message: 'Authentication required.' });
//   }

//   const user = users.find((entry) => entry.username === token);
//   if (!user) {
//     return res.status(401).json({ message: 'Invalid token.' });
//   }

//   req.user = user;
//   next();
// };

// const getReviewOwner = (book, username) => book.reviews.find((review) => review.user === username);

// app.get('/', (req, res) => {
//   res.json({ message: 'Book review API is running.' });
// });

// app.get('/books', (req, res) => {
//   const { isbn, author, title } = req.query;
//   const results = getFilteredBooks({ isbn, author, title });

//   if (!results.length) {
//     return res.status(404).json({ message: 'No books found.' });
//   }

//   res.json(results);
// });

// app.get('/books/:isbn', (req, res) => {
//   const book = findBookByIsbn(req.params.isbn);

//   if (!book) {
//     return res.status(404).json({ message: 'Book not found.' });
//   }

//   res.json(book);
// });

// app.get('/books/:isbn/reviews', (req, res) => {
//   const book = findBookByIsbn(req.params.isbn);

//   if (!book) {
//     return res.status(404).json({ message: 'Book not found.' });
//   }

//   res.json(book.reviews);
// });

// app.post('/register', (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res.status(400).json({ message: 'Username and password are required.' });
//   }

//   const userExists = users.some((user) => user.username === username);
//   if (userExists) {
//     return res.status(409).json({ message: 'User already exists.' });
//   }

//   users.push({ username, password });
//   return res.status(201).json({ message: `User ${username} registered successfully.` });
// });

// app.post('/login', (req, res) => {
//   const { username, password } = req.body;
//   const user = validateUser(username, password);

//   if (!user) {
//     return res.status(401).json({ message: 'Invalid username or password.' });
//   }

//   return res.json({ message: `Welcome ${username}!`, token: username });
// });

// app.post('/books/:isbn/reviews', ensureAuthenticated, (req, res) => {
//   const { isbn } = req.params;
//   const { review, user } = req.body;
//   const book = findBookByIsbn(isbn);

//   if (!book) {
//     return res.status(404).json({ message: 'Book not found.' });
//   }

//   if (!review) {
//     return res.status(400).json({ message: 'Review is required.' });
//   }

//   const username = user || req.user.username;
//   const existingReview = getReviewOwner(book, username);

//   if (existingReview) {
//     existingReview.review = review;
//     return res.json({ message: 'Review updated successfully.', reviews: book.reviews });
//   }

//   book.reviews.push({ user: username, review });
//   return res.status(201).json({ message: 'Review added successfully.', reviews: book.reviews });
// });

// app.put('/books/:isbn/reviews', ensureAuthenticated, (req, res) => {
//   const { isbn } = req.params;
//   const { review, user } = req.body;
//   const book = findBookByIsbn(isbn);

//   if (!book) {
//     return res.status(404).json({ message: 'Book not found.' });
//   }

//   if (!review) {
//     return res.status(400).json({ message: 'New review text is required.' });
//   }

//   const username = user || req.user.username;
//   const existingReview = getReviewOwner(book, username);

//   if (!existingReview) {
//     return res.status(404).json({ message: 'Review not found for this user.' });
//   }

//   existingReview.review = review;
//   return res.json({ message: 'Review updated successfully.', reviews: book.reviews });
// });

// app.delete('/books/:isbn/reviews', ensureAuthenticated, (req, res) => {
//   const { isbn } = req.params;
//   const { user } = req.body;
//   const book = findBookByIsbn(isbn);

//   if (!book) {
//     return res.status(404).json({ message: 'Book not found.' });
//   }

//   const username = user || req.user.username;
//   const reviewIndex = book.reviews.findIndex((review) => review.user === username);

//   if (reviewIndex === -1) {
//     return res.status(404).json({ message: 'Review not found for this user.' });
//   }

//   book.reviews.splice(reviewIndex, 1);
//   return res.json({ message: 'Review deleted successfully.', reviews: book.reviews });
// });

// if (require.main === module) {
//   app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
//   });
// }

// module.exports = { app, books, users };























const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const books = [
  {
    isbn: '9780132350884',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    reviews: [
      { user: 'alice', review: 'Great read for writing maintainable code.' },
      { user: 'bob', review: 'Very practical examples and guidance.' }
    ]
  },
  {
    isbn: '9781617294532',
    title: 'Node.js in Action',
    author: 'Michael R. Bashorun',
    reviews: [
      { user: 'alice', review: 'Excellent for learning Node.js fundamentals.' }
    ]
  },
  {
    isbn: '9780596009205',
    title: 'Head First JavaScript',
    author: 'Eric Freeman',
    reviews: [
      { user: 'bob', review: 'Very approachable introduction to JavaScript.' }
    ]
  }
];

const users = [
  { username: 'alice', password: 'pass123' },
  { username: 'bob', password: 'pass123' }
];

const findBookByIsbn = (isbn) => books.find((book) => book.isbn === String(isbn));

const getFilteredBooks = ({ isbn, author, title }) => {
  let results = [...books];

  if (isbn) {
    results = results.filter((book) => book.isbn.toLowerCase() === String(isbn).toLowerCase());
  }

  if (author) {
    results = results.filter((book) => book.author.toLowerCase().includes(String(author).toLowerCase()));
  }

  if (title) {
    results = results.filter((book) => book.title.toLowerCase().includes(String(title).toLowerCase()));
  }

  return results;
};

const validateUser = (username, password) =>
  users.find((user) => user.username === username && user.password === password);

const ensureAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  const user = users.find((entry) => entry.username === token);
  if (!user) {
    return res.status(401).json({ message: 'Invalid token.' });
  }

  req.user = user;
  next();
};

const getReviewOwner = (book, username) =>
  book.reviews.find((review) => review.user === username);

app.get('/', (req, res) => {
  res.json({ message: 'Book review API is running.' });
});

app.get('/books', (req, res) => {
  const { isbn, author, title } = req.query;
  const results = getFilteredBooks({ isbn, author, title });

  if (!results.length) {
    return res.status(404).json({ message: 'No books found.' });
  }

  res.json(results);
});

app.get('/books/:isbn', (req, res) => {
  const book = findBookByIsbn(req.params.isbn);

  if (!book) {
    return res.status(404).json({ message: 'Book not found.' });
  }

  res.json(book);
});

app.get('/books/:isbn/reviews', (req, res) => {
  const book = findBookByIsbn(req.params.isbn);

  if (!book) {
    return res.status(404).json({ message: 'Book not found.' });
  }

  res.json(book.reviews);
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  const userExists = users.some((user) => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: 'User already exists.' });
  }

  users.push({ username, password });
  return res.status(201).json({ message: `User ${username} registered successfully.` });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = validateUser(username, password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password.' });
  }

  return res.json({ message: `Welcome ${username}!`, token: username });
});

app.post('/books/:isbn/reviews', ensureAuthenticated, (req, res) => {
  const { isbn } = req.params;
  const { review, user } = req.body;
  const book = findBookByIsbn(isbn);

  if (!book) {
    return res.status(404).json({ message: 'Book not found.' });
  }

  if (!review) {
    return res.status(400).json({ message: 'Review is required.' });
  }

  const username = user || req.user.username;
  const existingReview = getReviewOwner(book, username);

  if (existingReview) {
    existingReview.review = review;
    return res.json({ message: 'Review updated successfully.', reviews: book.reviews });
  }

  book.reviews.push({ user: username, review });
  return res.status(201).json({ message: 'Review added successfully.', reviews: book.reviews });
});

app.put('/books/:isbn/reviews', ensureAuthenticated, (req, res) => {
  const { isbn } = req.params;
  const { review, user } = req.body;
  const book = findBookByIsbn(isbn);

  if (!book) {
    return res.status(404).json({ message: 'Book not found.' });
  }

  if (!review) {
    return res.status(400).json({ message: 'New review text is required.' });
  }

  const username = user || req.user.username;
  const existingReview = getReviewOwner(book, username);

  if (!existingReview) {
    return res.status(404).json({ message: 'Review not found for this user.' });
  }

  existingReview.review = review;
  return res.json({ message: 'Review updated successfully.', reviews: book.reviews });
});

app.delete('/books/:isbn/reviews', ensureAuthenticated, (req, res) => {
  const { isbn } = req.params;
  const { user } = req.body;
  const book = findBookByIsbn(isbn);

  if (!book) {
    return res.status(404).json({ message: 'Book not found.' });
  }

  const username = user || req.user.username;
  const reviewIndex = book.reviews.findIndex((review) => review.user === username);

  if (reviewIndex === -1) {
    return res.status(404).json({ message: 'Review not found for this user.' });
  }

  book.reviews.splice(reviewIndex, 1);
  return res.json({ message: 'Review deleted successfully.', reviews: book.reviews });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = { app, books, users };