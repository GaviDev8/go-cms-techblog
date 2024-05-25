const router = require('express').Router();
const blogRoute = require('./blogRoute');
const commentRoute = require('./commentRoute');
const userRoute = require('./userRoute')

router.use('/blog', blogRoute);
router.use('/comment', commentRoute);
router.use('/user', userRoute);

module.exports = router;