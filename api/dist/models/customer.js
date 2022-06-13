"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customer = void 0;
class Customer {
    constructor(name, identifier, phone_number, iva_responsability) {
        this.name = name;
        this.identifier = identifier;
        this.phone_number = phone_number;
        this.iva_responsability = iva_responsability;
    }
    toString() {
        return `'${this.name}','${this.identifier}','${this.phone_number}','${this.iva_responsability}'`;
    }
}
exports.Customer = Customer;
//# sourceMappingURL=customer.js.map