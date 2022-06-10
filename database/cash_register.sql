CREATE TYPE cash_register_totals AS (
	total_cash				            real,
	total_debit				            real,
	total_credit			            real,
	total_mp				            real,
	total_transfer			            real
);

CREATE TYPE cash_register_closure AS (
    closure_timestamp					date DEFAULT current_date,
    closure_timestamp					date DEFAULT current_date
);

CREATE TABLE cash_register (
	closed					            boolean DEFAULT TRUE,
	totals					            cash_register_totals,
	closure_info                        cash_register_closure
) INHERITS (
	core_object
);