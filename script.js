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