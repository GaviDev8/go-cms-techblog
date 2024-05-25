// controller for the homepage 
//  API folder is for post, put, delete for each model
const router = require("express").Router();
const { User, Blog, Comment } = require("../models");
const withAuth = require("../utils/auth");

//render to homepage
router.get("/", withAuth, async (req, res) => {
  try {
    const blogData = await Blog.findAll({
      where: {
        id: req.session.userId,
      },
      order: [["date_created", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["username", "email", "password"],
        },
        {
          model: Comment,
        },
      ],
    });
// render homepage to show below blog
const blogs = blogData.map((blog) => blog.get({ plain: true }));
res.render("homepage", {
    user: req.session.username,
    blogs,
    loggedIn: req.session.loggedIn,
 });
    console.log(req.body);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

// this route is used to render the login pg and will redirect user to homepage
router.get("/login", async (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }
  res.render("login");
});
// this route is used to render the blogs
router.get("/dashboard", async (req, res) => {
  if (req.session.loggedIn) {
    res.render("dashboard", {
      user: req.session.username,
      loggedIn: req.session.loggedIn,
    });
    return;
  }
});

// this route is used to render a new blog
router.get("/newblog", async (req, res) => {
  if (req.session.loggedIn) {
    res.render("newblog", {
      user: req.session.username,
      loggedIn: req.session.loggedIn,
    });
    return;
  }
});

// this route is used to render a sign up
router.get("/signup", async (req, res) => {
  if (req.session.loggedIn) {
    res.redirect("/");
    return;
  }
  res.render("register");
});


// get by id 
router.get("/homepage/:id", async (req, res) => {
  
    try {
      const blogData = await Blog.findOne({
        where: {
          id: req.params.id,
        },
        include: [User, { model: Comment, include: [User] }],
      });

      const blogs = blogData.get({ plain: true });
      console.log(util.inspect(blogs, {showHidden: false, depth: 10, colors: true}));
      res.render("singleBlog", {
        user: req.session.username,
        blogs,
        loggedIn: req.session.loggedIn,
        isCreator: blogs.user.id === req.session.user_id
      });
    } catch (error) {
      res.status(500).json(error);
    }
  
});

module.exports = router;