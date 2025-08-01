const pool = require('../database');
var PDFDocument = require('pdfkit');

module.exports = {

    getAllBuy: async (req, res) => {
        const userId = req.user.PERSONA_ID;
        const detail = await pool.query('SELECT * FROM VENTA WHERE PERSONA_ID = ?', [userId]);
        res.render('detail/buy', { detail });
    },

    getDetailBuy: async (req, res) => {
        const { VENTA_ID } = req.params;
        console.log(`Executing query for VENTA_ID: ${VENTA_ID}`);

        const detailBuy = await pool.query(`
            SELECT * FROM DETALLE_VENTA 
            LEFT JOIN VENTA ON DETALLE_VENTA.VENTA_ID = VENTA.VENTA_ID 
            LEFT JOIN PRODUCTO ON DETALLE_VENTA.PRODUCTO_ID = PRODUCTO.PRODUCTO_ID 
            LEFT JOIN PERSONA ON DETALLE_VENTA.DETALLE_PRODUCTOR = PERSONA.PERSONA_ID 
            LEFT JOIN DIRECCION ON DETALLE_VENTA.DETALLE_DIRECCION = DIRECCION.DIRECCION_ID 
            WHERE DETALLE_VENTA.VENTA_ID = ?
        `, [VENTA_ID]);

        console.log('detailBuy:', detailBuy);
        const detailTotal = detailBuy[0];

        if (!detailTotal) {
            console.log(`No data found for VENTA_ID: ${VENTA_ID}`);
            return res.status(404).send('No purchase details found');
        }

        const pago = await pool.query(`
            SELECT * FROM VENTA, TIPO_PAGO 
            WHERE VENTA.PAGO_ID = TIPO_PAGO.PAGO_ID 
            AND VENTA.VENTA_ID = ?
        `, [VENTA_ID]);
        const detailPay = pago[0];

        console.log('detailPay:', detailPay);

        const { PERSONA_ID } = req.user;
        const rows = await pool.query(`
            SELECT * FROM PERSONA, DIRECCION 
            WHERE PERSONA.DIRECCION_ID = DIRECCION.DIRECCION_ID 
            AND PERSONA.PERSONA_ID = ?
        `, [PERSONA_ID]);
        const profile = rows[0];

        console.log('profile:', profile);

        if (!profile || !detailPay) {
            console.log('Missing necessary data for PDF generation.');
            return res.status(400).send('Incomplete data for generating the invoice');
        }

        const doc = new PDFDocument();

        var filename = encodeURIComponent(Math.random()) + '.pdf';
        res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
        res.setHeader('Content-type', 'application/pdf');

        // Header con leyenda
        doc
            .fillColor("#444444")
            .fontSize(20)
            .text("CyC Comercializacion", 50, 57);

        doc
            .fillColor("#FF0000")
            .fontSize(12)
            .font("Helvetica-Bold")
            .text("NOTA DE VENTA SIN VALOR TRIBUTARIO", 300, 30, { align: "right" });

        doc
            .fillColor("#444444")
            .fontSize(10)
            .font("Helvetica-Bold")
            .text("Fecha de compra:", 400, 65)
            .font("Helvetica")
            .text(detailTotal.VENTA_FECHA, 500, 65, { align: "right" })
            .text("Cotopaxi", 500, 80, { align: "right" })
            .moveDown();

        // Datos personales
        doc
            .fillColor("#444444")
            .fontSize(15)
            .text("Datos Personales", 50, 160);

        doc.strokeColor("#aaaaaa")
            .lineWidth(1)
            .moveTo(50, 190)
            .lineTo(550, 190)
            .stroke();

        const customerInformationTop = 200;

        doc
            .fontSize(10)
            .font("Helvetica-Bold")
            .text("Nombre:", 50, customerInformationTop)
            .font("Helvetica")
            .text(profile.PERSONA_NOMBRE, 125, customerInformationTop)

            .fontSize(10)
            .font("Helvetica-Bold")
            .text("Telefono:", 50, customerInformationTop + 15)
            .font("Helvetica")
            .text(profile.PERSONA_TELEFONO, 125, customerInformationTop + 15)

            .fontSize(10)
            .font("Helvetica-Bold")
            .text("Dirección:", 50, customerInformationTop + 30)
            .font("Helvetica")
            .text(profile.PARROQUIA, 125, customerInformationTop + 30)
            .moveDown();

        doc.strokeColor("#aaaaaa")
            .lineWidth(1)
            .moveTo(50, 250)
            .lineTo(550, 250)
            .stroke();

        // Detalle compra
        doc
            .fillColor("#444444")
            .fontSize(15)
            .text("Detalle Compra", 50, 300);

        // Head Table
        let invoiceTableHead = 330;

        doc.strokeColor("#aaaaaa")
            .lineWidth(1)
            .moveTo(50, invoiceTableHead + 10)
            .lineTo(550, invoiceTableHead + 10)
            .stroke();

        doc
            .fontSize(10)
            .font("Helvetica-Bold")
            .text("Producto", 50, invoiceTableHead + 20)
            .text("Cantidad", 125, invoiceTableHead + 20)
            .text("Precio", 175, invoiceTableHead + 20)
            .text("Total", 225, invoiceTableHead + 20)
            .text("Productor", 275, invoiceTableHead + 20)
            .text("Telefono", 375, invoiceTableHead + 20)
            .text("Direccion", 440, invoiceTableHead + 20);

        doc.strokeColor("#aaaaaa")
            .lineWidth(1)
            .moveTo(50, invoiceTableHead + 35)
            .lineTo(550, invoiceTableHead + 35)
            .stroke();

        // Table Body
        let invoiceTableBody = 380;

        for (const i of detailBuy) {
            doc
                .fontSize(10)
                .font("Helvetica")
                .text(i.DETALLE_NOMBREPRODUCTO, 50, invoiceTableBody)
                .text(i.DETALLE_CANTIDAD, 125, invoiceTableBody)
                .text(i.DETALLE_PRECIOUNITARIO, 175, invoiceTableBody)
                .text(i.DETALLE_PRECIOTOTAL, 225, invoiceTableBody)
                .text(i.PERSONA_NOMBRE, 275, invoiceTableBody)
                .text(i.PERSONA_TELEFONO, 375, invoiceTableBody)
                .text(i.PARROQUIA, 440, invoiceTableBody);

            doc.strokeColor("#aaaaaa")
                .lineWidth(1)
                .moveTo(50, invoiceTableBody + 15)
                .lineTo(550, invoiceTableBody + 15)
                .stroke();

            invoiceTableBody += 25;
            console.log('position body: ' + invoiceTableBody);
        }

        // Total y tipo de pago
        doc
            .fontSize(10)
            .font("Helvetica-Bold")
            .text("Total:", 160, invoiceTableBody)
            .font("Helvetica")
            .text(detailTotal.VENTA_TOTAL, 225, invoiceTableBody)
            .font("Helvetica-Bold")
            .text("Tipo de pago:", 160, invoiceTableBody + 20)
            .font("Helvetica")
            .text(detailPay.PAGO_NOMBRE, 225, invoiceTableBody + 20);

        doc.pipe(res);
        doc.end();
    },

    getAllSell: async (req, res) => {
        const userId = req.user.PERSONA_ID;
        const detail = await pool.query(`
            SELECT * FROM PERSONA, DETALLE_VENTA, VENTA, PRODUCTO, TIPO_PAGO 
            WHERE VENTA.PERSONA_ID = PERSONA.PERSONA_ID 
            AND VENTA.VENTA_ID = DETALLE_VENTA.VENTA_ID 
            AND DETALLE_VENTA.PRODUCTO_ID = PRODUCTO.PRODUCTO_ID 
            AND VENTA.PAGO_ID = TIPO_PAGO.PAGO_ID 
            AND DETALLE_VENTA.DETALLE_PRODUCTOR = ?
        `, [userId]);
        res.render('detail/sell', { detail });
    }

};
