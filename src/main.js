import { createGallery, clearGallery, showLoadMoreButton, hideLoadMoreButton } from './js/render-functions';
import { getImagesByQuery } from './js/pixabay-api';

let currentPage = 1;
let currentQuery = '';

const searchForm = document.querySelector('#search-form');
const loadMoreBtn = document.querySelector('#load-more');

searchForm.addEventListener('submit', async e => {
  e.preventDefault();
  currentQuery = e.target.elements.query.value.trim();
  currentPage = 1;
  clearGallery();
  hideLoadMoreButton(); 

  const data = await getImagesByQuery(currentQuery, currentPage);
  createGallery(data.hits);

  if (data.totalHits > 15) { 
    showLoadMoreButton();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage += 1;
  const data = await getImagesByQuery(currentQuery, currentPage);
  createGallery(data.hits);

  if (currentPage * 15 >= data.totalHits) { 
    hideLoadMoreButton();
    alert("We're sorry, but you've reached the end of search results.");
  }
});
