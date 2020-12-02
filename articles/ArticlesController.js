const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Articles");
const slugify = require("slugify");

router.get("/admin/articles", (req, res) => {
  Article.findAll({
    include: [{model: Category}]
  }).then(articles => {
    res.render("admin/articles/index", {articles: articles});
  })
});

router.get("/admin/articles/new", (req, res) => {
  Category.findAll().then(categories => {
    res.render("admin/articles/new", {categories: categories});
  })
})

router.post("/admin/articles/save", (req, res) => {
  var title = req.body.title;
  var body = req.body.body;
  var categoryId = req.body.categoryId;

  Article.create({
    title: title,
    slug: slugify(title),
    body: body,
    categoryId: categoryId
  })
  .then(() => {
    res.redirect("/admin/articles");
  })
})

router.post("/articles/delete", (req, res) => {
  var id = req.body.id;
  if(id != undefined){
    if(!isNaN(id)){
      
      Article.destroy({
        where: {id: id}
      })
      .then(() => {
        res.redirect("/admin/articles");
      });

    }else{
      res.redirect("/admin/articles");
    }
  }else{
    res.redirect("/admin/articles");
  }
});

router.get("/admin/articles/edit/:id", (req, res) => {
  var id = req.params.id;

  if(isNaN(id)){
    res.redirect("/admin/articles");
  }

  Article.findByPk(id).then(article => {
    if(article != undefined){
      Category.findAll().then(categories => {
        res.render("./admin/articles/edit", {article: article, categories: categories})
      })
    }else{
      res.redirect("/admin/articles");
    }

  })
})

module.exports = router;

