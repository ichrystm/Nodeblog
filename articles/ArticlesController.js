const express = require("express");
const router = express.Router();

router.get("/admin/articles", (req, res) => {
  res.send("rota de artigos");
});

router.get("/admin/articles/new", (req, res) => {
  res.render("admin/articles/new");
})

module.exports = router;

