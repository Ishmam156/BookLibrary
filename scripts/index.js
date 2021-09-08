let generateRandomID = () => {
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

// Check if library is present in localStorge and if it is, use that one
const localLibrary = localStorage.getItem("myLibrary");

if (localLibrary) {
  myLibrary = JSON.parse(localLibrary);
} else {
  myLibrary = [];
}

// Constructor for Books
function Book(title, author, pages, read, cover) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.cover =
    cover === ""
      ? "https://www.dremed.com/assets/img/placeholder-large.jpg"
      : cover;
  this.id = generateRandomID();
  this;
  this.info = () =>
    `${title} by ${author}, ${pages} ${pages > 1 ? "pages" : "page"}, ${
      read ? "read" : "not read yet"
    }.`;
}

Book.prototype.toggleRead = function () {
  this.read = !this.read;
};

// Create a few books to be present initially and push to Library
const theHobbit = new Book(
  "The Hobbit",
  "J. R. R. Tolkien",
  310,
  false,
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfXUAnNdQzfCXkKK5bIDIqra5RU1tK85JY0A&usqp=CAU"
);
const HarryPotter = new Book(
  "Harry Potter and the Goblet of Fire",
  "J. K. Rowling",
  636,
  true,
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKQvDR77Kjpga3ocDqNGauuU3tuoiYhn8nkA&usqp=CAU"
);
const Sapiens = new Book(
  "Sapiens: A brief history of humankind",
  "Yuval Noah Harari",
  443,
  false,
  "https://static-01.daraz.com.bd/p/mdc/49bb96ca28deb33b4da1ed4fdce15a75.png"
);

if (myLibrary.length === 0) {
  myLibrary.push(theHobbit);
  myLibrary.push(HarryPotter);
  myLibrary.push(Sapiens);
}

localStorage.setItem("myLibrary", JSON.stringify(myLibrary));

// Handle submission of new book from user
function addBookToLibrary(userInput) {
  const newBook = new Book(
    userInput.title,
    userInput.author,
    Number(userInput.pages),
    userInput.readStatus === "read" ? true : false,
    userInput.cover
  );
  myLibrary.push(newBook);
  localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
  displayLibrary();
}

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
  const input = event.target;

  addBookToLibrary({
    title: input.title.value,
    author: input.author.value,
    pages: input.pages.value,
    readStatus: input.readStatus.value,
    cover: input.cover.value,
  });

  input.title.value = "";
  input.author.value = "";
  input.pages.value = "";
  input.readStatus.value = "";
  input.cover.value = "";

  document.getElementById("bookAlert").classList.toggle("disableAlert");

  setTimeout(() => {
    document.getElementById("bookAlert").classList.toggle("disableAlert");
  }, 2000);
});

// Helper functions to handle toggle reading status and deleting book
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

// Handle how books will be displayed in DOM with card structure
function displayLibrary() {
  const displayDiv = document.getElementById("bookDisplay");

  // Reset display to ensure no previous elements remain
  displayDiv.innerHTML = "";

  myLibrary.forEach((book) => {
    const outerDiv = document.createElement("div");
    outerDiv.classList.add(
      "mr-auto",
      "ml-auto",
      "text-center",
      "mt-3",
      "col-lg-4",
      "col-md-6"
    );

    const innerDiv = document.createElement("div");
    innerDiv.classList.add("card", "align-items-center");

    // Book Cover Element
    const image = document.createElement("img");
    image.classList.add("card-img-top");
    image.src = book.cover;
    image.alt = "Book Cover";
    image.style.height = "150px";
    image.style.width = "150px";
    innerDiv.appendChild(image);

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    // Book Title Element
    const title = document.createElement("h5");
    title.classList.add("card-title");
    title.textContent = book.title;

    // Book Author Element
    const author = document.createElement("p");
    author.classList.add("card-text");
    const authorName = document.createElement("em");
    authorName.textContent = book.author;
    author.appendChild(authorName);

    // Book Page Number Element
    const page = document.createElement("p");
    page.classList.add("card-text");
    const pageNumber = document.createElement("strong");
    pageNumber.textContent = `${book.pages} pages`;
    page.appendChild(pageNumber);

    // Book Read Status Button
    const readStatus = document.createElement("a");
    readStatus.classList.add(
      "btn",
      book.read === true ? "btn-success" : "btn-warning",
      "m-1"
    );
    readStatus.href = "#";
    readStatus.textContent = book.read === true ? "Read" : "Not read yet";
    readStatus.addEventListener("click", () => toggleRead(book.id));

    // Delete Book Button
    const deleteButton = document.createElement("a");
    deleteButton.classList.add("btn", "btn-danger", "m-1");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => removeBook(book.id));

    // Append all child to ensure proper structure
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

// Initial display of library on page load
displayLibrary();
