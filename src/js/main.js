const burgerMenu = document.querySelector(".nav__burger-menu");
const burgerMenuBtn = document.querySelector(".nav-list__burger-menu");
const burgerNenuEscape = document.querySelector(".burger-menu__escape");

const api_key = "e5d7cf1b-0dfc-4094-8cf0-3ccc01187a0b";
const filmsURL =
    "https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_POPULAR_ALL&page=";
const api_url_search =
    "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";

const api_id = "https://kinopoiskapiunofficial.tech/api/v2.2/films/";
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

// film list
let c = 1;
function checkPosition() {
    // если пользователь прокрутил достаточно далеко (< 100px до конца)
    if (
        window.innerHeight + window.scrollY >=
            document.body.offsetHeight - 100 ||
        window.innerHeight + window.scrollY >= document.body.offsetHeight
    ) {
        // добавим больше данных
        if (c <= 20) {
            getMovies(filmsURL + c);
            c++;
        }
    }
}

function movieRaiting(score) {
    if (score == null && score == undefined) {
        return 0;
    } else {
        return score;
    }
}

async function getMovies(url = filmsURL) {
    let response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": api_key,
        },
    });
    const moviesData = await response.json();
    showMovies(moviesData);
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

function showMovies(data) {
    const moviesEl = document.querySelector(".movies");
    // document.querySelector(".movies").innerHTML = "";
    if (data.items) {
        data.items.forEach((movie, index, item) => {
            console.log(movie);
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
            movieEl.addEventListener("click", () =>
                openModal(movie.kinopoiskId)
            );
            moviesEl.appendChild(movieEl);
        });
    } else {
        data.films.forEach((movie, index, item) => {
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
            movieEl.addEventListener("click", () =>
                openModal(movie.filmId)
            );
            moviesEl.appendChild(movieEl);
        });
    }
}

// search
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

// start
checkPosition();
(() => {
    window.addEventListener("scroll", throttle(checkPosition, 100));
    window.addEventListener("resize", throttle(checkPosition, 100));
})();

const modalEl = document.querySelector(".modal");

async function openModal(id) {
    modalEl.classList.add("modal--show");
    document.body.classList.add("stop-scrolling");
    const resp = await fetch(api_id + id, {
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": api_key,
        },
    });
    const respData = await resp.json();
    modalEl.innerHTML = `
    <div class="modal__card">
    <div class="modal__card-info">
    <div class="modal__card-left"><img class="modal__movie-backdrop" src="${
        respData.posterUrl
    }" alt="" /></div>
    <div class"modal__card-right"><h2>
    <span class="modal__movie-title">${respData.nameRu}</span>, 
    <span class="modal__movie-release-year">${respData.year}</span>
</h2>
<ul class="modal__movie-info">
    <div class="loader"></div>
    <li class="modal__movie-genre">Жанр: ${respData.genres.map(
        (genre) => ` ${genre.genre} `
    )}</li>
    <li class="modal__movie-runtime">Время: ${respData.filmLength} минут</li>
    <li>Cайт: <a class="modal__movie-site" href="">${respData.webUrl}</a></li>
    <li class="modal__movie-overview">Описание: ${respData.description}</li>
</ul></div>
    </div>
        
        <button type="button" class="modal__button-close">Закрыть</button>
    </div>`;
    const btnClose = document.querySelector(".modal__button-close");
    btnClose.addEventListener("click", () => closeModal());
}

function closeModal() {
    modalEl.classList.remove("modal--show");
    document.body.classList.remove("stop-scrolling");
}

window.addEventListener("click", (e) => {
    if (e.target === modalEl) {
        closeModal();
    }
});

window.addEventListener("keydown", (e) => {
    if (e.keyCode === 27) {
        closeModal();
    }
});
