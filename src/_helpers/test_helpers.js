const User = require('../mongo/model/user');

const test_user = {
    email : "test@test.com",
    password : "testPassword"
};

const test_recipe = {
    "imgPath": "",
    "servingSize": 4,
    "instructions": ["Whisk vinegar, soy sauce, garlic, olive oil, brown sugar, and crushed peppercorns in a bowl until sugar is dissolved. Stir bay leaves into the sauce"],
    "likedUsers": [],
    "type": "breakfast",
    "name": "D",
    "prepTime": 5,
    "cookTime": 35,
    "ingredients": [],
    "__v": 0
};

const test_recipe2 = {
    "imgPath": "",
    "servingSize": 4,
    "instructions": ["Whisk vinegar, soy sauce, garlic, olive oil, brown sugar, and crushed peppercorns in a bowl until sugar is dissolved. Stir bay leaves into the sauce"],
    "likedUsers": [],
    "type": "breakfast",
    "name": "E",
    "prepTime": 5,
    "cookTime": 35,
    "ingredients": [],
    "__v": 0};

module.exports = {test_user, test_recipe, test_recipe2};