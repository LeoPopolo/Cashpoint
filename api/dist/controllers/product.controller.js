"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setBarcode = exports.setPrice = exports.setStock = exports.setDescription = exports.setName = exports.reactivateProduct = exports.deleteProduct = exports.identifyById = exports.getProducts = exports.createProduct = void 0;
const product_1 = require("../models/product");
const database_1 = __importDefault(require("../database"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function createProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const product = new product_1.Product(req.body.name, req.body.description, req.body.price, req.body.stock, req.body.barcode);
        yield database_1.default.query(`INSERT INTO product (name,description,price,stock,barcode,deleted) VALUES (${product.toString()}) RETURNING id`)
            .catch(err => {
            console.log(err);
            return res.status(400).send(err);
        })
            .then((response) => __awaiter(this, void 0, void 0, function* () {
            product.id = response.rows[0].id;
            res.status(200).json({
                status: 'OK',
                data: product
            });
        }));
    });
}
exports.createProduct = createProduct;
;
function getProducts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield database_1.default.query(`SELECT id, name, description, price, stock, barcode
                        FROM product
                        WHERE deleted = FALSE
                        ORDER BY id ASC`)
            .catch(err => {
            return res.status(400).send(err);
        })
            .then(resp => {
            if (resp.rows.length === 0) {
                return res.status(404).json({
                    error: 'No data found'
                });
            }
            else {
                const productsArray = resp.rows;
                res.status(200).json({
                    status: 'OK',
                    data: productsArray
                });
            }
        });
    });
}
exports.getProducts = getProducts;
function identifyById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield database_1.default.query(`SELECT id, name, description, price, stock, barcode
                        FROM product
                        WHERE deleted = FALSE AND id = ${req.params.id}`)
            .catch(err => {
            return res.status(400).send(err);
        })
            .then(resp => {
            if (resp.rows.length === 0) {
                return res.status(404).json({
                    error: 'No data found'
                });
            }
            else {
                const product = resp.rows[0];
                res.status(200).json({
                    status: 'OK',
                    data: product
                });
            }
        });
    });
}
exports.identifyById = identifyById;
function deleteProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield database_1.default.query(`UPDATE product
                        SET deleted = TRUE
                        WHERE id = ${req.params.id}`)
            .catch(err => {
            return res.status(400).send(err);
        })
            .then(() => {
            res.status(200).json({
                status: 'OK',
                message: 'Operation completed'
            });
        });
    });
}
exports.deleteProduct = deleteProduct;
function reactivateProduct(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield database_1.default.query(`UPDATE product
                        SET deleted = FALSE
                        WHERE id = ${req.params.id}`)
            .catch(err => {
            return res.status(400).send(err);
        })
            .then(() => {
            res.status(200).json({
                status: 'OK',
                message: 'Operation completed'
            });
        });
    });
}
exports.reactivateProduct = reactivateProduct;
function setName(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield database_1.default.query(`UPDATE product
                        SET name = '${req.body.name}'
                        WHERE id = ${req.params.id}`)
            .catch(err => {
            console.log(err);
            return res.status(400).send(err);
        })
            .then(() => {
            res.status(200).json({
                status: 'OK',
                message: 'Operation completed'
            });
        });
    });
}
exports.setName = setName;
function setDescription(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield database_1.default.query(`UPDATE product
                        SET description = '${req.body.description}'
                        WHERE id = ${req.params.id}`)
            .catch(err => {
            console.log(err);
            return res.status(400).send(err);
        })
            .then(() => {
            res.status(200).json({
                status: 'OK',
                message: 'Operation completed'
            });
        });
    });
}
exports.setDescription = setDescription;
function setStock(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield database_1.default.query(`UPDATE product
                        SET stock = ${req.body.stock}
                        WHERE id = ${req.params.id}`)
            .catch(err => {
            console.log(err);
            return res.status(400).send(err);
        })
            .then(() => {
            res.status(200).json({
                status: 'OK',
                message: 'Operation completed'
            });
        });
    });
}
exports.setStock = setStock;
function setPrice(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield database_1.default.query(`UPDATE product
                        SET price = ${req.body.price}
                        WHERE id = ${req.params.id}`)
            .catch(err => {
            console.log(err);
            return res.status(400).send(err);
        })
            .then(() => {
            res.status(200).json({
                status: 'OK',
                message: 'Operation completed'
            });
        });
    });
}
exports.setPrice = setPrice;
function setBarcode(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield database_1.default.query(`UPDATE product
                        SET barcode = ${req.body.barcode}
                        WHERE id = ${req.params.id}`)
            .catch(err => {
            console.log(err);
            return res.status(400).send(err);
        })
            .then(() => {
            res.status(200).json({
                status: 'OK',
                message: 'Operation completed'
            });
        });
    });
}
exports.setBarcode = setBarcode;
//# sourceMappingURL=product.controller.js.map