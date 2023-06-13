const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 2121
require('dotenv').config()


let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'blog-api-db'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })
    
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.get('/',async (request, response)=>{
    const getPosts = await db.collection('posts').find().toArray()
    response.render('index.ejs', { items: getPosts })
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addPost', (request, response) => {
    db.collection('posts').insertOne({title: request.body.title, completed: true}, {content: request.body.content, completed: true})
    .then(result => {
        console.log('Post Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

app.put('/updatePost', (request, response) => {
    db.collection('posts').updateOne({itemToUpdate: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Update Complete')
        response.json('Update Complete')
    })
    .catch(error => console.error(error))

})

app.delete('/deletePost', (request, response) => {
    db.collection('posts').deleteOne({itemToDelete: request.body.itemFromJS})
    .then(result => {
        console.log('Post Deleted')
        response.json('Post Deleted')
    })
    .catch(error => console.error(error))

})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})