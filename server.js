const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const PORT = 8080;
require("dotenv").config();

let db,
  dbConnectionStr = process.env.DB_STRING, // The dbConnectionStr is saved to the .env file. If you have a .env file, you need to npm install dotenv and require dotenv.
  dbName = "blog-api-db"; // this is the name of the database that we will be using.

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  (client) => {
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName);
  }
);
//The code above connects our server to the MongoDB database.

app.set("view engine", "ejs"); // This line tells our app to use EJS as its view engine.
app.use(express.static("public")); //This line tells our app to use the public folder for static files.
app.use(express.urlencoded({ extended: true })); // This line tells our app to use the body-parser middleware. This is how we can get the data from the text.
app.use(express.json()); //This line tells our app to use the body-parser middleware.

app.get("/", async (request, response) => {
  // const todoItems = await db.collection('todos').find().toArray()
  // const itemsLeft = await db.collection('todos').countDocuments({completed: false})
  // response.render('index.ejs', { items: todoItems, left: itemsLeft })
  db.collection("posts")
    .find()
    .toArray()
    .then((data) => {
      db.collection("posts")
          response.render("index.ejs", { items: data });
          response.redirect("/");
        })
    .catch((error) => console.error(error));
    })

app.post("/addPost", (request, response) => {
  db.collection("posts")
    .insertOne({ thing: request.body.todoItem, completed: false })
    .then((result) => {
      console.log("Post Added");
      response.redirect("/");
    })
    .catch((error) => console.error(error));
});

app.put("/updatePost", (request, response) => {
  db.collection("posts")
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        $set: {
          completed: true,
        },
      },
      {
        sort: { _id: -1 },
        upsert: false,
      }
    )
    .then((result) => {
      console.log("Post updated");
      response.json("Post updated");
    })
    .catch((error) => console.error(error));
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

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});