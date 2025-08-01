const pool = require('../database');

const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'drwpai0vu',
    api_key: '942431336444345',
    api_secret: '2F20lvuOg14-P-2zBCqBZsY8S20'
});

const fs = require('fs-extra');

module.exports = {

    getAllProducts: async (req, res) => {
        try {
            let products, offer;
    
            if (req.user.ROL_ID === 1) {
                // Admin: obtiene todos los productos
                products = await pool.query(`
                    SELECT * FROM PRODUCTO 
                    INNER JOIN CATEGORIA ON CATEGORIA.CATEGORIA_ID = PRODUCTO.CATEGORIA_ID 
                    INNER JOIN PRESENTACION ON PRESENTACION.PRESENTACION_ID = PRODUCTO.PRESENTACION_ID 
                    INNER JOIN MEDIDA ON MEDIDA.MEDIDA_ID = PRODUCTO.MEDIDA_ID 
                    WHERE PRODUCTO.PRODUCTO_ID NOT IN (SELECT OFERTA.PRODUCTO_ID FROM OFERTA)
                `);
    
                offer = await pool.query(`
                    SELECT DISTINCT P.*, C.*, PR.*, M.*, O.OFERTA_DESCRIPCION
                    FROM PRODUCTO P
                    INNER JOIN CATEGORIA C ON C.CATEGORIA_ID = P.CATEGORIA_ID
                    INNER JOIN PRESENTACION PR ON PR.PRESENTACION_ID = P.PRESENTACION_ID
                    INNER JOIN MEDIDA M ON M.MEDIDA_ID = P.MEDIDA_ID
                    INNER JOIN OFERTA O ON O.PRODUCTO_ID = P.PRODUCTO_ID
                `);
    
            } else {
                // Usuario normal: solo sus productos
                products = await pool.query(`
                    SELECT * FROM PRODUCTO 
                    INNER JOIN CATEGORIA ON CATEGORIA.CATEGORIA_ID = PRODUCTO.CATEGORIA_ID 
                    INNER JOIN PRESENTACION ON PRESENTACION.PRESENTACION_ID = PRODUCTO.PRESENTACION_ID 
                    INNER JOIN MEDIDA ON MEDIDA.MEDIDA_ID = PRODUCTO.MEDIDA_ID 
                    WHERE PRODUCTO.PERSONA_ID = ? AND PRODUCTO.PRODUCTO_ID NOT IN (SELECT OFERTA.PRODUCTO_ID FROM OFERTA)
                `, [req.user.PERSONA_ID]);
    
                offer = await pool.query(`
                    SELECT DISTINCT P.*, C.*, PR.*, M.*, O.OFERTA_DESCRIPCION
                    FROM PRODUCTO P
                    INNER JOIN CATEGORIA C ON C.CATEGORIA_ID = P.CATEGORIA_ID
                    INNER JOIN PRESENTACION PR ON PR.PRESENTACION_ID = P.PRESENTACION_ID
                    INNER JOIN MEDIDA M ON M.MEDIDA_ID = P.MEDIDA_ID
                    INNER JOIN OFERTA O ON O.PRODUCTO_ID = P.PRODUCTO_ID
                    WHERE P.PERSONA_ID = ?
                `, [req.user.PERSONA_ID]);
            }
    
            let profile = null;
            if (req.user) {
                const people = await pool.query('SELECT * FROM PERSONA, DIRECCION WHERE DIRECCION.DIRECCION_ID = PERSONA.DIRECCION_ID AND PERSONA_ID = ?', [req.user.PERSONA_ID]);
                profile = people[0];
            }
    
            res.render('products/list', { products, offer, profile });
    
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    },
    
    

    createProductPage: async (req, res) => {
        const category = await pool.query('SELECT * FROM CATEGORIA');
        const presentation = await pool.query('SELECT * FROM PRESENTACION');
        const measure = await pool.query('SELECT * FROM MEDIDA');

        res.render('products/add', { category, presentation, measure });
    },

    createProductPost: async (req, res) => {
        console.log(req.body);

        const { CATEGORIA_ID, PRESENTACION_ID, MEDIDA_ID, PRODUCTO_NOMBRE, PRODUCTO_DESCRIPCION, OFERTA_DESCRIPCION, PRODUCTO_CANTIDAD, PRODUCTO_PRECIO, PRODUCTO_MEDIDA, PRODUCTO_FECHAPUBLICACION, PRODUCTO_FECHALIMITE, PRODUCTO_FECHACOCECHA, PRODUCTO_ESTADO, PRODUCTO_IMAGEN, PRODUCTO_URL } = req.body;

        const newProduct = {
            PERSONA_ID: req.user.PERSONA_ID,
            CATEGORIA_ID,
            PRESENTACION_ID,
            MEDIDA_ID,
            PRODUCTO_NOMBRE,
            PRODUCTO_DESCRIPCION,
            PRODUCTO_CANTIDAD,
            PRODUCTO_PRECIO,
            PRODUCTO_MEDIDA,
            PRODUCTO_FECHAPUBLICACION: new Date(),
            PRODUCTO_FECHALIMITE,
            PRODUCTO_FECHACOCECHA,
            PRODUCTO_ESTADO,
            PRODUCTO_IMAGEN,
            PRODUCTO_URL
        };

        newProduct.PRODUCTO_ESTADO = 'Verdadero';

        try {
            if (req.file.path) {
                const cloudImage = await cloudinary.uploader.upload(req.file.path); //Permite guardar las imagenes en cloudinary
                newProduct.PRODUCTO_IMAGEN = cloudImage.public_id;
                newProduct.PRODUCTO_URL = cloudImage.secure_url;
                await fs.unlink(req.file.path); //Elimina las imagenes, para que no guarden de manera local
            }
        } catch {
            const cloudImage = [];
            cloudImage.public_id = 'product_iqxawz.jpg';
            cloudImage.secure_url = 'https://res.cloudinary.com/drwpai0vu/image/upload/v1617070591/product_iqxawz.jpg';
            newProduct.PRODUCTO_IMAGEN = cloudImage.public_id;
            newProduct.PRODUCTO_URL = cloudImage.secure_url;
        }

        console.log(newProduct);//Muestra datos del formulario        

        await pool.query('INSERT INTO PRODUCTO set ?', [newProduct]);//await le dice a la funcion que esta peticion va a tomar su tiempo
        console.log(req.user.PERSONA_ID)

        if (OFERTA_DESCRIPCION) {
            // Obtener el último producto agregado por el usuario
            const row = await pool.query(
                'SELECT MAX(PRODUCTO_ID) AS ID FROM PRODUCTO WHERE PERSONA_ID = ?', 
                [req.user.PERSONA_ID]
            );
        
            if (row.length > 0 && row[0].ID) {
                const lastProduct = row[0].ID;
        
                // Verificar si ya existe una oferta para este producto
                const ofertaExistente = await pool.query('SELECT * FROM OFERTA WHERE PRODUCTO_ID = ?', [lastProduct]);
        
                if (ofertaExistente.length === 0) {
                    // Si no hay oferta, insertarla
                    const newOfert = {
                        PRODUCTO_ID: lastProduct,
                        OFERTA_DESCRIPCION
                    };
                    await pool.query('INSERT INTO OFERTA SET ?', [newOfert]);
                } else {
                    // Si ya existe una oferta, actualizarla
                    await pool.query('UPDATE OFERTA SET OFERTA_DESCRIPCION = ? WHERE PRODUCTO_ID = ?', [OFERTA_DESCRIPCION, lastProduct]);
                }
            } else {
                console.log('No se encontró un producto válido para agregar la oferta.');
            }
        }
        

        req.flash('success', 'Producto Agregado');//Almacenamos el mensaje en success
        res.redirect('/products');//redirecciona a la ruta products
    },

    deleteProduct: async (req, res) => {
        const { producto_id } = req.params;
        const rows = await pool.query('SELECT * FROM PRODUCTO WHERE PRODUCTO_ID = ?', [producto_id]);
        const products = rows[0];
        if (products.PRODUCTO_IMAGEN !== 'product_iqxawz.jpg') {
            await cloudinary.uploader.destroy(products.PRODUCTO_IMAGEN); //Eliminamos la imagen
        }
        await pool.query('DELETE FROM OFERTA WHERE PRODUCTO_ID = ?', [producto_id]);
        await pool.query('DELETE FROM PRODUCTO WHERE PRODUCTO_ID = ?', [producto_id]);
        req.flash('success', 'Producto Eliminado');
        res.redirect('/products');//redireccionamos a la misma lista products
    },

    deleteOffert: async (req, res) => {
        const { producto_id } = req.params;
        console.log('ID producto oferta: ' + producto_id);
        await pool.query('DELETE FROM OFERTA WHERE PRODUCTO_ID = ?', [producto_id]);
        req.flash('success', 'Producto En Oferta Eliminado');
        res.redirect('/products');//redireccionamos a la misma lista products
    },

    editProductPage: async (req, res) => {
        const { producto_id } = req.params;

        const productsId = await pool.query('SELECT * FROM PRODUCTO WHERE PRODUCTO.PRODUCTO_ID = ?', [producto_id]);

        const products = await pool.query('SELECT * FROM PRODUCTO LEFT JOIN CATEGORIA ON PRODUCTO.CATEGORIA_ID = CATEGORIA.CATEGORIA_ID LEFT JOIN MEDIDA ON PRODUCTO.MEDIDA_ID = MEDIDA.MEDIDA_ID LEFT JOIN PRESENTACION ON PRODUCTO.PRESENTACION_ID = PRESENTACION.PRESENTACION_ID LEFT JOIN OFERTA ON PRODUCTO.PRODUCTO_ID = OFERTA.PRODUCTO_ID WHERE PRODUCTO.PRODUCTO_ID = ?', [producto_id]);

        const category = await pool.query('SELECT * FROM CATEGORIA');

        const listcategory = await pool.query('SELECT * FROM CATEGORIA WHERE CATEGORIA.CATEGORIA_ID NOT IN (SELECT CATEGORIA_ID FROM PRODUCTO WHERE PRODUCTO_ID = ?)', [producto_id]);

        const listpresentation = await pool.query('SELECT * FROM PRESENTACION WHERE PRESENTACION.PRESENTACION_ID NOT IN (SELECT PRESENTACION_ID FROM PRODUCTO WHERE PRODUCTO_ID = ?)', [producto_id]);

        const listmeasure = await pool.query('SELECT * FROM MEDIDA WHERE MEDIDA.MEDIDA_ID NOT IN (SELECT MEDIDA_ID FROM PRODUCTO WHERE PRODUCTO_ID = ?)', [producto_id]);

        res.render('products/edit', { product: products[0], productId: productsId[0], category, listcategory, listpresentation, listmeasure });
    },

    editProductPost: async (req, res) => {
        const { producto_id } = req.params;

        const rows = await pool.query('SELECT * FROM PRODUCTO WHERE PRODUCTO_ID = ?', [producto_id]);
        const products = rows[0];
        console.log(products)
        const { CATEGORIA_ID, PRESENTACION_ID, MEDIDA_ID, PRODUCTO_NOMBRE, PRODUCTO_DESCRIPCION, OFERTA_DESCRIPCION, PRODUCTO_CANTIDAD, PRODUCTO_PRECIO, PRODUCTO_MEDIDA, PRODUCTO_FECHAPUBLICACION, 
            PRODUCTO_FECHALIMITE, PRODUCTO_FECHACOCECHA, PRODUCTO_ESTADO, PRODUCTO_IMAGEN, PRODUCTO_URL } = req.body;

        const newProduct = {
            CATEGORIA_ID,
            PRESENTACION_ID,
            MEDIDA_ID,
            PRODUCTO_NOMBRE,
            PRODUCTO_DESCRIPCION,
            PRODUCTO_CANTIDAD,
            PRODUCTO_PRECIO,
            PRODUCTO_MEDIDA,
            PRODUCTO_FECHAPUBLICACION,
            PRODUCTO_FECHALIMITE,
            PRODUCTO_FECHACOCECHA,
            PRODUCTO_ESTADO,
            PRODUCTO_IMAGEN,
            PRODUCTO_URL
        };

        

        try {
            if (req.file.path) {
                console.log('Imagen actual');
                const cloudImage = await cloudinary.uploader.upload(req.file.path); //Permite guardar las imagenes en cloudinary
                newProduct.PRODUCTO_IMAGEN = cloudImage.public_id;
                newProduct.PRODUCTO_URL = cloudImage.secure_url;
                await fs.unlink(req.file.path); //Elimina las imagenes, para que no guarden de manera local
            }
        } catch {
            newProduct.PRODUCTO_IMAGEN = products.PRODUCTO_IMAGEN;
            newProduct.PRODUCTO_URL = products.PRODUCTO_URL;
        }

        newProduct.PRODUCTO_ESTADO = products.PRODUCTO_ESTADO;
        newProduct.PRODUCTO_FECHAPUBLICACION = products.PRODUCTO_FECHAPUBLICACION;
        newProduct.PRODUCTO_FECHACOCECHA = products.PRODUCTO_FECHACOCECHA
        newProduct.PRODUCTO_FECHALIMITE = products.PRODUCTO_FECHALIMITE;


        const find = await pool.query('SELECT * FROM OFERTA WHERE PRODUCTO_ID = ?', [producto_id]);

        if (OFERTA_DESCRIPCION) {
            if (find.length > 0) {
                console.log('Actualizando la oferta existente...');
                await pool.query(
                    'UPDATE OFERTA SET OFERTA_DESCRIPCION = ? WHERE PRODUCTO_ID = ?', 
                    [OFERTA_DESCRIPCION, producto_id]
                );
            } else {
                console.log('Insertando nueva oferta...');
                const newOfert = {
                    PRODUCTO_ID: producto_id,
                    OFERTA_DESCRIPCION
                };
                await pool.query('INSERT INTO OFERTA SET ?', [newOfert]);
            }
        }
        

        await pool.query('UPDATE PRODUCTO set ? WHERE PRODUCTO_ID = ?', [newProduct, producto_id]);
        req.flash('success', 'Producto Actualizado');
        res.redirect('/products');
    },
    getUserProducts: async (req, res) => {
        try {
            const userId = req.user.PERSONA_ID; // ID del usuario autenticado
    
            // Consultar productos solo del usuario logueado
            const products = await pool.query(`
                SELECT * FROM PRODUCTO
                INNER JOIN CATEGORIA ON CATEGORIA.CATEGORIA_ID = PRODUCTO.CATEGORIA_ID
                INNER JOIN PRESENTACION ON PRESENTACION.PRESENTACION_ID = PRODUCTO.PRESENTACION_ID
                INNER JOIN MEDIDA ON MEDIDA.MEDIDA_ID = PRODUCTO.MEDIDA_ID
                WHERE PRODUCTO.PERSONA_ID = ?
            `, [userId]);
    
            // Obtener ofertas asociadas
            const offer = await pool.query(`
                SELECT DISTINCT P.*, C.*, PR.*, M.*, O.OFERTA_DESCRIPCION
                FROM PRODUCTO P
                INNER JOIN CATEGORIA C ON C.CATEGORIA_ID = P.CATEGORIA_ID
                INNER JOIN PRESENTACION PR ON PR.PRESENTACION_ID = P.PRESENTACION_ID
                INNER JOIN MEDIDA M ON M.MEDIDA_ID = P.MEDIDA_ID
                INNER JOIN OFERTA O ON O.PRODUCTO_ID = P.PRODUCTO_ID
                WHERE P.PERSONA_ID = ?  -- Solo los productos del usuario logueado
            `, [userId]);
    
            // Obtener información del perfil del usuario (si está disponible)
            let profile = null;
            if (req.user) {
                const people = await pool.query('SELECT * FROM PERSONA, DIRECCION WHERE DIRECCION.DIRECCION_ID = PERSONA.DIRECCION_ID AND PERSONA_ID = ?', [req.user.PERSONA_ID]);
                profile = people[0];
            }
    
            // Renderizar la vista con los productos y ofertas del usuario
            res.render('products/list.hbs', { products, offer, profile });
        } catch (error) {
            console.error(error);
            res.status(500).send('Server Error');
        }
    },
    



    editPeoplePage: async (req, res) => {
        const people = await pool.query('SELECT * FROM PERSONA, DIRECCION WHERE DIRECCION.DIRECCION_ID = PERSONA.DIRECCION_ID AND PERSONA_ID = ?', [req.user.PERSONA_ID]);

        res.render('products/user', { profile: people[0] });
    },

    editPeoplePost: async (req, res) => {
        console.log(req.body);
        const { PERSONA_ID } = req.user;

        const rows = await pool.query('SELECT * FROM PERSONA WHERE PERSONA_ID = ?', [PERSONA_ID]);
        const profile = rows[0];

        const { DIRECCION_ID, ROL_ID, PERSONA_NOMBRE, PERSONA_TELEFONO, PERSONA_EMAIL, PERSONA_CONTRASENA, PERSONA_ESTADO, PERSONA_LOGIN, PERSONA_IMAGEN, PERSONA_URL } = req.body;

        const newUser = {
            DIRECCION_ID,
            ROL_ID,
            PERSONA_NOMBRE,
            PERSONA_TELEFONO,
            PERSONA_EMAIL,
            PERSONA_CONTRASENA,
            PERSONA_ESTADO,
            PERSONA_LOGIN,
            PERSONA_IMAGEN,
            PERSONA_URL,
        }

        console.log(newUser);

        if (DIRECCION_ID == 0) {
            newUser.DIRECCION_ID = profile.DIRECCION_ID;
        }

        newUser.ROL_ID = profile.ROL_ID;
        newUser.PERSONA_EMAIL = profile.PERSONA_EMAIL;
        newUser.PERSONA_CONTRASENA = profile.PERSONA_CONTRASENA;
        newUser.PERSONA_ESTADO = profile.PERSONA_ESTADO;
        newUser.PERSONA_LOGIN = profile.PERSONA_LOGIN;

        try {
            if (req.file.path) {
                console.log('Imagen actual');
                const cloudImage = await cloudinary.uploader.upload(req.file.path); //Permite guardar las imagenes en cloudinary
                newUser.PERSONA_IMAGEN = cloudImage.public_id;
                newUser.PERSONA_URL = cloudImage.secure_url;
                await fs.unlink(req.file.path); //Elimina las imagenes, para que no guarden de manera local
            }
        } catch {
            newUser.PERSONA_IMAGEN = profile.PERSONA_IMAGEN;
            newUser.PERSONA_URL = profile.PERSONA_URL;
        }

        console.log(newUser);
        await pool.query('UPDATE PERSONA set ? WHERE PERSONA_ID = ?', [newUser, PERSONA_ID]);
        req.flash('success', 'Usuario Modificado');
        res.redirect('/products');
    }

}