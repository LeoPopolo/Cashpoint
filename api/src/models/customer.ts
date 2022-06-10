import { IvaResponsability } from '../shared/IvaResponsabilityEnum';

export class Customer {
    id: number;
    name: string;
    identifier: string;
    phone_number: string;
    iva_responsability: IvaResponsability;
    creation_timestamp: string;

    constructor(name: string, identifier: string, phone_number: string, iva_responsability: IvaResponsability) {
        this.name = name;
        this.identifier = identifier;
        this.phone_number = phone_number;
        this.iva_responsability = iva_responsability;
    }

    toString(){
        return `'${this.name}','${this.identifier}','${this.phone_number}','${this.iva_responsability}'`;
    }
}