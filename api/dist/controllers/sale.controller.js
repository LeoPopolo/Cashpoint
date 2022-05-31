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
exports.getSales = exports.createSale = void 0;
const sale_1 = require("../models/sale");
const database_1 = __importDefault(require("../database"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function createSale(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const sale = new sale_1.Sale(req.body.products, req.body.user_owner_id, req.body.payment_method, req.body.discount);
        yield database_1.default.query(`SELECT create_sale(${sale.toString()})`)
            .catch(err => {
            console.log(err);
            return res.status(400).send(err);
        })
            .then(response => {
            let json_response = JSON.parse(response.rows[0].create_sale);
            sale.id = json_response.id;
            sale.total = json_response.total;
            res.status(200).json({
                status: 'OK',
                data: sale.responseDto()
            });
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
        if (paymentMethod !== null && paymentMethod !== 'null') {
            paymentMethod = "'" + paymentMethod + "'";
        }
        if (dateFrom !== null && dateFrom !== 'null') {
            dateFrom = "'" + dateFrom + "'";
        }
        if (dateTo !== null && dateTo !== 'null') {
            dateTo = "'" + dateTo + "'";
        }
        yield database_1.default.query(`SELECT search_sales(${page}, ${total}, ${paymentMethod}, ${dateFrom}, ${dateTo})`)
            .catch(err => {
            return res.status(400).send(err);
        })
            .then(resp => {
            console.log(resp);
            res.status(200).json({
                status: 'OK',
                data: 'caca'
            });
        });
    });
}
exports.getSales = getSales;
// export async function identifyById(req: Request, res: Response) {
//     await conn.query(`SELECT id, name, description, price, stock, barcode
//                         FROM product
//                         WHERE deleted = FALSE AND id = ${req.params.id}`)
//     .catch(err => {
//         return res.status(400).send(err);
//     })
//     .then(resp => {
//         if((resp as any).rows.length === 0) {
//             return res.status(404).json({
//                 error: 'No data found'
//             });
//         } else {
//             let product = (resp as any).rows;
//             res.status(200).json({
//                 status: 'OK',
//                 data: product
//             }); 
//         }
//     });
// }
// export async function deleteSale(req: Request, res: Response) {
//     await conn.query(`UPDATE product
//                         SET deleted = TRUE
//                         WHERE id = ${req.params.id}`)
//     .catch(err => {
//         return res.status(400).send(err);
//     })
//     .then(() => {
//         res.status(200).json({
//             status: 'OK',
//             message: 'Operation completed'
//         }); 
//     });
// }
// export async function reactivateProduct(req: Request, res: Response) {
//     var productsArray = [];
//     await conn.query(`UPDATE product
//                         SET deleted = FALSE
//                         WHERE id = ${req.params.id}`)
//     .catch(err => {
//         return res.status(400).send(err);
//     })
//     .then(resp => {
//         productsArray = (resp as any).rows;
//         res.status(200).json({
//             status: 'OK',
//             message: 'Operation completed'
//         }); 
//     });
// }
// export async function setName(req: Request, res: Response) {
//     await conn.query(`UPDATE product
//                         SET name = '${req.body.name}'
//                         WHERE id = ${req.params.id}`)
//     .catch(err => {
//         console.log(err);
//         return res.status(400).send(err);
//     })
//     .then(() => {
//         res.status(200).json({
//             status: 'OK',
//             message: 'Operation completed'
//         }); 
//     });
// }
// export async function setDescription(req: Request, res: Response) {
//     await conn.query(`UPDATE product
//                         SET description = '${req.body.description}'
//                         WHERE id = ${req.params.id}`)
//     .catch(err => {
//         console.log(err);
//         return res.status(400).send(err);
//     })
//     .then(() => {
//         res.status(200).json({
//             status: 'OK',
//             message: 'Operation completed'
//         }); 
//     });
// }
// export async function setStock(req: Request, res: Response) {
//     await conn.query(`UPDATE product
//                         SET stock = ${req.body.stock}
//                         WHERE id = ${req.params.id}`)
//     .catch(err => {
//         console.log(err);
//         return res.status(400).send(err);
//     })
//     .then(() => {
//         res.status(200).json({
//             status: 'OK',
//             message: 'Operation completed'
//         }); 
//     });
// }
// export async function setPrice(req: Request, res: Response) {
//     await conn.query(`UPDATE product
//                         SET price = ${req.body.price}
//                         WHERE id = ${req.params.id}`)
//     .catch(err => {
//         console.log(err);
//         return res.status(400).send(err);
//     })
//     .then(() => {
//         res.status(200).json({
//             status: 'OK',
//             message: 'Operation completed'
//         }); 
//     });
// }
// export async function setBarcode(req: Request, res: Response) {
//     await conn.query(`UPDATE product
//                         SET barcode = ${req.body.barcode}
//                         WHERE id = ${req.params.id}`)
//     .catch(err => {
//         console.log(err);
//         return res.status(400).send(err);
//     })
//     .then(() => {
//         res.status(200).json({
//             status: 'OK',
//             message: 'Operation completed'
//         }); 
//     });
// }
//# sourceMappingURL=sale.controller.js.map