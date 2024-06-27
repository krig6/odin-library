// Toggle modal visibility when add book button is clicked
const modalContainer = document.querySelector('[data-modal-container]');
const addBookButton = document.querySelector('[data-add-book]');
const modalOverlay = document.querySelector('[data-overlay]');

addBookButton.addEventListener('click', () => {
    modalContainer.classList.toggle('show-modal');

    if (modalContainer.classList.contains('show-modal')) {
        modalOverlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
    } else {
        modalOverlay.style.display = 'none';
        document.body.style.overflow = 'hidden';
    }
})

const titleInputField = document.querySelector('[data-title-input]');
const authorInputField = document.querySelector('[data-author-input]');
const pagesInputField = document.querySelector('[data-pages-input]');
const readStatusCheckbox = document.querySelector('[data-book-status]');

const confirmButton = document.querySelector('[data-confirm-btn]');

class Library {
    constructor() {
        this.book = [
            { title: "The Great Gatsby", author: '	F. Scott Fitzgerald', pages: 192, status: false },
            { title: "The Lord of the Rings", author: '	J. R. R. Tolkien', pages: 1077, status: true },
            { title: "Harry Potter and the Prisoner of Azkaban", author: 'J. K. Rowling', pages: 317, status: true },
            { title: "The Book Thief", author: 'Markus Zusak', pages: 584, status: false },
            { title: "Moby-Dick", author: 'Herman Melville', pages: 635, status: false },
        ]
    }

    isTitleNotBlank(title) {
        if (title === null || title.trim() === '') {
            return false;
        }
        return true;
    }

    isBookAlreadyExists(title) {
        return this.book.some(book => book.title === title);
    }

    addBookIfUnique(book) {

        if (!this.isTitleNotBlank(book.title)) {
            alert('Title is required.');
            return;
        }

        if (this.isBookAlreadyExists(book.title)) {
            alert('Book is already in the list.');
            this.clearInputFields();
            return;
        }

        this.book.unshift(book);
        this.clearInputFields();
    }

    clearInputFields() {
        titleInputField.value = ''
        authorInputField.value = ''
        pagesInputField.value = ''
        readStatusCheckbox.checked = false;
    }
}

const library = new Library();

class Book {
    constructor(title, author, pages, status) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.status = status;
    }
}

confirmButton.addEventListener('click', (event) => {
    event.preventDefault();

    let newBook = new Book(titleInputField.value, authorInputField.value, pagesInputField.value, readStatusCheckbox.checked);
    library.addBookIfUnique(newBook);
})