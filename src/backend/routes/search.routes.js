// routes/search.routes.js
module.exports = (app) => {
  const router = require("express").Router();

  router.get("/", (req, res) => {
    const q = req.query.q || "";
    res.render("search/search", { query: q });
  });

  app.use("/search", router);
};
