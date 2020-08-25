const express = require('express')
const bodyParser = require('body-parser')
const router = express.Router()
const Article = require('../models/article')

router.use(bodyParser.urlencoded({ extended: true }))

// All Articles
router.get('/', async (req, res) => {
    const articles = await Article.find().sort({ createdAt: 'desc' })
    res.render('articles/allArticles', { articles: articles })
})

// Creating New Article
router.get('/new', (req, res) => {
    res.render('articles/newArticle', { article: new Article() })
})

// Saving New Article in Database
router.post('/', async (req, res, next) => {
    req.article = new Article()
    next()
}, saveArticleAndRedirect('new'))

// Showing Article
router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug })
    if (article == null) {
        res.redirect('/articles')
    }
    res.render('articles/showArticle', { article: article })
})

// Editing Article 
router.get('/edit/:id', async (req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/editArticle', { article: article })
})

// Saving Edited Article in Database
router.put('/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
}, saveArticleAndRedirect('edit'))

// Deleting Article
router.delete('/:id', async (req, res) => {
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('/articles/')
})

function saveArticleAndRedirect(path) {
    return async (req, res) => {
        let article = req.article
        article.title = req.body.title
        article.writer = req.body.writer
        article.description = req.body.description
        article.markdown = req.body.markdown
        try {
            article = await article.save()
            res.redirect(`/articles/${article.slug}`)
        }
        catch (e) {
            console.log(e)
            res.render(`articles/${path}`, { article: article })
        }
    }
}

module.exports = router
