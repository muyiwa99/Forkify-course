import 'core-js/stable';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import { MODAL_CLOSE_SEC } from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import AddRecipeView from './views/addRecipeView.js';
import addRecipeView from './views/addRecipeView.js';

if (module.hot) {
  module.hot.accept();
}

// Lesson- 289-------- Loading a recipe

// * Make AJAX request to an API
const controlRecipes = async function () {
  try {
    // resultsView.renderSpinner();
    // * Getting recipe ID from the hash
    const id = window.location.hash.slice(1);
    // console.log(id);

    if (!id) return;
    recipeView.renderSpinner();

    // 0) Results view to mark selcted search result
    resultsView.render(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);
    // * 1. Loading a recipe (returns a promise)
    await model.loadRecipe(id);

    // * 2. Rendering Recipe
    recipeView.render(model.state.recipe);

    // ! Test
    // controlServings();
  } catch (err) {
    // alert(err);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // * get search Query
    const query = searchView.getQuery();
    if (!query) return;

    // * Load search results
    await model.loadSearchResults(query);

    // * Render results

    //resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage(1));

    // Render initial pagination buttons

    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  // * Render new results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // * Render new Pagination buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // * Update the recipe servings in the state

  model.updateServings(newServings);

  // * Update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  // 1) Add/Remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2) update recipe view
  // console.log(model.state.recipe);
  recipeView.update(model.state.recipe);

  // 3) Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Show Spinner
    addRecipeView.renderSpinner();
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    recipeView.render(model.state.recipe);

    // Close form

    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);

    // Display Success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in the URL

    window.history.pushState(null, '', `#${model.state.recipe.id}`);
  } catch (err) {
    console.error('💥', err);
    addRecipeView.renderError(err.message);
  }
};

const newFeature = function () {
  console.log('Welcome to the applciation');
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
  newFeature();
};
init();

// Debugger function

// controlRecipe();

// * Perfect Architecture- Structure, Maintainability and Expandability
// * We can use well establshed architecture patterns such as MVC, Flux, MVP etc.
// * We can also use a framework like React, Angular, Vue, Svelte etc.

// ! Componnet of and architecture
// Business Logic
// State
// HTTP Libary
// Application Logic
// Presentation Logic

// ! MVC Architecture
// Model- Business logic, State
// Controller- Application Logic
// View- Presentation Logic
