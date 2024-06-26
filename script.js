const modalContainer = document.querySelector('[data-modal-container]');
const addBookButton = document.querySelector('[data-add-book]');

addBookButton.addEventListener('click', () => {
    modalContainer.classList.toggle('show-modal');
})