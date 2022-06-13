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
exports.identifyById = exports.getSales = exports.createSale = void 0;
const sale_1 = require("../models/sale");
const database_1 = __importDefault(require("../database"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function createSale(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const sale = new sale_1.Sale(req.body.products, req.body.user_owner_id, req.body.payment_method, req.body.discount);
        yield database_1.default.query(`SELECT create_sale(${sale.toString(req.body.customer_id)})`)
            .then(response => {
            let json_response = JSON.parse(response.rows[0].create_sale);
            sale.id = json_response.id;
            sale.total = json_response.total;
            res.status(200).json({
                status: 'OK',
                data: sale.responseDto()
            });
        })
            .catch(err => {
            console.log(err);
            return res.status(400).send(err);
        });
    });
}
exports.createSale = createSale;
;
function getSales(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const page = req.query.page;
        let total = req.query.total ? req.query.total : null;
        let paymentMethod = req.query.payment_method ? req.query.payment_method : null;
        let dateFrom = req.query.date_from ? req.query.date_from : null;
        let dateTo = req.query.date_to ? req.query.date_to : null;
        if (paymentMethod && paymentMethod !== 'null') {
            paymentMethod = "'" + paymentMethod + "'";
        }
        if (dateFrom && dateFrom !== 'null') {
            dateFrom = "'" + dateFrom + "'";
        }
        if (dateTo && dateTo !== 'null') {
            dateTo = "'" + dateTo + "'";
        }
        yield database_1.default.query(`SELECT search_sales(${page}, ${total}, ${paymentMethod}, ${dateFrom}, ${dateTo})`)
            .then(response => {
            const data = JSON.parse(response.rows[0].search_sales);
            if (!data.sales) {
                data.sales = [];
            }
            res.status(200).json({
                data: data
            });
        })
            .catch(err => {
            return res.status(400).send(err);
        });
    });
}
exports.getSales = getSales;
function identifyById(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield database_1.default.query(`SELECT sale_identify_by_id(${req.params.id})`)
            .then(response => {
            const data = JSON.parse(response.rows[0].sale_identify_by_id);
            const parsedData = data ? data : 'Sale not found';
            res.status(200).json({
                data: parsedData
            });
        })
            .catch(err => {
            return res.status(400).send(err);
        });
    });
}
exports.identifyById = identifyById;
//# sourceMappingURL=sale.controller.js.map