import { Request, Response } from 'express';
import { Sale } from '../models/sale';
import conn from '../database';
import dotenv from 'dotenv';
dotenv.config();

export async function createSale(req: Request, res: Response) {
    
    const sale: Sale = new Sale(
                                    req.body.products, 
                                    req.body.user_owner_id,  
                                    req.body.payment_method, 
                                    req.body.discount
                                );
    await conn.query(`INSERT INTO sale (
                        products, 
                        user_owner_id, 
                        total, 
                        payment_method, 
                        status, 
                        discount
                    ) VALUES (
                        ${sale.toString()}
                    )
                    RETURNING id`)
    .catch(err => {
        console.log(err);
        return res.status(400).send(err);
    })
    .then(async response => {

        sale.id = (response as any).rows[0].id;

        res.status(200).json({
            status: 'OK',
            data: sale
        });
    });
};

export async function getProducts(req: Request, res: Response) {
    var productsArray = [];

    await conn.query(`SELECT id, name, description, price, stock, barcode
                        FROM product
                        WHERE deleted = FALSE
                        ORDER BY id ASC`)
    .catch(err => {
        return res.status(400).send(err);
    })
    .then(resp => {

        if((resp as any).rows.length === 0) {
            return res.status(404).json({
                error: 'No data found'
            });
        } else {
            productsArray = (resp as any).rows;
    
            res.status(200).json({
                status: 'OK',
                data: productsArray
            }); 
        }
    });
}

export async function identifyById(req: Request, res: Response) {

    await conn.query(`SELECT id, name, description, price, stock, barcode
                        FROM product
                        WHERE deleted = FALSE AND id = ${req.params.id}`)
    .catch(err => {
        return res.status(400).send(err);
    })
    .then(resp => {

        if((resp as any).rows.length === 0) {
            return res.status(404).json({
                error: 'No data found'
            });
        } else {
            let product = (resp as any).rows;
    
            res.status(200).json({
                status: 'OK',
                data: product
            }); 
        }
    });
}

export async function deleteProduct(req: Request, res: Response) {

    await conn.query(`UPDATE product
                        SET deleted = TRUE
                        WHERE id = ${req.params.id}`)
    .catch(err => {
        return res.status(400).send(err);
    })
    .then(() => {

        res.status(200).json({
            status: 'OK',
            message: 'Operation completed'
        }); 
    });
}

export async function reactivateProduct(req: Request, res: Response) {
    var productsArray = [];

    await conn.query(`UPDATE product
                        SET deleted = FALSE
                        WHERE id = ${req.params.id}`)
    .catch(err => {
        return res.status(400).send(err);
    })
    .then(resp => {

        productsArray = (resp as any).rows;

        res.status(200).json({
            status: 'OK',
            message: 'Operation completed'
        }); 
    });
}

export async function setName(req: Request, res: Response) {

    await conn.query(`UPDATE product
                        SET name = '${req.body.name}'
                        WHERE id = ${req.params.id}`)
    .catch(err => {
        console.log(err);
        return res.status(400).send(err);
    })
    .then(() => {

        res.status(200).json({
            status: 'OK',
            message: 'Operation completed'
        }); 
    });
}

export async function setDescription(req: Request, res: Response) {

    await conn.query(`UPDATE product
                        SET description = '${req.body.description}'
                        WHERE id = ${req.params.id}`)
    .catch(err => {
        console.log(err);
        return res.status(400).send(err);
    })
    .then(() => {

        res.status(200).json({
            status: 'OK',
            message: 'Operation completed'
        }); 
    });
}

export async function setStock(req: Request, res: Response) {
    
    await conn.query(`UPDATE product
                        SET stock = ${req.body.stock}
                        WHERE id = ${req.params.id}`)
    .catch(err => {
        console.log(err);
        return res.status(400).send(err);
    })
    .then(() => {

        res.status(200).json({
            status: 'OK',
            message: 'Operation completed'
        }); 
    });
}

export async function setPrice(req: Request, res: Response) {
    
    await conn.query(`UPDATE product
                        SET price = ${req.body.price}
                        WHERE id = ${req.params.id}`)
    .catch(err => {
        console.log(err);
        return res.status(400).send(err);
    })
    .then(() => {

        res.status(200).json({
            status: 'OK',
            message: 'Operation completed'
        }); 
    });
}

export async function setBarcode(req: Request, res: Response) {
    
    await conn.query(`UPDATE product
                        SET barcode = ${req.body.barcode}
                        WHERE id = ${req.params.id}`)
    .catch(err => {
        console.log(err);
        return res.status(400).send(err);
    })
    .then(() => {

        res.status(200).json({
            status: 'OK',
            message: 'Operation completed'
        }); 
    });
}