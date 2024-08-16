const express = require('express');
const router = express.Router();
const Blog =require('../models/blog');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images'); 
    },
    filename: (req, file, cb) => {
        // cspell: disable-next-line
cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });
router.get('/', (req, res) => {
    res.redirect('/blogs'); // Redirect to the list of blogs
});
router.get('/blogs', async(req,res)=>{
    try{
        const blogs = await Blog.find({});
        res.render('index',{ blogs });
    }
    catch(err){
        res.send(err);
    }
});
router.get('/blogs/new',(req,res)=>{
    res.render('new');
});
router.post('/blogs', upload.single('blog[image]'), async (req, res) => {
    try {
        const newBlog = new Blog(req.body.blog);
        if (req.file) {
            newBlog.image = req.file.filename;
        }
        await newBlog.save();
        res.redirect('/blogs');
    } catch (err) {
        res.send(err);
    }
});
router.get('/blogs/:id', async(req,res)=>{
    try{
        const blog = await Blog.findById(req.params.id);
        if (!blog)
            { return res.redirect('/blogs');
    }
    res.render('show',{blog});
}
    catch(err){
        res.send(err);
    }
});
router.get('/blogs/:id/edit', async(req,res)=>{
    try{
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.redirect('/blogs'); // Redirect if no blog found
        }
        res.render('edit', { blog });
    } 
    catch(err){
        res.send(err);
    }
});
router.put('/blogs/:id', upload.single('blog[image]'), async(req,res)=>{
    try{
        const blog = await Blog.findById(req.params.id);
        if (req.file) {
            blog.image = req.file.filename;
        }
        blog.title = req.body.blog.title;
        blog.body = req.body.blog.body;
        await blog.save();
        res.redirect(`/blogs/${req.params.id}`);
    }
    catch(err){
        res.send(err);
    }
});
router.delete('/blogs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Blog.findByIdAndDelete(id);
        res.redirect('/blogs');
    } catch (err) {
        console.log(err);
        res.redirect('/blogs');
    }
});

module.exports = router;



