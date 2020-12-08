const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Articles");
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth");

router.get("/admin/articles", adminAuth, (req, res) => {
  Article.findAll({
    include: [{model: Category}]
  }).then(articles => {
    res.render("admin/articles/index", {articles: articles});
  })
});

router.get("/admin/articles/new", adminAuth, (req, res) => {
  Category.findAll().then(categories => {
    res.render("admin/articles/new", {categories: categories});
  })
})

router.post("/admin/articles/save", adminAuth, (req, res) => {
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

router.post("/articles/delete", adminAuth, (req, res) => {
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

router.get("/admin/articles/edit/:id", adminAuth, (req, res) => {
  var id = req.params.id;

  if(isNaN(id)){
    res.redirect("/admin/articles");
  }

  Article.findByPk(id, {
    include: [{model: Category}]
  }).then(article => {
    if(article != undefined){
      Category.findAll().then(categories => {
        res.render("./admin/articles/edit", {article: article, categories: categories})
      })
    }else{
      res.redirect("/admin/articles");
    }

  }).catch(err => {
    res.redirect("/admin/articles");
  })
})

router.post("/admin/articles/update", adminAuth, (req, res) => {
  var id = req.body.id;
  var title = req.body.title;
  var body = req.body.body;
  var categoryId = req.body.categoryId;

  Article.update({title: title, slug: slugify(title), body: body, categoryId: categoryId},
  {where: {id:id}})
  .then(() => {
    res.redirect("/admin/articles");
  })
})

router.get("/articles/page/:num", (req, res) => {
  var page = req.params.num;
  var offset = 0;

  if(isNaN(page) || page == 1){
    offset = 0;
  }else{
    offset = (parseInt(page) -1) * 2;
  }

  Article.findAndCountAll({
    limit: 2,
    offset: offset,
    order:[
      ['id', 'DESC']
    ]
  }).then((articles => {

    var next;
    if(offset + 2 >= articles.count){
      next = false;
    }else{
      next = true;
    }

    var result = {
      page: parseInt(page),
      next: next,
      articles : articles
    }

    Category.findAll().then(categories => {
      res.render("admin/articles/page", {result: result, categories: categories})
    });

    
  }))
})

module.exports = router;

