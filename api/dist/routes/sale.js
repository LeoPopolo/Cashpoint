"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_1 = require("../libs/verifyToken");
const router = (0, express_1.Router)();
const sale_controller_1 = require("../controllers/sale.controller");
router.post('/', verifyToken_1.tokenValidation, sale_controller_1.createSale);
router.get('/', verifyToken_1.tokenValidation, sale_controller_1.getSales);
router.get('/:id', verifyToken_1.tokenValidation, sale_controller_1.identifyById);
exports.default = router;
//# sourceMappingURL=sale.js.map