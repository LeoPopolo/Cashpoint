import { Request, Response } from 'express';
import { CashRegister } from '../models/cash_register';
import conn from '../database';
import dotenv from 'dotenv';
dotenv.config();

export async function createCashRegister(req: Request, res: Response) {
    
    const cash_register: CashRegister = new CashRegister(
                                    req.body.initial_cash
                                );
    await conn.query(`SELECT create_cash_register(${cash_register.initial_cash})`)
    .then(() => {

        res.status(200).json({
            status: 'OK',
            message: 'Cash register opened'
        });
    })
    .catch(err => {
        console.log(err);
        return res.status(400).send(err);
    });
};

export async function getCashRegisters(req: Request, res: Response) {

    const page = req.query.page;
    let dateFrom = req.query.date_from ? req.query.date_from : null;
    let dateTo = req.query.date_to ? req.query.date_to : null;

    if (dateFrom && dateFrom !== 'null') {
        dateFrom = "'" + dateFrom + "'"; 
    }

    if (dateTo && dateTo !== 'null') {
        dateTo = "'" + dateTo + "'"; 
    }

    await conn.query(`SELECT search_cash_registers(${page}, ${dateFrom}, ${dateTo})`)
    .then(response => {

        const data = JSON.parse((response as any).rows[0].search_cash_registers);

        if (!data.cash_registers) {
            data.cash_registers = [];
        }

        res.status(200).json({
            data: data
        });         
    })
    .catch(err => {
        console.log(err);
        return res.status(400).send(err);
    });
}

export async function identifyById(req: Request, res: Response) {

    await conn.query(`SELECT cash_register_identify_by_id(${req.params.id})`)
    .then(response => {

        const data = JSON.parse((response as any).rows[0].cash_register_identify_by_id);

        const parsedData = data ? data : 'Cash register not found';

        res.status(200).json({
            data: parsedData
        }); 
    })
    .catch(err => {
        console.log(err);
        return res.status(400).send(err);
    });
}

export async function substractCash(req: Request, res: Response) {

    await conn.query(`SELECT cash_register_substract_cash(${req.body.amount}, '${req.body.description}', ${req.body.user_owner_id})`)
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

export async function closeCashRegister(req: Request, res: Response) {

    await conn.query(`SELECT cash_register_close()`)
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

export async function isAnyCashRegisterOpen(req: Request, res: Response) {

    await conn.query(`SELECT is_any_cash_register_open()`)
    .then(response => {

        const data = response.rows[0].is_any_cash_register_open;

        res.status(200).json({
            data: data
        }); 
    })
    .catch(err => {
        console.log(err);
        return res.status(400).send(err);
    });
}

export async function getOpenCashRegister(req: Request, res: Response) {

    await conn.query(`SELECT cash_register_get_open()`)
    .then(response => {

        const data = JSON.parse(response.rows[0].cash_register_get_open);

        res.status(200).json({
            data: data
        }); 
    })
    .catch(err => {
        console.log(err);
        return res.status(400).send(err);
    });
}