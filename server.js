const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const { ObjectId } = require("mongodb");
const PORT = 8080;
const cors = require("cors");
require("dotenv").config();

let db,
  dbConnectionStr = process.env.DB_STRING, // The dbConnectionStr is saved to the .env file. If you have a .env file, you need to npm install dotenv and require dotenv.
  dbName = "blog-api-db"; // this is the name of the database that we will be using.
  dbCollection = "posts"; // this is the name of the collection that we will be using.

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  (client) => {
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName);
  })
  app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${PORT}`);
});


app.set("view engine", "ejs"); // This line tells our app to use EJS as its view engine.
app.use(express.static("public")); //This line tells our app to use the public folder for static files.
app.use(express.urlencoded({ extended: true })); // This line tells our app to use the body-parser middleware. This is how we can get the data from the text.
app.use(express.json()); //This line tells our app to use the body-parser middleware.
app.use(cors()); // This line tells our app to use the cors middleware.

app.get("/", async (request, response) => {
  try {
    const items = await dbCollection.find().toArray();
    response.render("index.ejs", { items: items });
  } catch (error) {
    console.error(error);
    response.status(500).send("Internal Server Error");
  }
});


app.post("/addPost", (request, response) => {
  dbCollection
    .insertOne({thing: request.body.content, completed: false })
    .then((result) => {
      console.log("Post Added");
      response.redirect("/");
    })
    .catch((error) => console.error(error));
});

app.put("/updatePost/:id", (request, response) => {
  const postId = request.params.id;
  const updatedContent = request.body.updatedContent;

  dbCollection
    .updateOne({ _id: ObjectId(postId) }, { $set: { thing: updatedContent } })
    .then(() => {
      console.log("Post updated");

      // Fetch the updated post data from the database
      dbCollection
        .findOne({ _id: ObjectId(postId) })
        .then((updatedPost) => {
          // Send the updated post data back to the client
          response.json(updatedPost);
        })
        .catch((error) => {
          console.error(error);
          response.sendStatus(500);
        });
    })
    .catch((error) => {
      console.error(error);
      response.sendStatus(500);
    });
});

app.delete("/deletePost", (request, response) => {
  dbCollection
    .deleteOne({ thing: request.body.itemFromJS })
    .then((result) => {
      console.log("Post Deleted");
      response.json("Post Deleted");
    })
    .catch((error) => console.error(error));
});

