import { Request, Response } from 'express';
import { Customer } from '../models/customer';
import conn from '../database';
import dotenv from 'dotenv';
dotenv.config();

export async function createCustomer(req: Request, res: Response) {
    
    const customer: Customer = new Customer(req.body.name, req.body.identifier, req.body.phone_number, req.body.iva_responsability);

    await conn.query(`INSERT INTO customer (name,identifier,phone_number,iva_responsability) VALUES (${customer.toString()})`)
    .then(async response => {
     
        customer.id = (response as any).rows[0].id;

        res.status(200).json({
            status: 'OK',
            message: 'Operation completed'
        });
    })
    .catch(err => {
        return res.status(400).send(err);
    });
};

export async function getCustomers(req: Request, res: Response) {

    await conn.query(`SELECT id, name, identifier, phone_number, iva_responsability, creation_timestamp
                        FROM customer
                        WHERE deleted = FALSE`)
    .then(resp => {

        if((resp as any).rows.length === 0) {
            return res.status(404).json({
                error: 'No data found'
            });
        } else {
            const customer = (resp as any).rows;
    
            res.status(200).json({
                status: 'OK',
                data: customer
            }); 
        }
    })
    .catch(err => {
        return res.status(400).send(err);
    });
}

export async function identifyById(req: Request, res: Response) {

    await conn.query(`SELECT id, name, identifier, phone_number, iva_responsability, creation_timestamp
                        FROM customer
                        WHERE id = ${req.params.id} AND deleted = FALSE`)
    .then(resp => {

        if((resp as any).rows.length === 0) {
            return res.status(404).json({
                error: 'No data found'
            });
        } else {
            const customer = (resp as any).rows[0];
    
            res.status(200).json({
                status: 'OK',
                data: customer
            }); 
        }
    })
    .catch(err => {
        return res.status(400).send(err);
    });
}

export async function deleteCustomer(req: Request, res: Response) {

    await conn.query(`UPDATE customer
                        SET deleted = TRUE
                        WHERE id = ${req.params.id}`)
    .then(() => {

        res.status(200).json({
            status: 'OK',
            message: 'Operation completed'
        }); 
    })
    .catch(err => {
        return res.status(400).send(err);
    });
}

export async function reactivateCustomer(req: Request, res: Response) {

    await conn.query(`UPDATE customer
                        SET deleted = FALSE
                        WHERE id = ${req.params.id}`)
    .then(() => {

        res.status(200).json({
            status: 'OK',
            message: 'Operation completed'
        }); 
    })
    .catch(err => {
        return res.status(400).send(err);
    });
}

export async function setName(req: Request, res: Response) {

    await conn.query(`UPDATE customer
                        SET name = '${req.body.name}'
                        WHERE id = ${req.params.id}`)
    .then(() => {

        res.status(200).json({
            status: 'OK',
            message: 'Operation completed'
        }); 
    })
    .catch(err => {
        return res.status(400).send(err);
    });
}

export async function setIdentifier(req: Request, res: Response) {

    await conn.query(`UPDATE customer
                        SET identifier = '${req.body.identifier}'
                        WHERE id = ${req.params.id}`)
    .then(() => {

        res.status(200).json({
            status: 'OK',
            message: 'Operation completed'
        }); 
    })
    .catch(err => {
        return res.status(400).send(err);
    });
}

export async function setPhoneNumber(req: Request, res: Response) {

    await conn.query(`UPDATE customer
                        SET phone_number = '${req.body.phone_number}'
                        WHERE id = ${req.params.id}`)
    .then(() => {

        res.status(200).json({
            status: 'OK',
            message: 'Operation completed'
        }); 
    })
    .catch(err => {
        return res.status(400).send(err);
    });
}

export async function setIvaResponsability(req: Request, res: Response) {

    await conn.query(`UPDATE customer
                        SET iva_responsability = '${req.body.iva_responsability}'
                        WHERE id = ${req.params.id}`)
    .then(() => {

        res.status(200).json({
            status: 'OK',
            message: 'Operation completed'
        }); 
    })
    .catch(err => {
        return res.status(400).send(err);
    });
}