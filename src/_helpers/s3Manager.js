const Recipe = require('../mongo/model/recipe');
const sharp = require('sharp');
const AWS = require('aws-sdk');

// aws account
const s3 = new AWS.S3({
    accessKeyId: process.env.AWSAccessKeyId,
    secretAccessKey: process.env.AWSSecretKey
});

// aws s3 bucket name
const s3BucketName = "kgbip-foodster";

const migrateRecipe = async(recipe_name) => {
    // getting recipe
    const recipe = await Recipe.findRecipeWithName(recipe_name);
    if (!recipe)
        throw new Error('Recipe could not be found');

    // checking whether if image is already migrated
    if (recipe.img_path)
        throw new Error("Recipe's image is already migrated");
    
    // resizing
    const base64Image = recipe.img.toString();
    var img = new Buffer.from(base64Image, 'base64');
    
    const fileContent = await sharp(img)
    .resize(250, 250)
    .toBuffer();

    // Setting up S3 upload parameters
    const params = {
        Bucket: s3BucketName,
        // Key: recipe.name, // File name you want to save as in S3
        Key: recipe_name,
        Body: fileContent,
        ACL: 'public-read',
        ContentEncoding: 'base64', // required
        ContentType: 'image/jpg' // required. Notice the back ticks
    };
    
    //Uploading files to the bucket
    s3.upload(params, async function(err, data) {
        if (err) {
            console.log(err);
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
        recipe.img = undefined;
        await recipe.save();
        await Recipe.updateMany( {name: recipe.name},{ $set: { img_path : data.Location} }, { multi: true });
    });
};

module.exports = migrateRecipe;