const burgerMenu = document.querySelector(".nav__burger-menu");
const burgerMenuBtn = document.querySelector(".nav-list__burger-menu");
const burgerNenuEscape = document.querySelector(".burger-menu__escape");

const api_key = "e5d7cf1b-0dfc-4094-8cf0-3ccc01187a0b";
const filmsURL =
    "https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_POPULAR_ALL&page=";
const api_url_search =
    "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";
// burger menu

function menuEscape() {
    burgerMenu.classList.remove("open");
}

burgerMenuBtn.addEventListener("click", () => {
    burgerMenu.classList.add("open");
});

document.addEventListener("click", (e) => {
    if (
        burgerMenu.classList.contains("open") &&
        !(e.target.classList.value === "nav__burger-menu open") &&
        !(e.target.classList.value === "nav-list__burger-menu") &&
        !(e.target.classList.value === "line")
    ) {
        menuEscape();
    }
});

burgerNenuEscape.addEventListener("click", () => {
    menuEscape();
});

//films

function movieRaiting(score) {
    if (score == null && score == undefined) {
        return 0;
    } else {
        return score;
    }
}

async function getMovies(url = filmsURL + c, genres = "") {
    let response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": api_key,
        },
    });
    const moviesData = await response.json();
    console.log(moviesData);

    if (genres.length) {
        showMoviesByGenre(moviesData, genres);
    } else {
        showMovies(moviesData);
    }
}

function getClassByRate(rating) {
    if (rating >= 7) {
        return "green";
    } else if (rating < 7 && rating >= 5) {
        return "orange";
    } else {
        return "red";
    }
}

function showMovies(data) {
    const moviesEl = document.querySelector(".movies");
    if (data.items) {
        data.items.forEach((movie) => {
            if (movie.type === "TV_SERIES") {
                const movieEl = document.createElement("div");
                movieEl.classList.add("movie");
                movieEl.innerHTML = `
                        <img src="${movie.posterUrl}" alt="">
                        <h1>${movie.nameRu}</h1>
                        <div class="movie__info">
                            <p class="movie__year">${movie.year}</p>
                            <div class="movie__raiting">
                                <img src="./img/star.svg" alt="">
                            <p class="score">${movieRaiting(
                                movie.ratingKinopoisk
                            )}</p>
                            </div>
                        </div>`;
                moviesEl.appendChild(movieEl);
            }
        });
    } else {
        data.films.forEach((movie, index, item) => {
            if (movie.type === "TV_SERIES") {
                const movieEl = document.createElement("div");
                movieEl.classList.add("movie");
                movieEl.innerHTML = `
                        <img src="${movie.posterUrl}" alt="">
                        <h1>${movie.nameRu}</h1>
                        <div class="movie__info">
                            <p class="movie__year">${movie.year}</p>
                            <div class="movie__raiting">
                                <img src="./img/star.svg" alt="">
                            <p class="score">${movieRaiting(
                                movie.ratingKinopoisk
                            )}</p>
                            </div>
                        </div>`;
                moviesEl.appendChild(movieEl);
            }
        });
    }
}

function showMoviesByGenre(data, genres) {
    // document.querySelector(".movies").innerHTML = "";
    const moviesEl = document.querySelector(".movies");
    const dataId = [];
    genres.forEach((genre) => {
        dataId.push(genreList[genre.id]);
    });
    if (data.items) {
        data.items.forEach((movie) => {
            const curenMovieGenres = movie.genres.map((genre) => genre.genre);
            const intersection = dataId.filter((x) =>
                curenMovieGenres.includes(x)
            );
            if (movie.type === "TV_SERIES" && intersection.length) {
                // console.log(movie.nameRu, intersection)
                const movieEl = document.createElement("div");
                movieEl.classList.add("movie");
                movieEl.innerHTML = `
                        <img src="${movie.posterUrl}" alt="">
                        <h1>${movie.nameRu}</h1>
                        <div class="movie__info">
                            <p class="movie__year">${movie.year}</p>
                            <div class="movie__raiting">
                                <img src="./img/star.svg" alt="">
                                <p class="score">${movieRaiting(
                                    movie.ratingKinopoisk
                                )}
                                </p>
                            </div>
                        </div>`;
                moviesEl.appendChild(movieEl);
            }
        });
    }
}

function throttle(callee, timeout) {
    let timer = null;

    return function perform(...args) {
        if (timer) return;

        timer = setTimeout(() => {
            callee(...args);

            clearTimeout(timer);
            timer = null;
        }, timeout);
    };
}

let c =1
function checkPosition() {
    let genre = document.querySelectorAll(":checked");
    console.log(genre);
    if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 200
    ) {
        if (c <= 20) {
            getMovies(filmsURL + c, genre);
            c++;
        }
    }
}

const form = document.querySelector("form");
const search = document.querySelector("input");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log(search.value);

    const apiSearchUrl = `${api_url_search}${search.value}`;

    if (search.value) {
        document.querySelector(".movies").innerHTML = "";
        document.querySelector("input").checked = false;
        getMovies(apiSearchUrl);
    }

    search.value = "";
});

//popup
const genresBtn = document.querySelector(".genre_choice");
const genresContent = document.querySelector(".popup_content");

genresBtn.addEventListener("click", () => {
    genresContent.classList.toggle("open");
});

// genres

import { genreList } from "./genreList.js";

const showBtn = document.querySelector(".show_filers");

showBtn.addEventListener("click", () => {
    if (document.querySelectorAll(":checked").length) {
        document.querySelector(".movies").innerHTML = "";
        getMovies(filmsURL + c, document.querySelectorAll(":checked"));
    } else {
        document.querySelector(".movies").innerHTML = "";
        let c = 1;
    }
});

checkPosition();

(() => {
    window.addEventListener("scroll", throttle(checkPosition, 250));
    window.addEventListener("resize", throttle(checkPosition, 250));
})();


// filter btn
const filterBtn = document.querySelector('.filter')
const aside = document.querySelector('aside')

filterBtn.addEventListener('click', () => {
    aside.classList.toggle('open')
})
