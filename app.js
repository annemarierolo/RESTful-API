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

app.route('/articles')
    .get((req, res) => {
        Article.find((err, foundArticle) => {
            if (!err) {
                res.send(foundArticle);
            } else {
                res.send(err);
            }
        });
    })
    .post((req, res) => {
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
    })
    .delete((req, res) => {
        Article.deleteMany((err) => {
            if (!err) {
                res.send("Successfully deleted");
            } else {
                res.send(err);
            }
        });
    });


app.route('/articles/:articleTitle')
    .get((req, res) => {
        Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
            if (foundArticle) {
                res.send(foundArticle);
            } else {
                res.send("No articles matching that title was found");
            }
        })
    })
    .put((req, res) => {
        Article.replaceOne({ title: req.params.articleTitle }, { title: req.body.title, content: req.body.content },
            (err) => {
                if (!err) {
                    res.send("Successfully updated");
                }
            }
        )
    })
    .patch((req, res) => {
        Article.updateOne({ title: req.params.articleTitle }, { $set: req.body },
            (err) => {
                if (!err) {
                    res.send("Successfully updated");
                } else {
                    res.send(err);
                }
            }

        )
    })
    .delete((req, res) => {
        Article.deleteOne({ title: req.params.articleTitle }, (err) => {
            if (!err) {
                res.send("Successfully deleted")
            } else {
                res.send(err);
            }
        })
    })


app.listen(port, () => {
    console.log(`Server started on por ${port}`);

});