const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const { ObjectId } = require("mongodb");
const PORT = 8080;
require("dotenv").config();

let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = "blog-api-db";

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
  .then((client) => {
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName);
    app.listen(process.env.PORT || PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", async (request, response) => {
  try {
    const items = await db.collection("posts").find().toArray();
    response.render("index.ejs", { items: items });
  } catch (error) {
    console.error(error);
    response.status(500).send("Internal Server Error");
  }
});


app.post("/addPost", (request, response) => {
  db.collection("posts")
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

  db.collection("posts")
    .updateOne({ _id: ObjectId(postId) }, { $set: { thing: updatedContent } })
    .then(() => {
      console.log("Post updated");

      // Fetch the updated post data from the database
      db.collection("posts")
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
  db.collection("posts")
    .deleteOne({ thing: request.body.itemFromJS })
    .then((result) => {
      console.log("Post Deleted");
      response.json("Post Deleted");
    })
    .catch((error) => console.error(error));
});

