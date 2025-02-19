const API_KEY = '00d9b472-0fea-4324-aeae-000019beec4e'
const API_URL_POPULAR =
	'https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_100_POPULAR_FILMS&page=1'
const API_URL_SEARCH =
	'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword='
const API_URL_MOVIE_DETAILS =
	'https://kinopoiskapiunofficial.tech/api/v2.2/films/'

getMovies(API_URL_POPULAR)

async function getMovies(url) {
	const resp = await fetch(url, {
		headers: {
			'Content-Type': 'application/json',
			'X-API-KEY': API_KEY,
		},
	})
	const respData = await resp.json()
	showMovies(respData)
}

function getClassByRate(vote) {
	if (vote >= 7) {
		return 'green'
	} else if (vote > 5) {
		return 'orange'
	} else {
		return 'red'
	}
}

function showMovies(data) {
	const moviesEl = document.querySelector('.movies')

	// Очищаем предыдущие фильмы
	document.querySelector('.movies').innerHTML = ''

	data.films.forEach(movie => {
		const movieEl = document.createElement('div')
		movieEl.classList.add('movie')
		movieEl.innerHTML = `
        <div class="movie__cover-inner">
        <img
          src="${movie.posterUrlPreview}"
          class="movie__cover"
          alt="${movie.nameRu}"
        />
        <div class="movie__cover--darkened"></div>
      </div>
      <div class="movie__info">
        <div class="movie__title">${movie.nameRu}</div>
        <div class="movie__category">${movie.genres.map(
					genre => ` ${genre.genre}`,
				)}</div>
        ${
					movie.rating &&
					`
        <div class="movie__average movie__average--${getClassByRate(
					movie.rating,
				)}">${movie.rating}</div>
        `
				}
      </div>
        `
		movieEl.addEventListener('click', () => openModal(movie.filmId))
		moviesEl.appendChild(movieEl)
	})
}

const form = document.querySelector('form')
const search = document.querySelector('.header__search')

form.addEventListener('submit', e => {
	e.preventDefault()

	const apiSearchUrl = `${API_URL_SEARCH}${search.value}`
	if (search.value) {
		getMovies(apiSearchUrl)

		search.value = ''
	}
})
//------------------------------------------------------------------------------------------------------------------------------------------------------------------//
// MODAL WINDOW //

const modalEl = document.querySelector('.modal')
async function openModal(id) {
	const resp = await fetch(API_URL_MOVIE_DETAILS + id, {
		headers: {
			'Content-Type': 'application/json',
			'X-API-KEY': API_KEY,
		},
	})

	const respData = await resp.json()

	modalEl.classList.add('modal--show')
	document.body.classList.add('stop-scrolling')

	modalEl.innerHTML = `
   <div class="modal__card">
      <img class="modal__movie-backdrop" src="${respData.posterUrl}" alt="">
          <h2>
            <span class="modal__movie-title">${respData.nameRu}</span>
            <span class="modal__movie-release-year">- ${respData.year}</span>
          </h2>
          <ul class="modal__movie-info">
            <div class="loader"></div>
            <li class="movie__modal-genre">Жанр: ${respData.genres.map(
							el => `<span>${el.genre}</span>`,
						)}</li>
           ${
							respData.filmLength
								? `<li class="modal__movie-runtime">Время: ${respData.filmLength} минут</li>`
								: ''
						}
            <li class="">Сайт:  <a class="modal__movie-site" href="${
							respData.webUrl
						}">${respData.webUrl}</a></li>
            <li class="modal__movie-owerview">Описание: ${
							respData.description
						}</li>
          </ul>
          <button type="button" class="modal__button-close">Закрыть</button>
        </div>
`

	const btnClose = document.querySelector('.modal__button-close')
	btnClose.addEventListener('click', () => closeModal())
}
function closeModal() {
	modalEl.classList.remove('modal--show')
	document.body.classList.remove('stop-scrolling')
}

window.addEventListener('click', e => {
	if (e.target === modalEl) {
		closeModal()
	}
})
window.addEventListener('keydown', e => {
	if (e.keyCode === 27) {
		closeModal()
	}
})

// ------------------------------------------------------------------------------------------------------------------------------------------------------------------ //

// const API_KEY = "00d9b472-0fea-4324-aeae-000019beec4e";
// const API_URL_POPULAR =
//   "https://kinopoiskapiunofficial.tech/api/v2.2/films/collections?type=TOP_250_MOVIES&page=1";
// const API_URL_SEARCH =
//   "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";

// // Получаем популярные фильмы при загрузке страницы
// document.addEventListener("DOMContentLoaded", () => {
//   getMovies(API_URL_POPULAR);
// });

// async function getMovies(url) {
//   try {
//     const resp = await fetch(url, {
//       headers: {
//         "Content-Type": "application/json",
//         "X-API-KEY": API_KEY,
//       },
//     });

//     if (!resp.ok) {
//       throw new Error(`HTTP error! Status: ${resp.status}`);
//     }

//     const respData = await resp.json();
//     showMovies(respData);
//   } catch (error) {
//     console.error("Failed to fetch movies:", error);
//     document.querySelector(
//       ".movies"
//     ).innerHTML = `<p>Failed to load movies: ${error.message}</p>`;
//   }
// }

// function getClassByRate(vote) {
//   if (vote >= 7) {
//     return "green";
//   } else if (vote > 5) {
//     return "orange";
//   } else {
//     return "red";
//   }
// }

// function showMovies(data) {
//   const moviesEl = document.querySelector(".movies");
//   moviesEl.innerHTML = ""; // Очищаем предыдущие фильмы

//   // Проверяем, есть ли фильмы для популярных фильмов
//   if (data.items && data.items.length > 0) {
//     data.items.forEach((movie) => {
//       // Для популярных фильмов
//       const movieEl = createMovieElement(movie);
//       moviesEl.appendChild(movieEl);
//     });
//   } else if (data.films && data.films.length > 0) {
//     // Для поисковых фильмов
//     data.films.forEach((movie) => {
//       const movieEl = createMovieElement(movie);
//       moviesEl.appendChild(movieEl);
//     });
//   } else {
//     moviesEl.innerHTML = "<p>No movies found</p>"; // Сообщение, если нет фильмов
//   }
// }

// function createMovieElement(movie) {
//   const movieEl = document.createElement("div");
//   movieEl.classList.add("movie");
//   movieEl.innerHTML = `
//     <div class="movie__cover-inner">
//       <img
//         src="${movie.posterUrlPreview || movie.posterUrl}"
//         class="movie__cover"
//         alt="${movie.nameRu}"
//       />
//       <div class="movie__cover--darkened"></div>
//     </div>
//     <div class="movie__info">
//       <div class="movie__title">${movie.nameRu}</div>
//       <div class="movie__category">${(movie.genres || [])
//         .map((genre) => ` ${genre.genre}`)
//         .join(", ")}</div>
//          <div
//            class="movie__average movie__average--${getClassByRate(
//              movie.rating || movie.ratingKinopoisk
//            )}"
//          >
//            ${movie.rating || movie.ratingKinopoisk}
//          </div>
//     </div>
//   `;
//   return movieEl;
// }

// const form = document.querySelector(".form");
// const search = document.querySelector(".header__search");

// form.addEventListener("submit", (e) => {
//   e.preventDefault();

//   const apiSearchUrl = `${API_URL_SEARCH}${encodeURIComponent(
//     search.value.trim()
//   )}`;
//   if (search.value) {
//     getMovies(apiSearchUrl);
//   }
// });
