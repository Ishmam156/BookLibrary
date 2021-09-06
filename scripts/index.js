function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.info = () =>
    `${title} by ${author}, ${pages} ${pages > 1 ? "pages" : "page"}, ${
      read ? "read" : "not read yet"
    }.`;
}

const theHobbit = new Book("The Hobbit", "J.R.R. Tolkien", 295, false);

console.log(theHobbit.info());
