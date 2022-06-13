"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sale = void 0;
const SaleStatusEnum_1 = require("../shared/SaleStatusEnum");
class Sale {
    constructor(products, user_owner_id, payment_method, discount, id, total) {
        this.products = products;
        this.user_owner_id = user_owner_id;
        this.payment_method = payment_method;
        this.status = SaleStatusEnum_1.SaleStatus.Closed;
        this.discount = discount;
        this.total = 0;
        if (total) {
            this.total = total;
        }
        if (id) {
            this.id = id;
        }
    }
    parseProducts() {
        let response = 'array[';
        for (let item of this.products) {
            response += `(${item.id}, '${item.name}', '${item.description}', ${item.price}, '${item.barcode}', '${item.brand}', ${item.quantity}),`;
        }
        response = response.substring(0, response.length - 1);
        response += ']::sale_item[]';
        return response;
    }
    toString(customer_id) {
        return `${this.parseProducts()},${this.user_owner_id},'${this.payment_method}',${this.discount},${customer_id}`;
    }
    responseDto() {
        const sale = {
            id: this.id,
            user_owner_id: this.user_owner_id,
            total: this.total,
            discount: this.discount,
            payment_method: this.payment_method,
            status: this.status,
            customer: this.customer
        };
        return sale;
    }
}
exports.Sale = Sale;
//# sourceMappingURL=sale.js.map