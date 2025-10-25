import { createGallery, clearGallery, showLoadMoreButton, hideLoadMoreButton, showLoader, hideLoader } from './js/render-functions';
import { getImagesByQuery } from './js/pixabay-api';
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

let currentPage = 1;
let currentQuery = '';

const searchForm = document.querySelector('#search-form');
const loadMoreBtn = document.querySelector('#load-more');

searchForm.addEventListener('submit', async e => {
  e.preventDefault();
  currentQuery = e.target.elements.query.value.trim();

  if (!currentQuery) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search query!',
      position: 'topRight',
    });
    return;
  }

  currentPage = 1;
  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);

    if (data.hits.length === 0) {
      iziToast.info({
        title: 'No Results',
        message: 'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      hideLoader();
      return;
    }

    createGallery(data.hits);
    hideLoader();

    if (data.totalHits > 15) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
    }

  } catch (error) {
    hideLoader();
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again later!',
      position: 'topRight',
    });
  }
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage += 1;
  showLoader();

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);
    createGallery(data.hits);
    hideLoader();

    const totalPages = Math.ceil(data.totalHits / 15);
    if (currentPage >= totalPages) {
      hideLoadMoreButton();
      iziToast.info({
        title: 'End of results',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }

    const { height: cardHeight } = document.querySelector(".gallery").firstElementChild.getBoundingClientRect();
    window.scrollBy({
      top: cardHeight * 2,
      behavior: "smooth",
    });

  } catch (error) {
    hideLoader();
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong while loading more images!',
      position: 'topRight',
    });
  }
});


