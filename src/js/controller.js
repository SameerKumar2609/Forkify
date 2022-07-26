import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

// if(module.hot) {
//   module.hot.accept();
// }

const controlRecipes = async function() {
  try {
    const id = window.location.hash.slice(1);

    if(!id) return;
    recipeView.renderSpinner();

    // 0) Update results view to mark selected search results
    resultsView.update(model.getSearchResultsPage());
     
    // updating bookmarks view
    bookmarksView.update(model.state.bookmarks);
    
    //  1)loading recipe
    await model.loadRecipe(id);
    
    // 2) Rendering Recipes
    recipeView.render(model.state.recipe);
    
  } catch(err){
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function() {
  try {
    resultsView.renderSpinner();

    // 1)Get Search Query
    const query = searchView.getQuery();
    if (!query) return;

    // 2) load Search
    await model.loadSearchResults(query);

    // 3) Render Results
    resultsView.render(model.getSearchResultsPage());

    // 4) Render pagination button
    paginationView.render(model.state.search);
  } catch(err) {
    console.log(err);
  }
};
// controlSearchResults();

const controlPagination = function (goToPage) {
  // 1) Render NEW Results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render NEW pagination button
  paginationView.render(model.state.search);
}

const controlServings = function(newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);
  
  // Update the recipe view
  recipeView.update(model.state.recipe);   
};

const controlAddBookmark = function() {
  // add bookmarks
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else
  if(model.state.recipe.bookmarked) model.deleteBookmark(model.state.recipe.id);


  // Update recipe
  recipeView.update(model.state.recipe);

  // Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function() {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
try {
 await model.uploadRecipe(newRecipe);

} catch(err) {
  console.error('🎭',err);
  addRecipeView.renderError(err.message);
}

};


const init = function() {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();