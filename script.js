// DOM elements
const modalContainer = document.querySelector('[data-modal-container]');
const addBookButton = document.querySelector('[data-add-book]');
const modalOverlay = document.querySelector('[data-overlay]');

const bookListContainer = document.querySelector('[data-book-list]');
const titleInputField = document.querySelector('[data-title-input]');
const authorInputField = document.querySelector('[data-author-input]');
const pagesInputField = document.querySelector('[data-pages-input]');
const readStatusCheckbox = document.querySelector('[data-book-status]');

const confirmButton = document.querySelector('[data-confirm-btn]');
const cancelButton = document.querySelector('[data-cancel-btn]');

// Toggle function to show/hide modal
function toggleModalContainer() {
    modalContainer.classList.toggle('show-modal');
    if (modalContainer.classList.contains('show-modal')) {
        modalOverlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
    } else {
        modalOverlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Snackbar function for displaying messages
function showSnackbar(message, type = 'success') {
    const snackbar = document.getElementById('snackbar');
    snackbar.textContent = message;
    snackbar.className = ''; // Clear existing classes
    snackbar.classList.add('show', type);
    setTimeout(function () { snackbar.classList.remove('show'); }, 3000);
}

// Utility function to truncate long titles
function truncateString(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    } else {
        return text;
    }
}


// Book class definition
class Book {
    constructor(title, author, pages, status) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.status = status;
    }
}

// Library class for managing books
class Library {
    constructor() {
        this.book = this.retrieveBooks() || [];
        this.refreshBookDisplay();
    }

    displayEmptyLibraryMessage(container) {
        container.innerHTML = `<p class="empty-library-message">
                    Your library is currently empty. Start adding books!
                </p>`;
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
            showSnackbar('Please enter a book title!', 'warning')
            return;
        }

        if (this.isBookAlreadyExists(book.title)) {
            showSnackbar('Book already saved!', 'warning')
            this.clearInputFields();
            return;
        }

        this.book.unshift(book);
        this.storeBooks();
        showSnackbar('Book succesfully added!', 'success')
        this.clearInputFields();
    }

    removeBookOnClick(removeButton, bookToRemove) {
        removeButton.addEventListener('click', () => {
            this.book = this.book.filter(book => book.title !== bookToRemove.title);
            showSnackbar(`${bookToRemove.title} has been deleted.`, 'warning')
            this.refreshBookDisplay();
            this.storeBooks();
        })
    }

    refreshBookDisplay() {
        if (this.book.length === 0) {
            this.displayEmptyLibraryMessage(bookListContainer);
        } else {
            bookListContainer.innerHTML = ''
            this.book.forEach((book) => {
                let bookCardElement = document.createElement("article");
                let bookCardContent = "";
                const titleClass = book.title.length >= 7 ? "long-title" : "";
                if (book.author && book.author.trim() !== "") {
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
                        <button class="status-btn ${book.status ? "read" : "not-read"
                    }">${book.status ? "Read" : "Not Read"}</button>
                        <button class="remove-btn">Remove</button>
                    </div>
                </article>`;
                bookListContainer.appendChild(bookCardElement);

                const removeButton = bookCardElement.querySelector(".remove-btn");
                const readStatusButton = bookCardElement.querySelector(".status-btn");

                this.toggleReadStatusOnClick(readStatusButton, book);
                this.removeBookOnClick(removeButton, book);
            });
        }
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

    formatAndCapitalizeText(input) {
        const formattedInput = input.value
            .replace(/\s+/g, ' ') // Replace consecutive spaces with a single space
            .toLowerCase() // Convert all letters to lowercase
            .replace(/(^|\s)\S/g, function (firstLetter) {
                return firstLetter.toUpperCase(); // Capitalize first letter of each word
            });
        input.value = formattedInput;
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
}

// Initialize library object
const library = new Library();

// Event listeners

addBookButton.addEventListener('click', toggleModalContainer)

cancelButton.addEventListener('click', (event) => {
    event.preventDefault();
    toggleModalContainer();
    library.clearInputFields();
})

confirmButton.addEventListener('click', (event) => {
    event.preventDefault();

    let newBook = new Book(titleInputField.value, authorInputField.value, parseInt(pagesInputField.value), readStatusCheckbox.checked);
    library.addBookIfUnique(newBook);
    library.refreshBookDisplay();
})

titleInputField.addEventListener('input', () => {
    library.formatAndCapitalizeText(titleInputField);
});

authorInputField.addEventListener('input', () => {
    library.formatAndCapitalizeText(authorInputField);
});

