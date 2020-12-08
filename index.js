const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 8080;
const session = require("express-session");
const connection = require("./database/database");


const categoriesController = require("./categories/CategoriesController");
const articlesController = require("./articles/ArticlesController");
const userController = require("./user/userController");

const Article = require("./articles/Articles");
const Category = require("./categories/Category");
const User = require("./user/User");

app.set('view engine', 'ejs');

app.use(session({
  secret: "chernobyl",
  cookie: {maxAge: 30000}
}))

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

connection.authenticate()
.then(() => {
  console.log("Conexão bem sucedida.")
})
.catch((err) => {
  console.log("Ocorreu um erro" + err)
});

app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", userController);

app.get("/session", (req, res) => {

});

app.get("/leitura", (req, res) => {
  
})

app.get("/", (req, res) => {
  Article.findAll({
    order:[
      ['id', 'DESC']
    ],
    limit: 2
  }).then(articles => {
    Category.findAll().then(categories => {
      res.render("index", {articles: articles, categories: categories});
    })
  })
})

app.get("/:slug", (req, res) => {
  var slug = req.params.slug;
  Article.findOne({
    where: {
      slug: slug
    }
  }).then(article => {
    if(article != undefined){
      Category.findAll().then(categories => {
        res.render("article.ejs", {article: article, categories: categories});
      })
    }else{
      res.redirect("/");
    }
  }).catch(err => {
    res.redirect("/");
  })
})

app.get("/category/:slug", (req, res) => {
  var slug = req.params.slug;
  Category.findOne({
    where: {
      slug: slug
    },
    include: [{model: Article}]
  }).then( category => {
    if(category != undefined){
      Category.findAll().then(categories => {
        res.render("index", {articles: category.articles, categories: categories});
      })
    }else{
      res.redirect("/");
    }
  }).catch(err => {
    res.redirect("/");
  })
})


app.listen(port, () => {
  console.log("Servidor online na porta " + port);
})