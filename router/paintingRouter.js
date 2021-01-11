const express = require('express');
const router = express.Router();
const Painting = require('../models/painting');
const wrapAsync = require('../utily/wrapAsync');
const { isLoggedIn, validatePainting, isAuthor } = require('../utily/middleware')
const multer = require('multer')
const { storage, cloudinary } = require('../cloudinary/index')
const upload = multer({ storage })

const itemsPerPage = 12;

router.get('/', wrapAsync(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const paintings = await Painting.find().skip((page - 1) * itemsPerPage).limit(itemsPerPage).populate('author')
    const totalPaintings = await Painting.countDocuments({})
    console.log(paintings)
    res.render('painting/index', {
        currentPage: page,
        paintings,
        totalPaintings,
        nextPage: page + 1,
        previousPage: page - 1,
        hasNextPage: itemsPerPage * page < totalPaintings,
        hasPreviousPage: page > 1,
        lastPage: Math.ceil(totalPaintings / itemsPerPage)
    })
}))

router.get('/new', isLoggedIn, (req, res) => {
    res.render('painting/new')
})

router.post('/', isLoggedIn, upload.array('Image'), validatePainting, wrapAsync(async (req, res) => {
    const p = req.body;
    const painting = new Painting(p)
    painting.author = req.user;
    painting.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    await painting.save()
    req.flash('success', 'Successfully create new Canvas')
    res.redirect('/painting')
}))

router.get('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const painting = await Painting.findById(id)
        .populate({
            path: 'reviews',
            populate: { path: 'author' }
        }).populate('author')

    if (!painting) {
        req.flahs('error', 'error!! can not find path')
        return res.redirect('/painting')
    }
    res.render('painting/show', { painting })
}))

router.get('/:id/edit', isAuthor, isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const painting = await Painting.findById(id)
    if (!painting) {
        req.flahs('error', 'error!! can not find path')
        res.redirect('/painting')
    }
    res.render('painting/edit', { painting })
}))

router.patch('/:id', isAuthor, isLoggedIn, upload.array('images'), validatePainting, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const p = req.body;
    console.log(p)
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }))
    const painting = await Painting.findByIdAndUpdate(id, p)
    painting.images.unshift(...imgs)
    await painting.save()
    if (req.body.deleteImage) {
        for (let fName of req.body.deleteImage) {
            await cloudinary.uploader.destroy(fName)
        }
        await painting.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImage } } } })
    }
    req.flash('success', 'Successfully edit Canvas')
    res.redirect(`/painting/${id}`)
}))


router.delete('/:id', isAuthor, isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Painting.findByIdAndDelete(id)
    req.flash('success', 'Successfully delete Canvas')
    res.redirect('/painting')
}))

module.exports = router;