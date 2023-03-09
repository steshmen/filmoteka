import { fetchApi, fetchGenre, fetchFilmById, fetchSearch, fetchFilmsCol } from './js/fetchApi';
import { creatMarkup, creatCardMarkup } from './js/markup';

const GENERS_LOCAL = 'genres';
const WATCHED_LOCAL = 'watched';
const QUEUE_LOCAL = 'queque';


const filmListRef = document.querySelector('.film-list');
const backdropRef = document.querySelector('.backdrop');
const closeModalBtn = document.querySelector('.modal-close__btn');
const modalBoxRef = document.querySelector('.modal-box');
const searchFormRef = document.querySelector('.header-form');
const searchFormText = document.querySelector('.header-form__text');
const modalBtnsRef = document.querySelectorAll('.modal-btn');
const modalBtnWatchedRef = document.querySelector('button[data-watched]');
const modalBtnQueueRef = document.querySelector('button[data-queue]');

searchFormText.style.visibility = 'hidden';

searchFormRef.addEventListener('submit', onSearch);
filmListRef.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);
modalBtnQueueRef.addEventListener('click', addQueue);
modalBtnWatchedRef.addEventListener('click', addWatched);

backdropRef.addEventListener('click', (evt) => {
    if (evt.target.className === 'backdrop') {
        backdropRef.classList.add('is-hidden');
    }
});

fetchGenre()
    .then(data => {
        const genres = JSON.stringify(data.genres);
        localStorage.setItem(GENERS_LOCAL, genres);
    }).catch(err => console.log(err));

fetchApi().then(data => {
    const items = data.results;
    const markup = creatMarkup(items);
    filmListRef.insertAdjacentHTML('beforeend', markup);
    
}).catch(err => console.log(err))

function addQueue(evt) {
    const id = Number(evt.target.dataset.id);
    const arr = JSON.parse(localStorage.getItem(QUEUE_LOCAL));
    
    if(!arr) {
        const arr2 = [];
        arr2.push(id);
        localStorage.setItem(QUEUE_LOCAL, JSON.stringify(arr2));
        closeModal();
        return
    }
    if (!arr.includes(id)) {
        arr.push(id);
        localStorage.setItem(QUEUE_LOCAL, JSON.stringify(arr));
        closeModal();
        return;
    }
    closeModal();
}

function addWatched(evt) {
    const id = Number(evt.target.dataset.id);
    const arr = JSON.parse(localStorage.getItem(WATCHED_LOCAL));
    
    if(!arr) {
        const arr2 = [];
        arr2.push(id);
        localStorage.setItem(WATCHED_LOCAL, JSON.stringify(arr2));
        closeModal();
        return
    }
    if (!arr.includes(id)) {
        arr.push(id);
        localStorage.setItem(WATCHED_LOCAL, JSON.stringify(arr));
        closeModal();
        return;
    }
    closeModal();
}

function openModal(evt) {
    window.addEventListener('keydown', closeModalEsc)
    const filmId = Number(evt.target.dataset.id);

    if (!filmId) {
        return;
    }
    backdropRef.classList.remove('is-hidden')

    modalBtnsRef.forEach((item) => {
        item.setAttribute('data-id', filmId)
    });

    fetchFilmById(filmId).then(data => {
        const markup = creatCardMarkup(data);
        modalBoxRef.innerHTML = markup;
    })

} 

function closeModal() {
    backdropRef.classList.add('is-hidden');
    modalBtnsRef.forEach((item) => {
        item.removeAttribute('data-id');
    });
    window.removeEventListener('keydown', closeModalEsc);
}

function closeModalEsc(evt) {
    console.log(evt.code);
    if (evt.code === "Escape") {
        closeModal();
    }
}

function onSearch(evt) {
    evt.preventDefault();
    searchFormText.style.visibility = 'hidden';
    const serchFilm = evt.currentTarget.elements.searchFilm.value;
    
    
    fetchSearch(serchFilm).then(data => {
        const items = data.results;
        if (!items[0]) {
            searchFormText.style.visibility = 'visible';
            return
        }

        filmListRef.innerHTML = '';
        const markup = creatMarkup(items);
        filmListRef.insertAdjacentHTML('beforeend', markup);
    }).catch(console.log);
}

