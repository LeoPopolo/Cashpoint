import { PaymentMethod } from '../shared/PaymentMethodEnum';
import { SaleStatus } from '../shared/SaleStatusEnum';
import { Customer } from './customer';

export class Sale {
    id: number;
    products: Array<any>;
    user_owner_id: number;
    customer: Customer;
    total: number;
    payment_method: PaymentMethod;
    status: SaleStatus;
    discount: number;

    constructor(
        products: Array<any>,
        user_owner_id: number,
        payment_method: PaymentMethod,
        discount: number,
        id?: number,
        total?: number
    ) { 
        this.products = products;
        this.user_owner_id = user_owner_id;
        this.payment_method = payment_method;
        this.status = SaleStatus.Closed;
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

    toString(customer_id: number){
        return `${this.parseProducts()},${this.user_owner_id},'${this.payment_method}',${this.discount},${customer_id}`;
    }

    responseDto() {
        const sale: any = {
            id: this.id,
            user_owner_id: this.user_owner_id,
            total: this.total,
            discount: this.discount,
            payment_method: this.payment_method,
            status: this.status,
            customer: this.customer
        }

        return sale;
    }
}