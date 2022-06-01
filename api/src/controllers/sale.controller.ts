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
    await conn.query(`SELECT create_sale(${sale.toString()})`)
    .catch(err => {
        console.log(err);
        return res.status(400).send(err);
    })
    .then(response => {

        let json_response = JSON.parse((response as any).rows[0].create_sale);

        sale.id = json_response.id;
        sale.total = json_response.total;

        res.status(200).json({
            status: 'OK',
            data: sale.responseDto()
        });
    });
};

export async function getSales(req: Request, res: Response) {

    const page = req.query.page;
    let total = req.query.total ? req.query.total : null;
    let paymentMethod = req.query.payment_method ? req.query.payment_method : null;
    let dateFrom = req.query.date_from ? req.query.date_from : null;
    let dateTo = req.query.date_to ? req.query.date_to : null;

    if (paymentMethod && paymentMethod !== 'null') {
        paymentMethod = "'" + paymentMethod + "'"; 
    }

    if (dateFrom && dateFrom !== 'null') {
        dateFrom = "'" + dateFrom + "'"; 
    }

    if (dateTo && dateTo !== 'null') {
        dateTo = "'" + dateTo + "'"; 
    }

    await conn.query(`SELECT search_sales(${page}, ${total}, ${paymentMethod}, ${dateFrom}, ${dateTo})`)
    .catch(err => {
        return res.status(400).send(err);
    })
    .then(response => {

        const data = JSON.parse((response as any).rows[0].search_sales);

        if (!data.sales) {
            data.sales = [];
        }

        res.status(200).json({
            data: data
        });         
    });
}

export async function identifyById(req: Request, res: Response) {

    await conn.query(`SELECT sale_identify_by_id(${req.params.id})`)
    .catch(err => {
        return res.status(400).send(err);
    })
    .then(response => {

        const data = JSON.parse((response as any).rows[0].sale_identify_by_id);

        const parsedData = data ? data : 'Sale not found';

        res.status(200).json({
            data: parsedData
        }); 
    });
}