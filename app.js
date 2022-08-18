const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const port = 3000;

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model("Article", articleSchema);

app.get('/articles', (req, res) => {
    Article.find((err, foundArticle) => {
        if (!err) {
            res.send(foundArticle);
        } else {
            res.send(err);
        }
    });
});

app.post('/articles', (req, res) => {
    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save((err) => {
        if (!err) {
            res.send("Successfully added");
        } else {
            res.send(err);
        }
    });
});

app.delete('/articles', (req, res) => {
    Article.deleteMany((err) => {
        if (!err) {
            res.send("Successfully deleted");
        } else {
            res.send(err);
        }
    })
})

app.listen(port, () => {
    console.log(`Server started on por ${port}`);

});