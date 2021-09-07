//generates random id;
let guid = () => {
  let s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };
  return (
    s4() +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    s4() +
    s4()
  );
};

let myLibrary;

const localLibrary = localStorage.getItem("myLibrary");

if (localLibrary) {
  console.log(localLibrary);
  myLibrary = JSON.parse(localLibrary);
} else {
  myLibrary = [];
}

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.id = guid();
  this.info = () =>
    `${title} by ${author}, ${pages} ${pages > 1 ? "pages" : "page"}, ${
      read ? "read" : "not read yet"
    }.`;
}

Book.prototype.toggleRead = function () {
  this.read = !this.read;
};

const theHobbit = new Book("The Hobbit", "J.R.R. Tolkien", 295, false);
const HarryPotter = new Book("Harry Potter", "J. K Rowling", 321, true);
const Sapiens = new Book("Sapines", "Yuval Noah Harari", 431, false);

if (myLibrary.length === 0) {
  myLibrary.push(theHobbit);
  myLibrary.push(HarryPotter);
  myLibrary.push(Sapiens);
}

localStorage.setItem("myLibrary", JSON.stringify(myLibrary));

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = event.target;

  addBookToLibrary({
    title: input.title.value,
    author: input.author.value,
    pages: input.pages.value,
    readStatus: input.readStatus.value,
  });

  input.title.value = "";
  input.author.value = "";
  input.pages.value = "";
  input.readStatus.value = "";
});

function addBookToLibrary(userInput) {
  const newBook = new Book(
    userInput.title,
    userInput.author,
    Number(userInput.pages),
    userInput.readStatus === "read" ? true : false
  );
  myLibrary.push(newBook);
  localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
  displayLibrary();
}

function removeBook(id) {
  myLibrary = myLibrary.filter((book) => book.id !== id);
  localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
  displayLibrary();
}

function toggleRead(id) {
  const book = myLibrary.find((book) => book.id === id);
  Object.setPrototypeOf(book, Book.prototype);
  book.toggleRead();
  localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
  displayLibrary();
}

function displayLibrary() {
  const displayDiv = document.getElementById("bookDisplay");

  displayDiv.innerHTML = "";

  myLibrary.forEach((book) => {
    const outerDiv = document.createElement("div");
    outerDiv.classList.add(
      "mr-auto",
      "ml-auto",
      "text-center",
      "mt-3",
      "col-4"
    );

    const innerDiv = document.createElement("div");
    innerDiv.classList.add("card", "align-items-center");
    innerDiv.style.height = "250px";
    innerDiv.style.flexDirection = "row";

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const title = document.createElement("h5");
    title.classList.add("card-title");
    title.textContent = book.title;

    const author = document.createElement("p");
    author.classList.add("card-text");
    const authorName = document.createElement("em");
    authorName.textContent = book.author;
    author.appendChild(authorName);

    const page = document.createElement("p");
    page.classList.add("card-text");
    const pageNumber = document.createElement("strong");
    pageNumber.textContent = `${book.pages} pages`;
    page.appendChild(pageNumber);

    const readStatus = document.createElement("a");
    readStatus.classList.add(
      "btn",
      book.read === true ? "btn-success" : "btn-warning",
      "m-1"
    );
    readStatus.href = "#";
    readStatus.textContent = book.read === true ? "Read" : "Not read yet";
    readStatus.addEventListener("click", () => toggleRead(book.id));

    const deleteButton = document.createElement("a");
    deleteButton.classList.add("btn", "btn-danger", "m-1");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => removeBook(book.id));

    cardBody.appendChild(title);
    cardBody.appendChild(author);
    cardBody.appendChild(page);
    cardBody.appendChild(readStatus);
    cardBody.appendChild(deleteButton);
    innerDiv.appendChild(cardBody);
    outerDiv.appendChild(innerDiv);
    displayDiv.appendChild(outerDiv);
  });
}

displayLibrary();
