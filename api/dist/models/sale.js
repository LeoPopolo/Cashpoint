"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sale = void 0;
const SaleStatusEnum_1 = require("../shared/SaleStatusEnum");
class Sale {
    constructor(products, user_owner_id, payment_method, discount, id) {
        this.products = products;
        this.user_owner_id = user_owner_id;
        this.payment_method = payment_method;
        this.status = SaleStatusEnum_1.SaleStatus.Open;
        this.discount = discount;
        this.total = 0;
        for (let item of this.products) {
            this.total = item.price * item.quantity;
        }
        if (id) {
            this.id = id;
        }
    }
    parseProducts() {
        let response = 'array[';
        for (let item of this.products) {
            response += '(' + item.id + ',' + item.quantity + '),';
        }
        response = response.substring(0, response.length - 1);
        response += ']::sale_item[]';
        return response;
    }
    toString() {
        return `${this.parseProducts()},${this.user_owner_id},${this.total},'${this.payment_method}','${this.status}',${this.discount}`;
    }
}
exports.Sale = Sale;
//# sourceMappingURL=sale.js.map