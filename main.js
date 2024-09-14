const STORAGE_KEY = 'BOOKSHELF_APPS';

let books = [];

function saveBooks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function loadBooks() {
    const booksJSON = localStorage.getItem(STORAGE_KEY);
    books = booksJSON ? JSON.parse(booksJSON) : [];
}

function addBook(title, author, year, isComplete) {
    const id = new Date().getTime();
    const newBook = { id, title, author, year: Number(year), isComplete };
    books.push(newBook);
    saveBooks();
    renderBooks();
}

function renderBooks() {
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    const completeBookshelfList = document.getElementById('completeBookshelfList');
    
    incompleteBookshelfList.innerHTML = '';
    completeBookshelfList.innerHTML = '';

    books.forEach(book => {
        const bookElement = createBookElement(book);
        if (book.isComplete) {
            completeBookshelfList.appendChild(bookElement);
        } else {
            incompleteBookshelfList.appendChild(bookElement);
        }
    });
}

function createBookElement(book) {
    const bookItem = document.createElement('div');
    bookItem.classList.add('book_item');
    bookItem.setAttribute('data-bookid', book.id);
    bookItem.setAttribute('data-testid', 'bookItem');
    bookItem.innerHTML = `
        <h3 data-testid="bookItemTitle">${book.title}</h3>
        <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
        <p data-testid="bookItemYear">Tahun: ${book.year}</p>
        <div class="action">
            <button data-testid="bookItemIsCompleteButton">${book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca'}</button>
            <button data-testid="bookItemDeleteButton">Hapus buku</button>
        </div>
    `;
    return bookItem;
}

function toggleBookCompletion(bookId) {
    const bookIndex = books.findIndex(book => book.id === bookId);
    if (bookIndex !== -1) {
        books[bookIndex].isComplete = !books[bookIndex].isComplete;
        saveBooks();
        renderBooks();
    }
}

function deleteBook(bookId) {
    books = books.filter(book => book.id !== bookId);
    saveBooks();
    renderBooks();
}

document.addEventListener('DOMContentLoaded', () => {
    loadBooks();
    renderBooks();

    document.getElementById('inputBook').addEventListener('submit', function(e) {
        e.preventDefault();
        const title = document.getElementById('inputBookTitle').value;
        const author = document.getElementById('inputBookAuthor').value;
        const year = document.getElementById('inputBookYear').value;
        const isComplete = document.getElementById('inputBookIsComplete').checked;
        addBook(title, author, year, isComplete);
        this.reset();
    });

    document.addEventListener('click', function(e) {
        if (e.target && e.target.getAttribute('data-testid') === 'bookItemIsCompleteButton') {
            const bookId = Number(e.target.closest('[data-bookid]').getAttribute('data-bookid'));
            toggleBookCompletion(bookId);
        }
        if (e.target && e.target.getAttribute('data-testid') === 'bookItemDeleteButton') {
            const bookId = Number(e.target.closest('[data-bookid]').getAttribute('data-bookid'));
            deleteBook(bookId);
        }
    });
});
