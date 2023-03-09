export { creatMarkup, creatCardMarkup };

function creatMarkup(items) {
    const elements = items.filter(el => el.backdrop_path);
    
    const markup = elements.map(({ title, release_date, poster_path, id }) => {
        return `
        <li class="film-list__item">
          <img src="https://image.tmdb.org/t/p/w500${poster_path}" alt="${title}" class="film-list__img" data-id="${id}">
          <h2 class="film-list__title">${title}</h2>
          <p class="film-list__text">${release_date}</p>
        </li>
        `}).join('');
    return markup;
}

function creatCardMarkup({ overview, popularity, poster_path, original_title, vote_average, vote_count, release_date}) {
    const markup = `
        <img src="https://image.tmdb.org/t/p/w500${poster_path}" class="modal-img" alt="${original_title}" loading="lazy">
        <div class="modal-content-box">
            <h2 class="modal-title">${original_title}</h2>

            <ul class="modal-list">
                <li class="modal-list__item">
                    <p class="modal-list__text">Vote / Votes</p>
                    <span class="modal-list__vote">${vote_average}</span>
                    <span class="modal-list__value">${vote_count}</span>
                </li>

                <li class="modal-list__item">
                    <p class="modal-list__text">Popularity</p>
                    <span class="modal-list__value">${popularity}</span>
                </li>

                <li class="modal-list__item">
                    <p class="modal-list__text">Original Title</p>
                    <span class="modal-list__value">${original_title}</span>
                </li>

                <li class="modal-list__item">
                    <p class="modal-list__text">Release date</p>
                    <span class="modal-list__value">${release_date}</span>
                </li>
            </ul>
            <h3 class="modal-sub-title">About</h3>
            <p class="modal-text">${overview}</p>
        </div>
    `;
    return markup;
}