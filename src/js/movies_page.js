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

async function getMovies(url = filmsURL + c, genres='') {
    let response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": api_key,
        },
    });
    const moviesData = await response.json();

    if (genres.length) {
        document.querySelector(".movies").innerHTML = "";
        showMoviesByGenre(moviesData, genres);
    } else {
        showMovies(moviesData)
    }
    
}

function showMovies(data) {
    const moviesEl = document.querySelector(".movies");
    if (data.items) {
        data.items.forEach((movie) => {
            if (movie.type === "FILM") {
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
    const moviesEl = document.querySelector(".movies");
    const dataId = []
    genres.forEach(genre => {
        dataId.push(genreList[genre.id])
    })
    if (data.items) {
        data.items.forEach((movie) => {
            const curenMovieGenres = movie.genres.map((genre) => genre.genre)
            const intersection = dataId.filter(x => curenMovieGenres.includes(x))
            // console.log(movie.type === "FILM" && intersection.length)
            if (movie.type === "FILM" && intersection.length) {
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
                                )}</p>
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

let c = 1;

function checkPosition() {
    if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 300
    ) {
        if (c <= 20) {
            getMovies(filmsURL + c);
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

const genresData = [
    "action",
    "drama",
    "military",
    "history",
    "fantastic",
    "adventures",
    "crime",
];

import { genreList } from "./genreList.js";


// document.addEventListener("click", (e) => {
//     const checkedBoxes = document.querySelectorAll(":checked");
//     getMovies(filmsURL, checkedBoxes)
// });

// вызов
checkPosition();
(() => {
    window.addEventListener("scroll", throttle(checkPosition, 250));
    window.addEventListener("resize", throttle(checkPosition, 250));
    document.addEventListener("click", (e) => {
        const checkedBoxes = document.querySelectorAll(":checked");
        if (checkedBoxes) {
            getMovies(filmsURL, checkedBoxes)
        }
    });
})();