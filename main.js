const API_Key ='bf9e77b9047845d6afa32a1ee4c1cd52' ;
// const API_Read_Access_Token_v4_auth = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiZjllNzdiOTA0Nzg0NWQ2YWZhMzJhMWVlNGMxY2Q1MiIsInN1YiI6IjVjYTYxZjVjMGUwYTI2MWI5YWI2MWNmOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.O78ducZ0A5RMXC7n8ukXXKo1Yc4fpBz7ny7_oAUkELw';
// const exampleRequest= 'https://api.themoviedb.org/3/movie/550?api_key=bf9e77b9047845d6afa32a1ee4c1cd52';
const RequestHead = 'https://api.themoviedb.org/3/';
const PosterImgRequestHead = 'https://image.tmdb.org/t/p/';


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
    console.log(trending.results);
    return trending.results;
};

const getDetails = async (e) =>{
    const id = e.target.getAttribute('data-id');
    const isMovie = e.target.getAttribute('data-isMovie');
    const req = isMovie ?
        await fetch(`${RequestHead}movie/${id}?api_key=${API_Key}`)
        :
        await fetch(`${RequestHead}tv/${id}?api_key=${API_Key}&language=en-US`);
    const movieInfo = await req.json();
    console.log(movieInfo);

    const movieGenres = [];
    for(let i = 0; i <movieInfo.genres.length; i++){
        movieGenres.push(movieInfo.genres[i].name);
    }

    poster.appendChild(await getPoster(movieInfo));


    movieTitle.innerHTML = `<h1>${movieInfo.title}</h1><h2>${movieInfo.tagline}</h2>`;

    details.innerHTML = `<p>Genre: ${movieGenres}</p><p>Release date: ${movieInfo.release_date}</p>`;

    overview.innerHTML = `<p>${movieInfo.overview}</p>`;

    recommendations.appendChild(await getSimilar(movieInfo));

    selected.removeAttribute('class');
    list.setAttribute('class', 'hide');
    backToListBtn.removeAttribute('class');
};

const getPoster = async (movieInfo) =>{
    const posterImg = document.createElement('img');
    posterImg.setAttribute('src',`https://image.tmdb.org/t/p/w300/${movieInfo.poster_path}`);
    return posterImg;
};

const getSimilar = async (movieInfo) =>{
    const req = await fetch(`${RequestHead}movie/${movieInfo.id}/similar?api_key=${API_Key}`);
    const similar = await req.json();
    console.log(similar);
    const recommendationsList = document.createElement('ul');
    recommendationsList.setAttribute('class', 'recommendationsList');
    for(let i = 0; i < 5 ; i++){
        const li = document.createElement('li');
        li.innerHTML = `<img src="https://image.tmdb.org/t/p/w200/${similar.results[i].poster_path}"/><h3>${similar.results[i].title}</h3>`;
        recommendationsList.appendChild(li);
    }
    return recommendationsList;
};

const searchMovies = async () =>{
    const searchedMovie = input.value.split(' ').join('%20');
    const req = await fetch(`https://cors-anywhere.herokuapp.com/${RequestHead}/search/multi?api_key=${API_Key}&query=${searchedMovie}`);
    const res = await req.json();
    // console.log(res.results);
    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }
    fillTheList(res.results);
};

const fillTheList = (data) =>{
    for(let i = 0; i < 10; i++){
        const li = document.createElement('li');
        li.innerText = data[i].title||data[i].name;
        li.setAttribute('data-id', data[i].id);
        li.setAttribute('data-isMovie', data[i].title ? true : false);
        li.setAttribute('сlass', 'movieItem');
        li.addEventListener('click', getDetails);
        list.appendChild(li);
    }
};


const backToList = async () =>{
    list.removeAttribute('class');
    selected.setAttribute('class', 'hide');
    backToListBtn.setAttribute('class', 'hide');
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
