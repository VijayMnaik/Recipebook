require("../models/database");
require("mongoose");
const req = require("express/lib/request");
const { redirect, append } = require("express/lib/response");
const res = require("express/lib/response");
const admins = require("../models/admins");
const category = require("../models/category");
const Recipe = require("../models/Recipe");
const messages = require("../models/messages");
const feedback = require("../models/feedback");

exports.deleteCategory = async (req, res) => {
  try {
    let categoryId = req.params.id;
    console.log(req.params);
    await category.deleteOne({ name: categoryId });
    await Recipe.deleteMany({ category: categoryId });
    res.redirect("/admincategories");
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

exports.deleteAllFeedbacks = async (req, res) => {
  try {
    const msgs = await feedback.find({}).deleteMany({});
    res.redirect("/adminindex");
    // const msgs = await messages.find({}).deleteMany({});
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

exports.userfeedbacks = async (req, res) => {
  try {
    const feedbacks = await feedback.find({});
    // console.log(msgs);
    res.render("userfeedbacks", {
      title: "Cooking Blog - notifications",
      feedbacks,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

exports.postfeedback = async (req, res) => {
  const name = req.body.name;
  const user = await Recipe.find({
    $text: { $search: name, $caseSensitive: false },
  });
  // db.articles.find( { $text: { $search: "coffee",$caseSensitive :true } } )
  if (user.length == 1) {
    const newfeedback = new feedback({
      email: req.body.email,
      recipename: req.body.name,
      rating: req.body.rating,
      suggestion: req.body.description,
    });
    await newfeedback.save();
    const limitNumber = 5;
    const categories = await category.find({}).limit(limitNumber);
    const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    const thai = await Recipe.find({ category: "Thai" }).limit(limitNumber);
    const american = await Recipe.find({ category: "American" }).limit(
      limitNumber
    );
    const chinese = await Recipe.find({ category: "Chinese" }).limit(
      limitNumber
    );

    const food = { latest, thai, american, chinese };

    res.render("index", { title: "Cooking Blog - Home", categories, food });
  } else {
    req.flash("infoSubmit", "do not enter the ");
    res.redirect("/feedback");
  }
};
exports.feedback = function (req, res) {
  try {
    res.render("feedback");
  } catch (error) {
    console.log("feedback form is not opening");
  }
};

exports.deleteAllMessages = async (req, res) => {
  try {
    const msgs = await messages.find({}).deleteMany({});
    res.redirect("/adminindex");
    // const msgs = await messages.find({}).deleteMany({});
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};
//
exports.newmessages = async (req, res) => {
  try {
    // let notifications = req.params.id;

    const msgs = await messages.find({});
    // console.log(msgs);
    res.render("notifications", {
      title: "Cooking Blog - notifications",
      msgs,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

exports.submitRecipeOnPost = async (req, res) => {
  try {
    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("No Files where uploaded.");
    } else {
      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath =
        require("path").resolve("./") + "/public/uploads/" + newImageName;

      imageUploadFile.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);
      });
    }

    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName,
    });
    const message = req.body.email + " added " + req.body.name;
    const newMessage = new messages({
      message: message,
    });

    await newRecipe.save();
    await newMessage.save();
    req.flash("infoSubmit", "Recipe has been added.");
    res.redirect("/submit-recipe");
  } catch (error) {
    // const k = 1;
    req.flash("infoSubmit", "Don't Enter The Duplicate Recipename");
    res.redirect("/submit-recipe");
  }
};

exports.newcategory = async (req, res) => {
  try {
    let imageUploadFile;
    let uploadPath;
    let newImageName;
    // console.log(req.files);

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("No Files were uploaded.");
    } else {
      imageUploadFile = req.files.image;
      newImageName = imageUploadFile.name;

      uploadPath =
        require("path").resolve("./") + "/public/img/" + newImageName;

      imageUploadFile.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);
      });
    }

    const newCategory = new category({
      name: req.body.categoryname,
      image: newImageName,
    });

    await newCategory.save();

    req.flash("infoSubmit", "Recipe has been added.");
    res.redirect("/newcategory");
  } catch (error) {
    // const k = 1;
    req.flash("infoSubmit", "Don't Enter The Duplicate Recipename");
    res.redirect("/adminindex");
  }
};

exports.newcat = function (req, res) {
  res.render("newcategory");
};

//
exports.homepage = async (req, res) => {
  try {
    const limitNumber = 5;
    const categories = await category.find({}).limit(limitNumber);
    const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    const thai = await Recipe.find({ category: "Thai" }).limit(limitNumber);
    const american = await Recipe.find({ category: "American" }).limit(
      limitNumber
    );
    const chinese = await Recipe.find({ category: "Chinese" }).limit(
      limitNumber
    );

    const food = { latest, thai, american, chinese };

    res.render("index", { title: "Cooking Blog - Home", categories, food });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

exports.adminpage = async (req, res) => {
  try {
    const limitNumber = 5;
    const categories = await category.find({}).limit(limitNumber);
    const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    const thai = await Recipe.find({ category: "Thai" }).limit(limitNumber);
    const american = await Recipe.find({ category: "American" }).limit(
      limitNumber
    );
    const chinese = await Recipe.find({ category: "Chinese" }).limit(
      limitNumber
    );

    const food = { latest, thai, american, chinese };

    res.render("adminindex", {
      title: "Cooking Blog - Home",
      categories,
      food,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /categories
 * Categories
 */
exports.exploreCategories = async (req, res) => {
  try {
    // const limitNumber = 6;
    const categories = await category.find({});
    res.render("categories", {
      title: "Cooking Blog - Categoreis",
      categories,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

exports.exploreAdminCategories = async (req, res) => {
  try {
    // const limitNumber = 6;
    const categories = await category.find({});
    // console.log(admincategories);
    res.render("admincategories", {
      title: "Cooking Blog - Categoreis",
      categories,
    });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /categories/:id
 * Categories By Id
 */
exports.exploreCategoriesById = async (req, res) => {
  try {
    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Recipe.find({ category: categoryId }).limit(
      limitNumber
    );
    res.render("categories", {
      title: "Cooking Blog - Categoreis",
      categoryById,
    });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
};

exports.exploreAdminCategoriesById = async (req, res) => {
  try {
    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Recipe.find({ category: categoryId }).limit(
      limitNumber
    );
    res.render("admincategories", {
      title: "Cooking Blog - Categoreis",
      categoryById,
    });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /recipe/:id
 * Recipe
 */
exports.exploreRecipe = async (req, res) => {
  try {
    let recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);
    res.render("recipe", { title: "Cooking Blog - Recipe", recipe });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
};

exports.adminrecipe = async (req, res) => {
  try {
    let recipeId = req.params.id;

    const recipe = await Recipe.findById(recipeId);
    res.render("adminrecipe", { title: "Cooking Blog - Recipe", recipe });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * POST /search
 * Search
 */
exports.searchRecipe = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find({
      $text: { $search: searchTerm, $diacriticSensitive: true },
    });
    res.render("search", { title: "Cooking Blog - Search", recipe });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /explore-latest
 * Explplore Latest
 */
exports.exploreLatest = async (req, res) => {
  try {
    const limitNumber = 20;
    const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render("explore-latest", {
      title: "Cooking Blog - Explore Latest",
      recipe,
    });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
};

exports.adminexploreLatest = async (req, res) => {
  try {
    const limitNumber = 20;
    const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render("adminsexplorelatest", {
      title: "Cooking Blog - Explore Latest",
      recipe,
    });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /explore-random
 * Explore Random as JSON
 */
exports.exploreRandom = async (req, res) => {
  try {
    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let recipe = await Recipe.findOne().skip(random).exec();
    res.render("explore-random", {
      title: "Cooking Blog - Explore Latest",
      recipe,
    });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /submit-recipe
 * Submit Recipe
 */
exports.submitRecipe = async (req, res) => {
  const infoErrorsObj = req.flash("infoErrors");
  const infoSubmitObj = req.flash("infoSubmit");
  const categories = await category.find({}).limit();
  res.render("submit-recipe", {
    title: "Cooking Blog - Submit Recipe",
    infoErrorsObj,
    infoSubmitObj,
    categories,
  });
};

exports.updaterecipe = async (req, res) => {
  const infoErrorsObj = req.flash("infoErrors");
  const infoSubmitObj = req.flash("infoSubmit");

  const recipe = await Recipe.findById(req.params.id);
  res.render("adminupdaterecipe", {
    title: "Cooking Blog - update Recipe",
    recipe,
  });
};

exports.postupdaterecipe = async (req, res) => {
  let imageUploadFile;
  let newImageName;
  try {
    imageUploadFile = req.files.image;
    newImageName = Date.now() + imageUploadFile.name;

    uploadPath =
      require("path").resolve("./") + "/public/uploads/" + newImageName;

    imageUploadFile.mv(uploadPath, function (err) {
      if (err) return res.status(500).send(err);
    });
    const recipe = await Recipe.updateOne(
      { _id: req.params.id },
      {
        description: req.body.description,
        ingredients: req.body.ingredients,
        image: newImageName,
      }
    );
    recipe.n; // Number of documents matched
    recipe.nModified; // Number of documents modified
    res.redirect(`/adminrecipe/${req.params.id}`);
  } catch (error) {
    res.redirect("/adminindex");
  }
};

exports.adminsubmitRecipe = async (req, res) => {
  const infoErrorsObj = req.flash("infoErrors");
  const infoSubmitObj = req.flash("infoSubmit");
  const categories = await category.find({}).limit();
  res.render("adminsubmitrecipe", {
    title: "Cooking Blog - Submit Recipe",
    infoErrorsObj,
    infoSubmitObj,
    categories,
  });
};
// exports.adminrecipe = async(req, res) => {
//   const infoErrorsObj = req.flash('infoErrors');
//   const infoSubmitObj = req.flash('infoSubmit');
//   res.render('adminrecipe', { title: 'Cooking Blog - Submit Recipe', infoErrorsObj, infoSubmitObj  } );
// }

exports.login = async (req, res) => {
  res.render("login", { txt: false });
};

exports.adminLog = async (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

  const user = await admins.find({ name: username, password });

  if (user.length == 1) {
    res.redirect("/adminindex");
  } else {
    req.flash("infoSubmit", "Enter valid username and password");
    res.redirect("/login");
  }
};

// exports.login = (req, res) => {
//   res.render('submit-recipe');
// }

/**
 * POST /submit-recipe
 * Submit Recipe
 */

exports.adminsubmitRecipeOnPost = async (req, res) => {
  try {
    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("No Files where uploaded.");
    } else {
      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath =
        require("path").resolve("./") + "/public/uploads/" + newImageName;

      imageUploadFile.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);
      });
    }

    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName,
    });

    await newRecipe.save();

    req.flash("infoSubmit", "Recipe has been added.");
    res.redirect("/adminsubmitrecipe");
  } catch (error) {
    // const k = 1;
    req.flash("infoSubmit", "Don't Enter The Duplicate Recipename");
    res.redirect("/adminsubmitrecipe");
  }
};

// Delete Recipe
// exports.recasync function deleteRecipe(){
//   try {
//     await Recipe.deleteOne({ name: 'New Recipe From Form' });
//     res.redirect('./deletepage')
//   } catch (error) {
//     console.log(error);
//   }
// }
exports.deleteRecipe = async (req, res) => {
  try {
    let recipeId = req.params.id;
    await Recipe.deleteOne({ _id: recipeId });

    res.redirect("/adminindex");
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
};
// deleteRecipe();
// exports.admindeleteRecipe = async (req, res) => {
//   try {
//     let recipeId = req.params.id;
//     await Recipe.deleteOne({ _id: recipeId });

//     req.flash("infoSubmit", "Recipe Deleted Successfully");
//     res.redirect("/adminindex");
//   } catch (error) {
//     res.satus(500).send({ message: error.message || "Error Occured" });
//   }
// };
// Update Recipe
exports.edit = async (req, res) => {
  try {
    const res = await Recipe.updateOne(
      { name: req.params.name },
      { name: "New Recipe Updated" }
    );
    res.n; // Number of documents matched
    res.nModified; // Number of documents modified
  } catch (error) {}
};
// updateRecipe();

/**
 * Dummy Data Example
 */

// async function insertDymmyCategoryData(){
//   try {
//     await Category.insertMany([
//       {
//         "name": "Thai",
//         "image": "thai-food.jpg"
//       },
//       {
//         "name": "American",
//         "image": "american-food.jpg"
//       },
//       {
//         "name": "Chinese",
//         "image": "chinese-food.jpg"
//       },
//       {
//         "name": "Mexican",
//         "image": "mexican-food.jpg"
//       },
//       {
//         "name": "Indian",
//         "image": "indian-food.jpg"
//       },
//       {
//         "name": "Spanish",
//         "image": "spanish-food.jpg"
//       }
//     ]);
//   } catch (error) {
//     console.log('err', + error)
//   }
// }

// insertDymmyCategoryData();

// async function insertDymmyRecipeData(){
//   try {
//     await Recipe.insertMany([
//       {
//         "name": "Recipe Name Goes Here",
//         "description": `Recipe Description Goes Here`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American",
//         "image": "southern-friend-chicken.jpg"
//       },
//       {
//         "name": "Recipe Name Goes Here",
//         "description": `Recipe Description Goes Here`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American",
//         "image": "southern-friend-chicken.jpg"
//       },
//     ]);
//   } catch (error) {
//     console.log('err', + error)
//   }
// }

// insertDymmyRecipeData();
