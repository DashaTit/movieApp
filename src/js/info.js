const api_key = "e5d7cf1b-0dfc-4094-8cf0-3ccc01187a0b";
// https://www.youtube.com/embed/hNCmb-4oXJA?si=PJI57F1qHzc3Ys0S "YOUTUBE"
async function getMovies(url = 'https://kinopoiskapiunofficial.tech/api/v2.2/films/5437600/videos') {
    let response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": api_key,
        },
    });
    const moviesData = await response.json();
    console.log(moviesData)
}

getMovies()