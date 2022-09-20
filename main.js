const books = [];
const RENDER_EVENT = "render";
const STORAGE_KEY = "BOOKSHELF-APP-DICODING";
const SAVED_EVENT = 'saved-book';


function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete,
    };
}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
}

function isStorageExist() {
    if (typeof Storage === undefined) {
        alert("Browser kamu tidak mendukung local storage");
        return false;
    }
    return true;
}

function saveData() {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(book) {
    const bookTitle = document.createElement("h3");
    bookTitle.innerText = book.title;
    const bookAuthor = document.createElement("p");
    bookAuthor.innerText = book.author;
    const bookYear = document.createElement("p");
    bookYear.innerText = book.year;
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("action");
    const Container = document.createElement("article");
    Container.setAttribute("id", book.id);
    Container.classList.add("book_item");
    Container.append(bookTitle, bookAuthor, bookYear, buttonContainer);
    if (book.isComplete) {
        buttonContainer.append(createUnfinishedButton(), createDeleteButton());
    } else {
        buttonContainer.append(createFinishedButton(), createDeleteButton());
    }
    return Container;
}


function addBooks() {
    const textBook = document.getElementById("inputBookTitle").value;
    const author = document.getElementById("inputBookAuthor").value;
    const year = document.getElementById("inputBookYear").value;
    const isComplete = document.getElementById("inputBookIsComplete").checked;
    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, textBook, author, year, isComplete);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

document.addEventListener("DOMContentLoaded", function () {
    const submitForm = document.getElementById("inputBook");
    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addBooks();
        submitForm.reset();
    });

    const searchForm = document.getElementById("searchBook");
    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        searchBooks();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
        console.log(books);
    }
});

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBookList = document.getElementById(
        "incompleteBookshelfList"
    );
    uncompletedBookList.innerHTML = "";

    const completedBookList = document.getElementById("completeBookshelfList");
    completedBookList.innerHTML = "";

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        bookElement[SAVED_EVENT] = bookItem.id;

        if (bookItem.isComplete) {
            completedBookList.append(bookElement);
        } else {
            uncompletedBookList.append(bookElement);
        }
    }
});

function createButton(buttonTypeClass, eventListener, text) {
    const button = document.createElement("button");
    button.classList.add(buttonTypeClass);
    button.innerText = text;
    button.addEventListener("click", function (event) {
        eventListener(event);
    });
    return button;
}

function createFinishedButton() {
    return createButton(
        "green",
        function (event) {
            addBookToCompleted(event.target.parentElement.parentElement);
            const searchForm = document.getElementById("searchBook");
            searchForm.reset();
        },
        "Selesai dibaca"
    );
}

function createUnfinishedButton() {
    return createButton(
        "green",
        function (event) {
            undoBookFromCompleted(event.target.parentElement.parentElement);
            const searchForm = document.getElementById("searchBook");
            searchForm.reset();
        },
        "Belum selesai di Baca"
    );
}

function createDeleteButton() {
    return createButton(
        "red",
        function (event) {
            deleteBookFromCompleted(event.target.parentElement.parentElement);
            const searchForm = document.getElementById("searchBook");
            searchForm.reset();
        },
        "Hapus buku"
    );
}

document.addEventListener(SAVED_EVENT, () => {
    console.log('Data berhasil di simpan.');
});

function addBookToCompleted(bookElement) {
    const book = findBook(bookElement[SAVED_EVENT]);
    book.isComplete = true;
    bookElement.remove();
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoBookFromCompleted(bookElement) {
    const book = findBook(bookElement[SAVED_EVENT]);
    book.isComplete = false;
    bookElement.remove();
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function deleteBookFromCompleted(bookElement) {
    const bookPosition = findBookIndex(bookElement);
    books.splice(bookPosition, 1);
    bookElement.remove();
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function searchBooks() {
    const searchTitle = document.getElementById("searchBookTitle").value;
    const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
    incompleteBookshelfList.innerHTML = "";
    const completeBookshelfList = document.getElementById("completeBookshelfList");
    completeBookshelfList.innerHTML = "";
    if (searchTitle === "") {
        incompleteBookshelfList.innerHTML = " ";
        completeBookshelfList.innerHTML = " ";
        books = [];
        console.log(books);
        if (isStorageExist()) {
            loadDataFromStorage();
        }
    } else {
        const filteredBooks = books.filter((book) => {
            return book.title.toLowerCase().includes(searchTitle.toLowerCase());
        });
        console.log(filteredBooks);
        for (const bookItem of filteredBooks) {
            const bookElement = makeBook(bookItem);
            bookElement[SAVED_EVENT] = bookItem.id;
            if (bookItem.isComplete) {
                completeBookshelfList.append(bookElement);
            } else {
                incompleteBookshelfList.append(bookElement);
            }
        }
    }
}
