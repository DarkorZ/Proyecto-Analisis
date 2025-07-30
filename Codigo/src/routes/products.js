// const express = require('express');
// const router = express.Router();

const { Router } = require('express');
const router = Router();

const { isLoggedIn } = require('../lib/auth');

const {
    getAllProducts,
    createProductPage,
    createProductPost,
    deleteProduct,
    deleteOffert,
    editProductPage,
    editProductPost,
    editPeoplePage,
    editPeoplePost,
    getUserProducts,
} = require('../controllers/products');


router.get('/add', isLoggedIn, createProductPage);
router.post('/add', isLoggedIn, createProductPost);
router.get('/', isLoggedIn, getAllProducts);
router.get('/delete/:producto_id', isLoggedIn, deleteProduct);
router.get('/deleteoffer/:producto_id', isLoggedIn, deleteOffert);
router.get('/edit/:producto_id', isLoggedIn, editProductPage);
router.post('/edit/:producto_id', isLoggedIn, editProductPost);
router.get('/my-products', isLoggedIn, getUserProducts);
router.get('/list', isLoggedIn, async (req, res) => {
    try {
        const userId = req.user.USUARIO_ID;
        const rolId = req.user.ROL_ID;

        let products = [];
        let offer = [];

        if (rolId === 1) {
            products = await getAllProducts();
            offer = await getAllOffers();
        } else if (rolId === 2) {
            products = await getUserProducts(userId);
            offer = await getUserOffers(userId);
        }

        res.render('products/list', {
            profile: req.user,
            offer: offer,
            products: products
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Hubo un problema al cargar los productos');
    }
});



// Editar Persona
router.get('/user', isLoggedIn, editPeoplePage);
router.post('/user', isLoggedIn, editPeoplePost);

module.exports = router;