export class Product {
    id?: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    barcode: string;
    deleted: boolean;

    constructor(name: string, description: string, price: number, stock: number, barcode: string, id?: number) { 
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

    toString(){
        return `'${this.name}','${this.description}','${this.price}','${this.stock}','${this.barcode}','${this.deleted}'`;
    }

    responseDto() {
        const product: any = {
            id: this.id,
            name: this.name,
            description: this.description,
            price: this.price,
            stock: this.stock,
            barcode: this.barcode
        }

        return product;
    }
}