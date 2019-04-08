const API_Key ='bf9e77b9047845d6afa32a1ee4c1cd52' ;
const RequestHead = 'https://api.themoviedb.org/3/';

const list  = document.getElementById('moviesList');
const input = document.getElementsByName('searchedMovie')[0];
const backToListBtn = document.getElementById('backToList');

const selected        = document.getElementById('selected');
const poster          = document.getElementById('poster');
const movieTitle      = document.getElementById('movieTitle');
const details         = document.getElementById('details');
const overview        = document.getElementById('overview');
const recommendations = document.getElementById('recommendations');

document.addEventListener('DOMContentLoaded', async () =>{
   fillTheList(await getTrending())
});
const getTrending = async () =>{
    const req = await fetch(`${RequestHead}trending/all/week?api_key=${API_Key}`);
    const trending = await req.json();
    return trending.results;
};

const getDetails = async (e) =>{
    const id = e.target.getAttribute('data-id');
    const isMovie = e.target.getAttribute('data-isMovie');
    // const req = isMovie ?
    const req = await fetch(`${RequestHead}movie/${id}?api_key=${API_Key}`)
        // :
        // await fetch(`${RequestHead}tv/${id}?api_key=${API_Key}&language=en-US`);
    const movieInfo = await req.json();

    const movieGenres = [];
    for(let i = 0; i <movieInfo.genres.length; i++){
        movieGenres.push(movieInfo.genres[i].name);
    }
    movieTitle.innerHTML = `<h1>${movieInfo.title}</h1><h2>${movieInfo.tagline}</h2>`;
    details.innerHTML    = `<p>Genre: ${movieGenres}</p><p>Release date: ${movieInfo.release_date}</p>`;
    overview.innerHTML   = `<p>${movieInfo.overview}</p>`;

    poster.appendChild(await getPoster(movieInfo));
    recommendations.appendChild(await getSimilar(movieInfo));

    selected.classList.remove('hide');
    list.classList.add('hide');
    backToListBtn.classList.remove('hide');
};

const getPoster = async (movieInfo) =>{
    const posterImg = document.createElement('img');
    posterImg.setAttribute('src',`https://image.tmdb.org/t/p/w300/${movieInfo.poster_path}`);
    return posterImg;
};

const getSimilar = async (movieInfo) =>{
    const req = await fetch(`${RequestHead}movie/${movieInfo.id}/similar?api_key=${API_Key}`);
    const similar = await req.json();
    const recommendationsList = document.createElement('ul');
    recommendationsList.classList.add('recommendationsList');
    for(let i = 0; i < 3 ; i++){
        const li = document.createElement('li');

        li.classList.add('fromRecommendations');
        li.addEventListener('click', getDetailsKostul);
        li.innerHTML = `<img src="https://image.tmdb.org/t/p/w200/${similar.results[i].poster_path}"/><h3>${similar.results[i].title}</h3>`;
        li.setAttribute('data-id', similar.results[i].id);
        li.setAttribute('data-isMovie', similar.results[i].title ? true : false);
        li.firstChild.setAttribute('data-id', similar.results[i].id);
        li.lastChild.setAttribute('data-id', similar.results[i].id);
        recommendationsList.appendChild(li);
    }
    return recommendationsList;
};
const getDetailsKostul = async (e) =>{
    await clearSelected();
    const id = e.target.getAttribute('data-id');
    const isMovie = e.target.getAttribute('data-isMovie');
    // const req = isMovie ?
    const req = await fetch(`${RequestHead}movie/${id}?api_key=${API_Key}`);
        // :
        // await fetch(`${RequestHead}tv/${id}?api_key=${API_Key}&language=en-US`);
    const movieInfo = await req.json();

    const movieGenres = [];
    for(let i = 0; i <movieInfo.genres.length; i++){
        movieGenres.push(movieInfo.genres[i].name);
    }
    movieTitle.innerHTML = `<h1>${movieInfo.title}</h1><h2>${movieInfo.tagline}</h2>`;
    details.innerHTML    = `<p>Genre: ${movieGenres}</p><p>Release date: ${movieInfo.release_date}</p>`;
    overview.innerHTML   = `<p>${movieInfo.overview}</p>`;

    poster.appendChild(await getPoster(movieInfo));
    recommendations.appendChild(await getSimilar(movieInfo));

    selected.classList.remove('hide');
    list.classList.add('hide');
    backToListBtn.classList.remove('hide');
};
const searchMovies = async () =>{
    const searchedMovie = input.value.split(' ').join('%20');
    if(searchedMovie === ''){
        clearList();
        fillTheList(await getTrending());
        return null;
    }
    const req = await fetch(`https://cors-anywhere.herokuapp.com/${RequestHead}/search/multi?api_key=${API_Key}&query=${searchedMovie}`);
    const res = await req.json();

    clearList();
    backToListBtn.classList.remove( 'hide');

    fillTheList(res.results);
};

const fillTheList = (data) =>{
    for(let i = 0; i < 10; i++){
        const li = document.createElement('li');
        li.innerText = data[i].title||data[i].name;
        li.setAttribute('data-id', data[i].id);
        li.setAttribute('data-isMovie', data[i].title ? true : false);
        li.addEventListener('click', getDetails);
        list.appendChild(li);
    }
};

const clearList = () =>{
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
};

const backToList = async () =>{
    clearList();
    fillTheList(await getTrending());
    list.classList.remove('hide');
    selected.classList.add('hide');
    backToListBtn.classList.add( 'hide');
    clearSelected();
};

const clearSelected = () =>{
    while (poster.firstChild) {
        poster.removeChild(poster.firstChild);
    }
    while (movieTitle.firstChild) {
        movieTitle.removeChild(movieTitle.firstChild);
    }
    while (details.firstChild) {
        details.removeChild(details.firstChild);
    }
    while (overview.firstChild) {
        overview.removeChild(overview.firstChild);
    }
    while (recommendations.firstChild) {
        recommendations.removeChild(recommendations.firstChild);
    }
};
