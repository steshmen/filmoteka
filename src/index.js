import { fetchApi, fetchGenre, fetchFilmById, fetchSearch, } from './js/fetchApi';
import { creatMarkup, creatCardMarkup } from './js/markup';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import Pagination from 'tui-pagination';
import 'tui-pagination/dist/tui-pagination.css';


const container = document.getElementById('tui-pagination-container');
const options = {
    totalItems: 1000,
    itemsPerPage: 20,
    visiblePages: 10,
    page: 1,
}
const pagination = new Pagination(container, options);


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
const inputRef = document.querySelector('input[name="searchFilm"]')
let serchFilmWork = '';

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
loadTrendFilms();
loadGenre();


// const list = document.querySelector('.list');
// const guard = document.querySelector('.js-guard');
// const options = {
//     root: null,
//     rootMargin: '300px',
//     threshold: 1.0
// }

// const observer = new IntersectionObserver(onLoad, options);
// observer.observe(guard);


// function onLoad(entries, observer) {
//     entries.forEach(entry => {
//         if (entry.isIntersecting) {
//             page += 1;
//             loadTrendFilms(page);
//             if (page === 3) {
//                 observer.unobserve(guard);
//             }
//         }
//     })
// }
pagination.on('afterMove', (event) => {
    const page = event.page;
    console.log(page);

    if (serchFilmWork) {
        loadSearchFilm(serchFilmWork, page);
        window.scrollTo(0, 0);
        return;
    } 
    loadTrendFilms(page);
    window.scrollTo(0, 0);
});


function addQueue(evt) {
    const id = Number(evt.target.dataset.id);
    const arrQ = JSON.parse(localStorage.getItem(QUEUE_LOCAL));
    const arrW = JSON.parse(localStorage.getItem(WATCHED_LOCAL));

    if (arrW) {
        if (arrW.includes(id)) {
            Notify.warning('The movie is already in the Watched');
            return;
        }
    }
    
    if (!arrQ) {
        const arr = [];
        arr.push(id);
        localStorage.setItem(QUEUE_LOCAL, JSON.stringify(arr));
        Notify.success('Movie added to Queue');
        closeModal();
        return
    }

    if (!arrQ.includes(id)) {
        arrQ.push(id);
        localStorage.setItem(QUEUE_LOCAL, JSON.stringify(arrQ));
        Notify.success('Movie added to Queue');
        closeModal();
        return;
    }
    Notify.warning('The movie is already in the Queue');
}

function addWatched(evt) {
    const id = Number(evt.target.dataset.id);
    const arrW = JSON.parse(localStorage.getItem(WATCHED_LOCAL));
    const arrQ = JSON.parse(localStorage.getItem(QUEUE_LOCAL));

    if (arrQ) {
        if (arrQ.includes(id)) {
            Notify.warning('The movie is already in the Queue');
            return;
        }
    }
    
    if(!arrW) {
        const arr = [];
        arr.push(id);
        localStorage.setItem(WATCHED_LOCAL, JSON.stringify(arr));
        Notify.success('Movie added to Watched');
        closeModal();
        return
    }

    if (!arrW.includes(id)) {
        arrW.push(id);
        localStorage.setItem(WATCHED_LOCAL, JSON.stringify(arrW));
        Notify.success('Movie added to Watched');
        closeModal();
        return;
    }
    Notify.warning('The movie is already in the Watched');
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
        console.log(data);
        const markup = creatCardMarkup(data);
        modalBoxRef.innerHTML = markup;
    }).catch(console.log)
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
    serchFilmWork = '';
    const searchFilm = evt.currentTarget.elements.searchFilm.value.trim();
    loadSearchFilm(searchFilm)
}

function loadTrendFilms(page) {

    fetchApi(page).then(data => {
        console.log(data);
        const totalItem = data.total_results;
        pagination.setTotalItems(totalItem);
        
        const items = data.results;
        const markup = creatMarkup(items);
        filmListRef.innerHTML = markup;
    }).catch(err => console.log(err));
}

function loadGenre() {
    fetchGenre()
    .then(data => {
        const genres = JSON.stringify(data.genres);
        localStorage.setItem(GENERS_LOCAL, genres);
    }).catch(err => console.log(err));
}

function loadSearchFilm(searchFilm, page = 1) {

    fetchSearch(searchFilm, page).then(data => {
        if (page === 1) {
            pagination.reset();
        }

        const items = data.results;
        if (!items[0]) {
            searchFormText.style.visibility = 'visible';
            inputRef.value = '';
            return
        }

        serchFilmWork = searchFilm;
        const totalItem = data.total_results;
        console.log(totalItem);
        pagination.setTotalItems(totalItem);

        filmListRef.innerHTML = '';
        const markup = creatMarkup(items);
        filmListRef.innerHTML = markup;
        
    }).catch(console.log);
}
