import { PaymentMethod } from '../shared/PaymentMethodEnum';
import { SaleStatus } from '../shared/SaleStatusEnum';

export class Sale {
    id: number;
    products: Array<any>;
    user_owner_id: number;
    total: number;
    payment_method: PaymentMethod;
    status: SaleStatus;
    discount: number;

    constructor(
        products: Array<any>,
        user_owner_id: number,
        payment_method: PaymentMethod,
        discount: number, 
        id?: number
    ) { 
        this.products = products;
        this.user_owner_id = user_owner_id;
        this.payment_method = payment_method;
        this.status = SaleStatus.Open;
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
            response += '(' + item.id + ',' + item.quantity + '),'
        }

        response = response.substring(0, response.length - 1);

        response += ']::sale_item[]';

        return response;
    }

    toString(){
        return `${this.parseProducts()},${this.user_owner_id},${this.total},'${this.payment_method}','${this.status}',${this.discount}`;
    }

    // responseDto() {
    //     const product: any = {
    //         id: this.id,
    //         name: this.name,
    //         description: this.description,
    //         price: this.price,
    //         stock: this.stock,
    //         barcode: this.barcode
    //     }

    //     return product;
    // }
}