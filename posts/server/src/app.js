const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Post = require("../models/post");


const app= express();
app.use(morgan('combinded'));
app.use(bodyParser.json());
app.use(cors());

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
mongoose.connect('mongodb://localhost:27017/posts', { useMongoClient: true});

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connetion error"));
db.once("open", function(callback){
    console.log("Connection Succeeded")
});


app.listen(process.env.PORT || 8081);
