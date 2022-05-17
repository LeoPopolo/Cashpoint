"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_1 = require("../libs/verifyToken");
const router = (0, express_1.Router)();
const auth_controller_1 = require("../controllers/auth.controller");
router.post('/signup', auth_controller_1.signup);
router.post('/signin', auth_controller_1.signin);
router.get('/users', verifyToken_1.tokenValidation, auth_controller_1.users);
router.get('/:id', verifyToken_1.tokenValidation, auth_controller_1.identifyById);
router.patch('/name/:id', verifyToken_1.tokenValidation, auth_controller_1.setName);
router.patch('/surname/:id', verifyToken_1.tokenValidation, auth_controller_1.setSurname);
router.patch('/email/:id', verifyToken_1.tokenValidation, auth_controller_1.setEmail);
router.patch('/role/:id', verifyToken_1.tokenValidation, auth_controller_1.setRole);
router.patch('/password/:id', verifyToken_1.tokenValidation, auth_controller_1.setPassword);
exports.default = router;
//# sourceMappingURL=auth.js.map