import { Request, Response } from 'express';
import { Product } from '../models/product';
import conn from '../database';
import dotenv from 'dotenv';
dotenv.config();

export async function createProduct(req: Request, res: Response) {
    
    const product: Product = new Product(req.body.name, req.body.description, req.body.price, req.body.stock, req.body.barcode);
    
    await conn.query(`INSERT INTO product (name,description,price,stock,barcode,deleted) VALUES (${product.toString()}) RETURNING id`)
    .catch(err => {
        console.log(err);
        return res.status(400).send(err);
    })
    .then(async response => {
            
        product.id = (response as any).rows[0].id;

        res.status(200).json({
            status: 'OK',
            data: product
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

    await conn.query(`UPDATE product
                        SET deleted = FALSE
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