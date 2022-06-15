import { Request, Response } from 'express';
import { Product } from '../models/product';
import conn from '../database';
import dotenv from 'dotenv';
dotenv.config();

export async function createProduct(req: Request, res: Response) {
    
    const product: Product = new Product(req.body.name, req.body.description, req.body.price, req.body.stock, req.body.barcode, req.body.brand);
    
    await conn.query(`INSERT INTO product (name,description,price,stock,barcode,brand) VALUES (${product.toString()}) RETURNING id`)
    .then(async response => {
            
        product.id = (response as any).rows[0].id;

        res.status(200).json({
            status: 'OK',
            data: product
        });
    })
    .catch(err => {
        console.log(err);
        return res.status(400).send(err);
    });
};

export async function getProducts(req: Request, res: Response) {

    const page = req.query.page;
    let name = req.query.name ? req.query.name : null;
    let barcode = req.query.barcode ? req.query.barcode : null;
    let brand = req.query.brand ? req.query.brand : null;

    if (name !== null && name !== 'null') {
        name = "'" + name + "'"; 
    }

    if (brand !== null && brand !== 'null') {
        brand = "'" + brand + "'"; 
    }

    if (barcode !== null && barcode !== 'null') {
        barcode = "'" + barcode + "'"; 
    }

    await conn.query(`SELECT search_products(${page}, ${name}, ${barcode}, ${brand})`)
    .then(resp => {

        const data = JSON.parse((resp as any).rows[0].search_products);

        res.status(200).json({
            status: 'OK',
            data: data
        }); 
        
    })
    .catch(err => {
        return res.status(400).send(err);
    });
}

export async function identifyById(req: Request, res: Response) {

    await conn.query(`SELECT id, name, description, price, stock, barcode, brand
                        FROM product
                        WHERE deleted = FALSE AND id = ${req.params.id}`)
    .then(resp => {

        if((resp as any).rows.length === 0) {
            return res.status(404).json({
                error: 'No data found'
            });
        } else {
            const product = (resp as any).rows[0];
    
            res.status(200).json({
                status: 'OK',
                data: product
            }); 
        }
    })
    .catch(err => {
        return res.status(400).send(err);
    });
}

export async function identifyByBarcode(req: Request, res: Response) {

    await conn.query(`SELECT id, name, description, price, stock, barcode, brand
                        FROM product
                        WHERE deleted = FALSE AND barcode = '${req.params.barcode}'`)
    .then(resp => {

        if((resp as any).rows.length === 0) {
            return res.status(404).json({
                error: 'No data found'
            });
        } else {
            const product = (resp as any).rows[0];
    
            res.status(200).json({
                data: product
            }); 
        }
    })
    .catch(err => {
        return res.status(400).send(err);
    });
}

export async function deleteProduct(req: Request, res: Response) {

    await conn.query(`UPDATE product
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

export async function reactivateProduct(req: Request, res: Response) {

    await conn.query(`UPDATE product
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

    await conn.query(`UPDATE product
                        SET name = '${req.body.name}'
                        WHERE id = ${req.params.id}`)
    .then(() => {

        res.status(200).json({
            status: 'OK',
            message: 'Operation completed'
        }); 
    })
    .catch(err => {
        console.log(err);
        return res.status(400).send(err);
    });
}

export async function setDescription(req: Request, res: Response) {

    await conn.query(`UPDATE product
                        SET description = '${req.body.description}'
                        WHERE id = ${req.params.id}`)
    .then(() => {

        res.status(200).json({
            status: 'OK',
            message: 'Operation completed'
        }); 
    })
    .catch(err => {
        console.log(err);
        return res.status(400).send(err);
    });
}

export async function setStock(req: Request, res: Response) {
    
    await conn.query(`UPDATE product
                        SET stock = ${req.body.stock}
                        WHERE id = ${req.params.id}`)
    .then(() => {

        res.status(200).json({
            status: 'OK',
            message: 'Operation completed'
        }); 
    })
    .catch(err => {
        console.log(err);
        return res.status(400).send(err);
    });
}

export async function setPrice(req: Request, res: Response) {
    
    await conn.query(`UPDATE product
                        SET price = ${req.body.price}
                        WHERE id = ${req.params.id}`)
    .then(() => {

        res.status(200).json({
            status: 'OK',
            message: 'Operation completed'
        }); 
    })
    .catch(err => {
        console.log(err);
        return res.status(400).send(err);
    });
}

export async function setBarcode(req: Request, res: Response) {
    
    await conn.query(`UPDATE product
                        SET barcode = '${req.body.barcode}'
                        WHERE id = ${req.params.id}`)
    .then(() => {

        res.status(200).json({
            status: 'OK',
            message: 'Operation completed'
        }); 
    })
    .catch(err => {
        console.log(err);
        return res.status(400).send(err);
    });
}

export async function setBrand(req: Request, res: Response) {
    
    await conn.query(`UPDATE product
                        SET brand = '${req.body.brand}'
                        WHERE id = ${req.params.id}`)
    .then(() => {

        res.status(200).json({
            status: 'OK',
            message: 'Operation completed'
        }); 
    })
    .catch(err => {
        console.log(err);
        return res.status(400).send(err);
    });
}