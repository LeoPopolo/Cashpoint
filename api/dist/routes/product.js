"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_1 = require("../libs/verifyToken");
const router = (0, express_1.Router)();
const product_controller_1 = require("../controllers/product.controller");
router.post('/', verifyToken_1.tokenValidation, product_controller_1.createProduct);
router.get('/', verifyToken_1.tokenValidation, product_controller_1.getProducts);
router.get('/:id', verifyToken_1.tokenValidation, product_controller_1.identifyById);
router.get('/reactivate/:id', verifyToken_1.tokenValidation, product_controller_1.reactivateProduct);
router.delete('/:id', verifyToken_1.tokenValidation, product_controller_1.deleteProduct);
router.patch('/name/:id', verifyToken_1.tokenValidation, product_controller_1.setName);
router.patch('/description/:id', verifyToken_1.tokenValidation, product_controller_1.setDescription);
router.patch('/stock/:id', verifyToken_1.tokenValidation, product_controller_1.setStock);
router.patch('/price/:id', verifyToken_1.tokenValidation, product_controller_1.setPrice);
router.patch('/barcode/:id', verifyToken_1.tokenValidation, product_controller_1.setBarcode);
exports.default = router;
//# sourceMappingURL=product.js.map