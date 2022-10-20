const bookshelf = [];
const RENDER_EVENT = 'render-bookshelf';

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addBookshelf();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }

	const searchButton = document.getElementById("searchBook");
	searchButton.addEventListener('keyup', function (e) {
        e.preventDefault();
        search();   
    });
});

function addBookshelf() {
    const title = document.getElementById('inputBookTitle').value
    const author = document.getElementById('inputBookAuthor').value
    const year = document.getElementById('inputBookYear').value
    const check = document.getElementById('inputBookIsComplete');

    const generateID = generateId();
    if (check.checked) {
        const bookshelfObject = generateBookshelfObject(generateID, title, author, year, true);
        bookshelf.push(bookshelfObject);
    } else {
        const bookshelfObject = generateBookshelfObject(generateID, title, author, year, false);
        bookshelf.push(bookshelfObject);
    }
    

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateId() {
    return +new Date();
}

function generateBookshelfObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

document.addEventListener(RENDER_EVENT, function() {
    const uncompletedBookshelfList = document.getElementById('incompleteBookshelfList');
    uncompletedBookshelfList.innerHTML = '';

    const completedBookshelfList = document.getElementById('completeBookshelfList');
    completedBookshelfList.innerHTML = '';

    for (const bookshelfItem of bookshelf) {
        const bookshelfElement = makeBookshelf(bookshelfItem);
        if (!bookshelfItem.isCompleted) {
            uncompletedBookshelfList.append(bookshelfElement);
        } else {
            completedBookshelfList.append(bookshelfElement);
        }
    }
    
});

// belum
function makeBookshelf(bookshelfObject) {
    const textTitle = document.createElement('h3');
    textTitle.innerText =  bookshelfObject.title;
    
    const textAuthor = document.createElement('p');
    textAuthor.innerText = "Penulis: " + bookshelfObject.author;

    const textYear = document.createElement('p');
    textYear.innerText = "Tahun: " + bookshelfObject.year;

    const textArticle = document.createElement('div');
    textArticle.classList.add('action');

    const article = document.createElement('article');
    article.classList.add('book_item');
    article.append(textTitle, textAuthor, textYear, textArticle);
    article.setAttribute('id', `bookshelf-${bookshelfObject.id}`); 

    if (bookshelfObject.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('green');
        undoButton.innerText = "Belum selesai di Baca";

        undoButton.addEventListener('click', function() {
            undoTaskFromCompleted(bookshelfObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('red')
        trashButton.innerText = "Hapus buku";

        trashButton.addEventListener('click', function() {
            removeTaskFromCompleted(bookshelfObject.id);           
        });
        textArticle.append(undoButton, trashButton);
    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('green');
        checkButton.innerText = "Selesai dibaca";

        checkButton.addEventListener('click', function () {
            addTaskToCompleted(bookshelfObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('red')
        trashButton.innerText = "Hapus buku";

        trashButton.addEventListener('click', function() {
            removeTaskFromCompleted(bookshelfObject.id);           
        });
        textArticle.append(checkButton, trashButton);
    }

    return article;
}

function addTaskToCompleted(bookshelfId) {
    const bookshelfTarget = findBookshelf(bookshelfId);

    if(bookshelfTarget == null) return;

    bookshelfTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBookshelf(bookshelfId) {
    for(const bookshelfItem of bookshelf) {
        if(bookshelfItem.id === bookshelfId) {
            return bookshelfItem;
        }
    }

    return null;
}

function removeTaskFromCompleted(bookshelfId) {
    const bookshelfTarget = findBookshelfIndex(bookshelfId);

    if (bookshelfTarget === -1) return;

    bookshelf.splice(bookshelfTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoTaskFromCompleted(bookshelfId) {
    const bookshelfTarget = findBookshelf(bookshelfId);

    if (bookshelfTarget == null) return;

    bookshelfTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBookshelfIndex(bookshelfId) {
    for(const i in bookshelf) {
        if (bookshelf[i].id === bookshelfId) {
            return i;
        }
    }

    return -1;
}

function saveData() {
    if (isStorageExist) {
        const parsed = JSON.stringify(bookshelf);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

const SAVED_EVENT = 'saved-bookshelf';
const STORAGE_KEY = 'BOOKSELF_APPS';

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Your browser does not support local storage');
        return false;
    }
    return true;
}

function loadDataFromStorage(params) {
 const serialData = localStorage.getItem(STORAGE_KEY);
 let data = JSON.parse(serialData);
 
 if (data !== null) {
    for (const bookShelf of data) {
        bookshelf.push(bookShelf);
    }
 }

 document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener(SAVED_EVENT, function() {
    console.log(localStorage.getItem(STORAGE_KEY));
})

function search() {
	let input = document.getElementById("searchBookTitle").value;
    console.log(input);
	let article = document.getElementsByClassName("book_item");
	for (let i = 0; i < article.length; i++) {
		const h3 = document.getElementsByTagName("h3");
        const condition = h3[i].textContent.toLowerCase().includes(input.toLowerCase()); 
		if (condition) {
		    article[i].style.display = "";
		} else {
			article[i].style.display = "none";
		}
	}
}



