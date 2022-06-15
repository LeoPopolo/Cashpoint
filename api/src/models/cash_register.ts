export class CashRegisterTotals {
    total_cash: number;
    total_debit: number;
    total_credit: number;
    total_mp: number;
    total_transfer: number;
}

export class CashRegisterTotal {
    total_gross: number;
    total_net: number;
}

export class CashRegisterMovements {
    amount: number;
    description: string;
    user_owner_id: number;
    creation_timestamp: Date;
}

export class CashRegisterAnalytics {
    sales_quantity: number;
    sold_items_quantity: number;
}

export class CashRegister {
    closed: boolean;
    partial_totals: CashRegisterTotals;
    total: CashRegisterTotal;
    outgoing_cash: CashRegisterMovements;
    closure_timestamp: Date;
    initial_cash: number;
    data_analytics: CashRegisterAnalytics;

    constructor(initial_cash: number) {
        this.initial_cash = initial_cash;
    }
}