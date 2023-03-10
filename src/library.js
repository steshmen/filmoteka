import { fetchGenre, fetchFilmById, fetchFilmsCol } from './js/fetchApi';
import { creatMarkup, creatCardMarkup } from './js/markup';
import { Notify } from 'notiflix/build/notiflix-notify-aio';


const GENERS_LOCAL = 'genres';
const WATCHED_LOCAL = 'watched';
const QUEUE_LOCAL = 'queque';

const btnWatchedColRef = document.querySelector('.js-watched-btn');
const btnQueueColRef = document.querySelector('.js-queue-btn');
const btnRemoveWatchedRef = document.querySelector('button[data-watched]');
const btnRemoveQueueRef = document.querySelector('button[data-queue]');
const modalBtnsRef = document.querySelectorAll('.modal-btn');
const filmListRef = document.querySelector('.film-list');
const backdropRef = document.querySelector('.backdrop');
const closeModalBtn = document.querySelector('.modal-close__btn');
const modalBoxRef = document.querySelector('.modal-box');






btnQueueColRef.addEventListener('click', creatQueCol);
btnWatchedColRef.addEventListener('click', creatWatchCol);
filmListRef.addEventListener('click', openModal);
closeModalBtn.addEventListener('click', closeModal);
btnRemoveWatchedRef.addEventListener('click', removeFilmWatched)
btnRemoveQueueRef.addEventListener('click', removeFilmQueue)


backdropRef.addEventListener('click', (evt) => {
    if (evt.target.className === 'backdrop') {
        backdropRef.classList.add('is-hidden');
    }
});

creatWatchCol();

function creatQueCol() {
    btnQueueColRef.classList.add('header-lib-btn_active');
    btnWatchedColRef.classList.remove('header-lib-btn_active');

    const filmsQueue = JSON.parse(localStorage.getItem(QUEUE_LOCAL));
    if (filmsQueue) {
        fetchFilmsCol(filmsQueue)
            .then(data => {
                const markup = creatMarkup(data);
                filmListRef.innerHTML = markup;
            }).catch(console.log);
    }
}

function creatWatchCol() {
    btnQueueColRef.classList.remove('header-lib-btn_active');
    btnWatchedColRef.classList.add('header-lib-btn_active');
    const filmsWatched = JSON.parse(localStorage.getItem(WATCHED_LOCAL));
    if (filmsWatched) {
        fetchFilmsCol(filmsWatched)
            .then(data => {
                const markup = creatMarkup(data);
                filmListRef.innerHTML =  markup;
            }).catch(console.log);
    }
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
    }).catch(console.log)
} 

function closeModalEsc(evt) {
    if (evt.code === "Escape") {
        closeModal();
    }
}

function closeModal() {
    backdropRef.classList.add('is-hidden');
    modalBtnsRef.forEach((item) => {
        item.removeAttribute('data-id');
    });
    window.removeEventListener('keydown', closeModalEsc);
}

function removeFilmWatched(evt) {
    const id = Number(evt.target.dataset.id);
    const arrW = JSON.parse(localStorage.getItem(WATCHED_LOCAL));

    if (arrW) {
        if (arrW.includes(id)) {
            const idxOf = arrW.indexOf(id);
            arrW.splice(idxOf, 1);
            localStorage.setItem(WATCHED_LOCAL, JSON.stringify(arrW));
            creatWatchCol();
            Notify.success('Movie removed from Watched');
            closeModal();
            return;
        }
    }
    Notify.warning('The movie is not in the Watched');
}

function removeFilmQueue(evt) {
    const id = Number(evt.target.dataset.id);
    const arrQ = JSON.parse(localStorage.getItem(QUEUE_LOCAL));

    if (arrQ) {
        if (arrQ.includes(id)) {
            const idxOf = arrQ.indexOf(id);
            arrQ.splice(idxOf, 1);
            localStorage.setItem(QUEUE_LOCAL, JSON.stringify(arrQ));
            Notify.success('Movie removed from Queue');
            creatQueCol();
            closeModal();
            return;
        }
    }
    Notify.warning('The movie is not in the Queue');

}
