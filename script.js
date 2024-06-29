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
const cancelButton = document.querySelector('[data-cancel-btn]');

const bookListContainer = document.querySelector('[data-book-list]');

function truncateString(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    } else {
        return text;
    }
}

class Library {
    constructor() {
        this.book = this.retrieveBooks() || [
            { title: "The Great Gatsby", author: 'F. Scott Fitzgerald', pages: 192, status: false },
            { title: "The Lord of the Rings", author: 'J. R. R. Tolkien', pages: 1077, status: true },
            { title: "Harry Potter and the Prisoner of Azkaban", author: 'J. K. Rowling', pages: 317, status: true },
            { title: "The Book Thief", author: 'Markus Zusak', pages: 584, status: false },
            { title: "Moby-Dick", author: 'Herman Melville', pages: 635, status: false },
        ]
        this.refreshBookDisplay();
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
        this.storeBooks();
        this.clearInputFields();
    }

    removeBookOnClick(removeButton, bookToRemove) {
        removeButton.addEventListener('click', () => {
            this.book = this.book.filter(book => book.title !== bookToRemove.title);
            this.refreshBookDisplay();
            this.storeBooks();
        })
    }

    displayEmptyLibraryMessage(container) {
        container.innerHTML = `<p class="empty-library-message">
                    Your library is currently empty. Start adding books!
                </p>`;
    }

    refreshBookDisplay() {
        while (bookListContainer.firstChild) {
            bookListContainer.removeChild(bookListContainer.firstChild);
        }

        this.book.forEach(book => {
            let bookCardElement = document.createElement('article');
            let bookCardContent = '';
            const titleClass = book.title.length >= 10 ? 'long-title' : '';
            if (book.author && book.author.trim() !== '') {
                bookCardContent += `<h3 class="${titleClass}"><i>"${truncateString(book.title, 50)}"</i></h3>`;
                bookCardContent += `<p><span class="card-span">by </span><span class="author">${book.author}</span></p>`;
            } else {
                bookCardContent += `<h3 class="${titleClass}"><i>"${truncateString(book.title, 50)}"</i></h3>`;
            }

            if (book.pages) {
                bookCardContent += `<p><span class="card-span">Pages:</span> <span class="card-span">${book.pages}</span></p>`;
            }

            bookCardElement.innerHTML = `<article class="card">
                <div class="card-text">
                   ${bookCardContent}
                </div>
                <div class="card-buttons">
                    <button class="status-btn ${book.status ? 'read' : 'not-read'}">${book.status ? 'Read' : 'Not Read'}</button>
                    <button class="remove-btn">Remove</button>
                </div>
            </article>`
            bookListContainer.appendChild(bookCardElement);

            const removeButton = bookCardElement.querySelector('.remove-btn');
            const readStatusButton = bookCardElement.querySelector('.status-btn');
            this.toggleReadStatusOnClick(readStatusButton, book);
            this.removeBookOnClick(removeButton, book);
        })
    }

    toggleReadStatusOnClick(readStatusButton, book) {
        readStatusButton.addEventListener('click', () => {
            book.status = !book.status;
            readStatusButton.classList.toggle('read')
            readStatusButton.classList.toggle('not-read');
            readStatusButton.textContent = book.status ? 'Read' : 'Not Read';
            this.storeBooks();
        })
    }

    clearInputFields() {
        titleInputField.value = ''
        authorInputField.value = ''
        pagesInputField.value = ''
        readStatusCheckbox.checked = false;
    }

    storeBooks() {
        localStorage.setItem('bookList', JSON.stringify(this.book));
    }

    retrieveBooks() {
        return JSON.parse(localStorage.getItem('bookList'));
    }

    formatAndCapitalizeText(input) {
        const formattedInput = input.value
            .replace(/\s+/g, ' ') // Replace consecutive spaces with a single space
            .toLowerCase() // Convert all letters to lowercase
            .replace(/(^|\s)\S/g, function (firstLetter) {
                return firstLetter.toUpperCase(); // Capitalize first letter of each word
            });
        input.value = formattedInput;
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

    let newBook = new Book(titleInputField.value, authorInputField.value, parseInt(pagesInputField.value), readStatusCheckbox.checked);
    library.addBookIfUnique(newBook);
    library.refreshBookDisplay();
})

cancelButton.addEventListener('click', (event) => {
    event.preventDefault();

    modalContainer.classList.remove('show-modal');
    modalOverlay.classList.remove('show-overlay');
    library.clearInputFields();

    if (modalContainer.classList.contains('show-modal')) {
        modalOverlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
    } else {
        modalOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
})

titleInputField.addEventListener('input', () => {
    library.formatAndCapitalizeText(titleInputField);
});

authorInputField.addEventListener('input', () => {
    library.formatAndCapitalizeText(authorInputField);
});

