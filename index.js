const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const app = express();
const blogRoutes = require('./routes/blogRoutes');
mongoose.connect('mongodb://localhost:27017/blog_website');
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(blogRoutes);
app.listen(3001,() => {
console.log('Blog app is running on http://localhost:3001');
});

