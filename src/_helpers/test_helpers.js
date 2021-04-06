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
    "name": "A",
    "prepTime": 5,
    "cookTime": 35,
    "ingredients": [
        {
            "text": "1 tbsp of sugar and a lot of salt",
            "unit": "tbsp",
            "name": "pepper",
            "originID": "604533cedd23980b2203f017"
        }
    ],
    "__v": 0
};

    const test_recipe2 = {
        "imgPath": "",
        "servingSize": 4,
        "instructions": ["Whisk vinegar, soy sauce, garlic, olive oil, brown sugar, and crushed peppercorns in a bowl until sugar is dissolved. Stir bay leaves into the sauce"],
        "likedUsers": [],
        "type": "breakfast",
        "name": "B",
        "prepTime": 5,
        "cookTime": 35,
        "ingredients": [],
        "__v": 0};

module.exports = {test_user, test_recipe, test_recipe2};