export { fetchApi, fetchGenre, fetchFilmById, fetchSearch, fetchFilmsCol };
const API_KEY = '0d7d20afff25839c3a8a445daa632bca';
const BASE_URL = 'https://api.themoviedb.org/3/';


async function fetchApi(page = 1) {
    const resp = await fetch(`${BASE_URL}trending/movie/day?api_key=${API_KEY}&page=${page}`);
    const data = await resp.json();
    return data;
}

async function fetchFilmById(id) {
    const resp = await fetch(`${BASE_URL}movie/${id}?api_key=${API_KEY}&language=en-US`);
    const data = await resp.json();
    return data;
}

async function fetchSearch(name, page = 1) {
    const resp = await fetch
        (`${BASE_URL}search/movie?api_key=${API_KEY}&query=${name}&language=en-US&page=${page}`);
    const data = await resp.json();
    return data;
} 

async function fetchGenre() {
    const resp = await fetch(`${BASE_URL}genre/movie/list?api_key=${API_KEY}&language=en-US`);
    const data = await resp.json();
    return data;
}
async function fetchFilmsCol(arr) {
    const resps = await arr.map(async el => {
        const resp = await fetch(`${BASE_URL}movie/${el}?api_key=${API_KEY}&language=en-US`);
        return resp.json()
    })
    const data = await Promise.all(resps);
    return data
}

