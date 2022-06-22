"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
class Product {
    constructor(name, description, price, stock, barcode, id) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.barcode = barcode;
        this.deleted = false;
        if (id) {
            this.id = id;
        }
    }
    toString(brand_id) {
        return `'${this.name}','${this.description}','${this.price}','${this.stock}','${this.barcode}',${brand_id}`;
    }
    responseDto() {
        const product = {
            id: this.id,
            name: this.name,
            description: this.description,
            price: this.price,
            stock: this.stock,
            barcode: this.barcode
        };
        return product;
    }
}
exports.Product = Product;
//# sourceMappingURL=product.js.map