//relationships between models
const User = require('./user');
const Blog = require('./blog');
const Comment = require('./comment')

User.hasMany(Blog, {
  foreignKey: 'user_id'
});

User.hasMany(Comment, {
    foreignKey: 'user_id'
  });

Blog.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

Blog.hasMany(Comment, {
    foreignKey: 'blog_id'
  });

Comment.hasMany(User, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
  });

Comment.belongsTo(Blog, {
    foreignKey: 'blog_id',
    onDelete: 'CASCADE',
  });

module.exports = { User, Blog, Comment };