"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_1 = require("../libs/verifyToken");
const router = (0, express_1.Router)();
const cash_register_controller_1 = require("../controllers/cash_register.controller");
router.post('/', verifyToken_1.tokenValidation, cash_register_controller_1.createCashRegister);
router.get('/', verifyToken_1.tokenValidation, cash_register_controller_1.getCashRegisters);
router.get('/:id', verifyToken_1.tokenValidation, cash_register_controller_1.identifyById);
router.patch('/is_any_open', verifyToken_1.tokenValidation, cash_register_controller_1.isAnyCashRegisterOpen);
router.patch('/close', verifyToken_1.tokenValidation, cash_register_controller_1.closeCashRegister);
router.patch('/substract', verifyToken_1.tokenValidation, cash_register_controller_1.substractCash);
exports.default = router;
//# sourceMappingURL=cash_register.js.map