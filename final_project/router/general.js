const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    let username = req.body.username;
    let password = req.body.password;
  
    if (!username || !password) {
      return res.status(400).json({message: "Username and password are required"});
    }
  
    let existingUser = users.find(u => u.username === username);
    if (existingUser) {
      return res.status(400).json({message: "Username already exists"});
    }
  
    let newUser = {username: username, password: password};
    users.push(newUser);
  
    return res.status(200).json({message: "User registered successfully"});
  });
  

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    let bookList = JSON.stringify(books, null, 2);
    res.send(bookList);
  });

// async
function getAllBooks() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(books);
      }, 2000);
  
      return;
    });
  }
  

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;  

    res.send(books[isbn]);  
  });

// async
function getBookByISBN(isbn) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const book = books[isbn];
        if (!book) {
          reject("Book not found");
        }
        resolve(book);
      }, 2000);
    });
  }
  
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
        let booksbyauthor = [];
        let isbns = Object.keys(books);
        isbns.forEach((isbn) => {
          if(books[isbn]["author"] === req.params.author) {
            booksbyauthor.push({"isbn":isbn,
                                "title":books[isbn]["title"],
                                "reviews":books[isbn]["reviews"]});
          }
        });
        res.send(JSON.stringify({booksbyauthor}, null, 4));
      });

// async
function getBookByAuthor(author) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const booksByAuthor = [];
        for (const key in books) {
          if (books[key].author === author) {
            booksByAuthor.push(books[key]);
          }
        }
        if (booksByAuthor.length === 0) {
          reject("Book not found");
        }
        resolve(booksByAuthor);
      }, 2000);
    });
  }

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let booksbytitle = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn]["title"] === req.params.title) {
        booksbytitle.push({"isbn":isbn,
                            "author":books[isbn]["author"],
                            "reviews":books[isbn]["reviews"]});
      }
    });
    res.send(JSON.stringify({booksbytitle}, null, 4));
  });

// async
function getBookByTitle(title) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        for (const key in books) {
          if (books[key].title === title) {
            resolve(books[key]);
          }
        }
        reject("Book not found");
      }, 2000);
    });
  }

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbnParam = req.params.isbn;
    const reviews = books[isbnParam]["Reviews"];

    if (!reviews) {
      res.status(404).json({ message: 'No reviews found for the ISBN provided' });

    } else {
      res.status(200).json(reviews);
    }
});

module.exports.general = public_users;