"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_1 = require("../libs/verifyToken");
const router = (0, express_1.Router)();
const customer_controller_1 = require("../controllers/customer.controller");
router.post('/', verifyToken_1.tokenValidation, customer_controller_1.createCustomer);
router.get('/', verifyToken_1.tokenValidation, customer_controller_1.getCustomers);
router.get('/:id', verifyToken_1.tokenValidation, customer_controller_1.identifyById);
router.delete('/:id', verifyToken_1.tokenValidation, customer_controller_1.deleteCustomer);
router.patch('/reactivate/:id', verifyToken_1.tokenValidation, customer_controller_1.reactivateCustomer);
router.patch('/name/:id', verifyToken_1.tokenValidation, customer_controller_1.setName);
router.patch('/identifier/:id', verifyToken_1.tokenValidation, customer_controller_1.setIdentifier);
router.patch('/phone/:id', verifyToken_1.tokenValidation, customer_controller_1.setPhoneNumber);
router.patch('/responsability/:id', verifyToken_1.tokenValidation, customer_controller_1.setIvaResponsability);
exports.default = router;
//# sourceMappingURL=customer.js.map