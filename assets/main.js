const buttonAdd = document.querySelector(".button-add");
const buttonClear = document.querySelector(".button-clear");
const formContainer = document.querySelector(".form-container");
const saveBook = document.getElementById("saveBook");
const updateBook = document.getElementById("updateBook");

buttonAdd.addEventListener("click", function () {
  buttonAdd.classList.toggle("active");
  saveBook.style.display = "block";
  updateBook.style.display = "none";
  if (formContainer.style.display == "block") {
    formContainer.style.display = "none";
  } else {
    formContainer.style.display = "block";
  }
});

const localStorageKey = "bookshelfApp";
let bookshelfApp = [];

const checkSupportedStorage = () => {
  return typeof Storage !== undefined;
};

if (checkSupportedStorage()) {
  if (localStorage.getItem(localStorageKey) === null) {
    bookshelfApp = [];
  } else {
    bookshelfApp = JSON.parse(localStorage.getItem(localStorageKey));
  }
  localStorage.setItem(localStorageKey, JSON.stringify(bookshelfApp));
}

const searchBook = (kw) => {
  const r = bookshelfApp.filter((book) =>
    book.title.toLowerCase().includes(kw.toLowerCase())
  );
  renderBooks(r);
};

const addBook = (Obj, localStorageKey) => {
  bookshelfApp.push(Obj);
  localStorage.setItem(localStorageKey, JSON.stringify(bookshelfApp));
};

const editBook = (book, Obj) => {
  const index = bookshelfApp.findIndex((b) => b.id === book.id);
  bookshelfApp[index] = Obj;
  localStorage.setItem(localStorageKey, JSON.stringify(bookshelfApp));
  renderBooks(bookshelfApp);
};

const deleteBook = (book) => {
  bookshelfApp.splice(book, 1);
  localStorage.setItem(localStorageKey, JSON.stringify(bookshelfApp));
  renderBooks(bookshelfApp);
};

const finishedRead = (book) => {
  bookshelfApp[book].isComplete = true;
  localStorage.setItem(localStorageKey, JSON.stringify(bookshelfApp));
  renderBooks(bookshelfApp);
};

const unfinishedRead = (book) => {
  bookshelfApp[book].isComplete = false;
  localStorage.setItem(localStorageKey, JSON.stringify(bookshelfApp));
  renderBooks(bookshelfApp);
};

const unfinishedReadId = "unfinished-read";
const finishedReadId = "finished-read";

const renderBooks = (bookshelfApp) => {
  const books = bookshelfApp;

  const listUnfinished = document.getElementById(unfinishedReadId);
  const listFinished = document.getElementById(finishedReadId);

  listUnfinished.innerHTML = "";
  listFinished.innerHTML = "";

  for (let book of books.keys()) {
    const listGroupItem = document.createElement("article");
    listGroupItem.classList.add("list-group-item");

    const bookDetail = document.createElement("div");
    bookDetail.classList.add("book-detail");

    const bookTitle = document.createElement("b");
    bookTitle.innerHTML = books[book].title;

    const bookAuthor = document.createElement("p");
    bookAuthor.classList.add("small");
    bookAuthor.innerHTML = "Author: " + books[book].author;

    const bookYear = document.createElement("p");
    bookYear.classList.add("small");
    bookYear.innerHTML = "Year: " + books[book].year; // Nilai tahun harus berupa angka, bukan string.

    const bookCategories = document.createElement("c");
    bookCategories.classList.add("small");
    bookCategories.innerHTML = "Categories: " + books[book].categories;

    bookDetail.append(bookTitle, bookAuthor, bookYear, bookCategories);

    const bookAction = document.createElement("div");
    bookAction.classList.add("book-action");

    const buttonRead = document.createElement("button");

    const iconCheck = document.createElement("i");
    iconCheck.classList.add("fas", "fa-check");

    const iconEdit = document.createElement("i");
    iconEdit.classList.add("fas", "fa-edit");

    const iconUncheck = document.createElement("i");
    iconUncheck.classList.add("fas", "fa-undo");

    const iconDelete = document.createElement("i");
    iconDelete.classList.add("fas", "fa-trash");

    if (books[book].isComplete) {
      buttonRead.classList.add("button-finish");
      buttonRead.append(iconUncheck);
      buttonRead.addEventListener("click", () => {
        unfinishedRead(book);
      });
    } else {
      buttonRead.classList.add("button-unfinish");
      buttonRead.append(iconCheck);
      buttonRead.addEventListener("click", () => {
        finishedRead(book);
      });
    }

    const buttonEdit = document.createElement("button");
    buttonEdit.classList.add("button-edit");
    buttonEdit.append(iconEdit);
    buttonEdit.addEventListener("click", () => {
      saveBook.style.display = "none";
      updateBook.style.display = "block";
      if (formContainer.style.display == "block") {
        formContainer.style.display = "none";
      } else {
        formContainer.style.display = "block";
      }

      const title = document.getElementById("title");
      const author = document.getElementById("author");
      const year = document.getElementById("year");
      const categories = document.getElementById("categories");
      const isComplete = document.getElementById("isComplete");

      title.value = books[book].title;
      author.value = books[book].author;
      year.value = books[book].year;
      categories.value = books[book].categories;
      isComplete.checked = books[book].isComplete;

      updateBook.addEventListener("click", () => {
        const bookObj = {
          id: books[book].id,
          title: title.value,
          author: author.value,
          year: parseInt(year.value), // Menggunakan parseInt untuk mengubah string menjadi angka.
          categories: categories.value, //
          isComplete: isComplete.checked,
        };

        if (title.value && author.value && year.value &&categories.value) {
          editBook(books[book], bookObj);
        } else {
          return alert("The field can't be blank");
        }

        const inputs = document.querySelectorAll("input");
        inputs.forEach((input) => (input.value = ""));

        formContainer.style.display = "none";

        renderBooks(bookshelfApp);

        alert("Success, your book have been update");
      });
    });

    const buttonDelete = document.createElement("button");
    buttonDelete.classList.add("button-delete");
    buttonDelete.append(iconDelete);
    buttonDelete.addEventListener("click", () => {
      let confirmDelete = confirm(
        "Are you sure you want to delete the book '" + books[book].title + "'?"
      );
      if (confirmDelete) {
        deleteBook(book);
      }
    });

    bookAction.append(buttonRead, buttonEdit, buttonDelete);

    listGroupItem.append(bookDetail, bookAction);

    if (books[book].isComplete) {
      listFinished.append(listGroupItem);
    } else {
      listUnfinished.append(listGroupItem);
    }
  }
};

searchBookForm = document.getElementById("searchBook");
searchBookForm.addEventListener("submit", (e) => {
  const kw = document.querySelector("#searchBookTitle").value;
  e.preventDefault();
  searchBook(kw);
});

saveBook.addEventListener("click", function () {
  const title = document.getElementById("title");
  const author = document.getElementById("author");
  const year = document.getElementById("year");
  const categories = document.getElementById("categories");
  const isComplete = document.getElementById("isComplete");

  let Obj = {
    id: +new Date(),
    title: title.value,
    author: author.value,
    year: parseInt(year.value), // Menggunakan parseInt untuk mengubah string menjadi angka.
    categories: categories.value,
    isComplete: isComplete.checked,
  };

  if (title.value && author.value && year.value && categories.value) {
    addBook(Obj, localStorageKey);
  } else {
    return alert("The field can't be blank");
  }

  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => (input.value = ""));

  formContainer.style.display = "none";

  renderBooks(bookshelfApp);

  alert("Success, your book have been recorded");
});

buttonClear.addEventListener("click", () => {
  let confirmClearAll = confirm(
    "Are you sure you want to clean up all the books?"
  );

  if (confirmClearAll) {
    localStorage.clear();
    bookshelfApp = [];
  }
  renderBooks(bookshelfApp);
});

window.addEventListener("load", function () {
  if (checkSupportedStorage) {
    renderBooks(bookshelfApp);
  } else {
    alert("Your browser isn't support web storage");
  }
});
