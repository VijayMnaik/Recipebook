const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipeController");

/**
 * App Routes
 */
router.get("/", recipeController.homepage);
router.get("/recipe/:id", recipeController.exploreRecipe);
router.get("/categories", recipeController.exploreCategories);
router.get("/categories/:id", recipeController.exploreCategoriesById);
router.post("/search", recipeController.searchRecipe);
router.get("/explore-latest", recipeController.exploreLatest);
router.get("/explore-random", recipeController.exploreRandom);
router.get("/submit-recipe", recipeController.submitRecipe);
router.post("/submit-recipe", recipeController.submitRecipeOnPost);
router.get("/login", recipeController.login);
router.get("/adminindex", recipeController.adminpage);
router.get("/adminrecipe/:id", recipeController.adminrecipe);
router.get("/adminrecipeDelete/:id", recipeController.deleteRecipe);
router.get("/adminLog", recipeController.adminLog);
router.get("/admincategories", recipeController.exploreAdminCategories);
router.get("/admincategories/:id", recipeController.exploreAdminCategoriesById);
router.get("/adminsubmitrecipe", recipeController.adminsubmitRecipe);
router.post("/adminsubmitrecipe", recipeController.adminsubmitRecipeOnPost);
router.get("/adminexplorelatest", recipeController.adminexploreLatest);
router.get("/newcategory", recipeController.newcat);
router.post("/newcategory", recipeController.newcategory);
router.get("/admineupdaterecipe/:id", recipeController.updaterecipe);
router.post("/admineupdaterecipe/:id", recipeController.postupdaterecipe);
router.get("/notifications", recipeController.newmessages);
router.post("/notifications", recipeController.deleteAllMessages);
router.get("/feedback", recipeController.feedback);
router.post("/feedback", recipeController.postfeedback);
router.get("/userfeedbacks", recipeController.userfeedbacks);
router.post("/userfeedbacks", recipeController.deleteAllFeedbacks);
router.post("/admincategories/:id", recipeController.deleteCategory);
// router.get("/adminrecipeDelete/:id", recipeController.deleteRecipe);
// router.get('/deletepage',recipeController.delete);

module.exports = router;
