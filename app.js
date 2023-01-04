const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const Port = 8000;
const app = express();

mongoose.connect("mongodb://localhost:27017/wikiDB");
mongoose.set("strictQuery", true);
const wikiSchema = new Schema({ title: String, content: String });
const Article = mongoose.model("Article", wikiSchema);

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// get,DELETE,POST all Articles
app.route('/articles')
    .get( (req, res) => {
  Article.find({}, (err, data) => {
    if (!err) {
      res.send(data);
    } else {
      res.send(err);
    }
  });
})
    .post( (req, res) => {
  const formTitle = req.body.title;
  const formContent = req.body.content;
  console.log(formTitle, formContent);
  const item = new Article({
    title: formTitle,
    content: formContent,
  });
  item.save((err) => {
    if (err) {
      res.send(err);
    } else {
      res.send("successful post");
    }
  });
})
    .delete( (req,res)=> {
    item.deleteMany({}, (err)=> {
        if(err){
            res.send(err)
        }else{
            res.send('deleted successfully')
        }
    })
});

// get,DELETE,POST a certain Article
app.route('/articles/:articleTitle')
.get((req,res)=> {
    Article.findOne({title: req.params.articleTitle}, (err,data)=> {
        if(data){
            res.send(data)
        }else{
           console.log(err);
        }
    })
})
.put((req,res)=> {
  Article.update(
    {title: req.params.articleTitle},
    {title: req.body.title, content:req.body.content},
    {overwrite: true},
    (err)=> {
      if(!err){
        res.send('Updated succesfully')
      }else{
        res.send(err)
      }
    }
  )
})
.patch((req,res)=> {
  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body},
      (err)=> {
        if(!err){
          res.send("Successfully Updated article.")
        }else{
          res.send(err)
        }
      }
    )
})
.delete((req,res)=> {
  Article.deleteOne(
    {title: req.params.articleTitle},
    (err)=> {
      if(!err){
        res.send(`deleted ${title} successfully`)
      }else{
        res.send(err)
      }
    }
  )
})

app.listen(Port, () => {
  console.log(`Server running on port ${Port}`);
});
