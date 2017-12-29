const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const neo4j = require('neo4j-driver').v1;

var mongoose = require('mongoose');

var Post = require("../models/post");


const app= express();
console.log("Test log")
const driver = neo4j.driver('bolt://localhost', neo4j.auth.basic('neo4j', 'password'));
const session = driver.session();

const personName = 'Alice';
const resultPromise = session.run(
    'MATCH (tom:Person {name:"Tom Hanks"})-[:ACTED_IN]->(m) return m'
)

resultPromise.then(result => {
    //session.close();

    
    result.records.forEach(element => {
        const node = element.get(0);
        console.log(node.properties.id)        
    });


    //driver.close();
})
app.use(morgan('combinded'));
app.use(bodyParser.json());
app.use(cors());

app.get('/graphPosts/name/:name',(req, res) =>{
    session.run(
        'Match (p {name: "' +req.params.name + '"}) return p'
    )
    .then(result =>{
        session.close();
        result.records.forEach(element => {
            const node = element.get(0);
            console.log(node.properties.name)        
        });
        driver.close();
        res.send({
            posts: result.records[0]
        })
    }).catch(error => {
        console.log(error);
    })
})

app.get('/graphPosts',(req, res) =>{
    session.run(
        'Match (p:Post) return p'
    )
    .then(result =>{
        session.close();
        var posts = [];
        result.records.forEach(element => {
            const node = element.get(0);
            posts.push(node.properties);
            console.log(node.properties.title)        
        });
        res.send({
            posts: posts
        })
    }).catch(error => {
        console.log(error);
    })
})

 app.post('/graphPosts',(req, res) =>{
    session.run(
         'Create (a:Post {title:$title, description: $description}) return a',
         {title:  req.body.title, description: req.body.description}
     )
     .then(() =>{
        res.send({
           success: true,
           message: 'Post saved successfully!'
       })
     })
     .catch(error => {
         console.log(error);
     })
 })
 app.get('/posts', (req, res) => {
  
  Post.find({}, 'title description', function (error, posts) {
    if (error) { console.error(error); }
    res.send({
      posts: posts
    })
  }).sort({_id:-1})
})

//return a single post
app.get('/post/:id', (req, res) => {
    var db = req.db;
    Post.findById(req.params.id, 'title description', function(error, post){
        if (error) {console.error(error);}
        res.send(post);
    })
})

//update a post
app.put('/posts/:id', (req,res) => {
    var db= req.db;
    Post.findById(req.params.id, 'title description', function(error, post){
        if(error){ console.error(error);}
        
        post.title = req.body.title;
        post.description = req.body.description;
        console.log(post);
        post.save(function (error){
            if(error){
                console.error(error);
            }
            res.send({
                success: true
            })
        })
    })
})

app.post('/posts', (req, res) =>{
    var db = req.db;
    var title = req.body.title;
    var description = req.body.description;
    var new_post = new Post({
        title: title,
        description: description
    })

    new_post.save(function (error){
        if(error){
            console.log(errpr);
        }

        res.send({
            success: true,
            message: 'Post saved successfully!'
        })
    })
})

app.delete('/posts/:id', (req, res) => {
    Post.remove({
        _id: req.params.id
    }, function(err, post){
        if(err){
            res.send(err)
        }
        res.send({
            success: true
        })
    })

})
//mongoose.connect('mongodb://localhost:27017/posts', { useMongoClient: true});

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connetion error"));
db.once("open", function(callback){
    console.log("Connection Succeeded")
});


app.listen(process.env.PORT || 8081);
