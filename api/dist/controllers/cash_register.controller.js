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
exports.isAnyCashRegisterOpen = exports.closeCashRegister = exports.substractCash = exports.identifyById = exports.getCashRegisters = exports.createCashRegister = void 0;
const cash_register_1 = require("../models/cash_register");
const database_1 = __importDefault(require("../database"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function createCashRegister(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const cash_register = new cash_register_1.CashRegister(req.body.initial_cash);
        yield database_1.default.query(`SELECT create_cash_register(${cash_register.initial_cash})`)
            .then(() => {
            res.status(200).json({
                status: 'OK',
                message: 'Cash register opened'
            });
        })
            .catch(err => {
            console.log(err);
            return res.status(400).send(err);
        });
    });
}
exports.createCashRegister = createCashRegister;
;
function getCashRegisters(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const page = req.query.page;
        let dateFrom = req.query.date_from ? req.query.date_from : null;
        let dateTo = req.query.date_to ? req.query.date_to : null;
        if (dateFrom && dateFrom !== 'null') {
            dateFrom = "'" + dateFrom + "'";
        }
        if (dateTo && dateTo !== 'null') {
            dateTo = "'" + dateTo + "'";
        }
        yield database_1.default.query(`SELECT search_cash_registers(${page}, ${dateFrom}, ${dateTo})`)
            .then(response => {
            const data = JSON.parse(response.rows[0].search_cash_registers);
            if (!data.cash_registers) {
                data.cash_registers = [];
            }
            res.status(200).json({
                data: data
            });
        })
            .catch(err => {
            console.log(err);
            return res.status(400).send(err);
        });
    });
}
exports.getCashRegisters = getCashRegisters;
function identifyById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield database_1.default.query(`SELECT cash_register_identify_by_id(${req.params.id})`)
            .then(response => {
            const data = JSON.parse(response.rows[0].cash_register_identify_by_id);
            const parsedData = data ? data : 'Cash register not found';
            res.status(200).json({
                data: parsedData
            });
        })
            .catch(err => {
            console.log(err);
            return res.status(400).send(err);
        });
    });
}
exports.identifyById = identifyById;
function substractCash(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield database_1.default.query(`SELECT cash_register_substract_cash(${req.body.amount}, '${req.body.description}', ${req.body.user_owner_id})`)
            .then(() => {
            res.status(200).json({
                status: 'OK',
                message: 'Operation completed'
            });
        })
            .catch(err => {
            console.log(err);
            return res.status(400).send(err);
        });
    });
}
exports.substractCash = substractCash;
function closeCashRegister(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield database_1.default.query(`SELECT cash_register_close()`)
            .then(() => {
            res.status(200).json({
                status: 'OK',
                message: 'Operation completed'
            });
        })
            .catch(err => {
            console.log(err);
            return res.status(400).send(err);
        });
    });
}
exports.closeCashRegister = closeCashRegister;
function isAnyCashRegisterOpen(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield database_1.default.query(`SELECT is_any_cash_register_open()`)
            .then(response => {
            const data = response.rows[0].is_any_cash_register_open;
            res.status(200).json({
                data: data
            });
        })
            .catch(err => {
            console.log(err);
            return res.status(400).send(err);
        });
    });
}
exports.isAnyCashRegisterOpen = isAnyCashRegisterOpen;
//# sourceMappingURL=cash_register.controller.js.map