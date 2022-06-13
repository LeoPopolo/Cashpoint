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
exports.setIvaResponsability = exports.setPhoneNumber = exports.setIdentifier = exports.setName = exports.reactivateCustomer = exports.deleteCustomer = exports.identifyById = exports.getCustomers = exports.createCustomer = void 0;
const customer_1 = require("../models/customer");
const database_1 = __importDefault(require("../database"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function createCustomer(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const customer = new customer_1.Customer(req.body.name, req.body.identifier, req.body.phone_number, req.body.iva_responsability);
        yield database_1.default.query(`INSERT INTO customer (name,identifier,phone_number,iva_responsability) VALUES (${customer.toString()})`)
            .then((response) => __awaiter(this, void 0, void 0, function* () {
            customer.id = response.rows[0].id;
            res.status(200).json({
                status: 'OK',
                message: 'Operation completed'
            });
        }))
            .catch(err => {
            return res.status(400).send(err);
        });
    });
}
exports.createCustomer = createCustomer;
;
function getCustomers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield database_1.default.query(`SELECT id, name, identifier, phone_number, iva_responsability, creation_timestamp
                        FROM customer
                        WHERE deleted = FALSE`)
            .then(resp => {
            if (resp.rows.length === 0) {
                return res.status(404).json({
                    error: 'No data found'
                });
            }
            else {
                const customer = resp.rows;
                res.status(200).json({
                    status: 'OK',
                    data: customer
                });
            }
        })
            .catch(err => {
            return res.status(400).send(err);
        });
    });
}
exports.getCustomers = getCustomers;
function identifyById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield database_1.default.query(`SELECT id, name, identifier, phone_number, iva_responsability, creation_timestamp
                        FROM customer
                        WHERE id = ${req.params.id} AND deleted = FALSE`)
            .then(resp => {
            if (resp.rows.length === 0) {
                return res.status(404).json({
                    error: 'No data found'
                });
            }
            else {
                const customer = resp.rows[0];
                res.status(200).json({
                    status: 'OK',
                    data: customer
                });
            }
        })
            .catch(err => {
            return res.status(400).send(err);
        });
    });
}
exports.identifyById = identifyById;
function deleteCustomer(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield database_1.default.query(`UPDATE customer
                        SET deleted = TRUE
                        WHERE id = ${req.params.id}`)
            .then(() => {
            res.status(200).json({
                status: 'OK',
                message: 'Operation completed'
            });
        })
            .catch(err => {
            return res.status(400).send(err);
        });
    });
}
exports.deleteCustomer = deleteCustomer;
function reactivateCustomer(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield database_1.default.query(`UPDATE customer
                        SET deleted = FALSE
                        WHERE id = ${req.params.id}`)
            .then(() => {
            res.status(200).json({
                status: 'OK',
                message: 'Operation completed'
            });
        })
            .catch(err => {
            return res.status(400).send(err);
        });
    });
}
exports.reactivateCustomer = reactivateCustomer;
function setName(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield database_1.default.query(`UPDATE customer
                        SET name = '${req.body.name}'
                        WHERE id = ${req.params.id}`)
            .then(() => {
            res.status(200).json({
                status: 'OK',
                message: 'Operation completed'
            });
        })
            .catch(err => {
            return res.status(400).send(err);
        });
    });
}
exports.setName = setName;
function setIdentifier(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield database_1.default.query(`UPDATE customer
                        SET identifier = '${req.body.identifier}'
                        WHERE id = ${req.params.id}`)
            .then(() => {
            res.status(200).json({
                status: 'OK',
                message: 'Operation completed'
            });
        })
            .catch(err => {
            return res.status(400).send(err);
        });
    });
}
exports.setIdentifier = setIdentifier;
function setPhoneNumber(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield database_1.default.query(`UPDATE customer
                        SET phone_number = '${req.body.phone_number}'
                        WHERE id = ${req.params.id}`)
            .then(() => {
            res.status(200).json({
                status: 'OK',
                message: 'Operation completed'
            });
        })
            .catch(err => {
            return res.status(400).send(err);
        });
    });
}
exports.setPhoneNumber = setPhoneNumber;
function setIvaResponsability(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield database_1.default.query(`UPDATE customer
                        SET iva_responsability = '${req.body.iva_responsability}'
                        WHERE id = ${req.params.id}`)
            .then(() => {
            res.status(200).json({
                status: 'OK',
                message: 'Operation completed'
            });
        })
            .catch(err => {
            return res.status(400).send(err);
        });
    });
}
exports.setIvaResponsability = setIvaResponsability;
//# sourceMappingURL=customer.controller.js.map