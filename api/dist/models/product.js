"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
class Product {
    constructor(name, description, price, stock, barcode, brand, id) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.barcode = barcode;
        this.brand = brand;
        this.deleted = false;
        if (id) {
            this.id = id;
        }
    }
    toString() {
        return `'${this.name}','${this.description}','${this.price}','${this.stock}','${this.barcode}','${this.brand}','${this.deleted}'`;
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