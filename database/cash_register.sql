CREATE TYPE cash_register_totals AS (
	total_cash				            real,
	total_debit				            real,
	total_credit			            real,
	total_mp				            real,
	total_transfer			            real
);

CREATE TYPE cash_register_total AS (
	total_net				            real,
	total_gross				            real
);

CREATE TYPE cash_register_movements AS (
    amount								real,
	description							text,
	user_owner_id						int
);

CREATE TABLE cash_register (
	closed					            boolean DEFAULT FALSE,
	partial_totals					    cash_register_totals DEFAULT (0,0,0,0,0),
	total								cash_register_total DEFAULT (0,0),
	outgoing_cash						cash_register_movements[] DEFAULT '{}',
	closure_timestamp					timestamp DEFAULT null,
	initial_cash						real
) INHERITS (
	core_object
);


CREATE OR REPLACE FUNCTION create_cash_register (
	p_initial_cash						real
)
RETURNS void AS $$
BEGIN
	IF is_any_cash_register_open() THEN
		RAISE EXCEPTION 'There is a cash register already opened';
	ELSE
		INSERT INTO cash_register (initial_cash) VALUES (p_initial_cash);
	END IF;
END$$
LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION is_any_cash_register_open ()
RETURNS boolean AS $$
    SELECT exists(SELECT * FROM cash_register WHERE NOT closed);
$$
LANGUAGE sql;


CREATE OR REPLACE FUNCTION get_open_cash_register_id ()
RETURNS int AS $$
DECLARE
	v_response							int;
BEGIN
    SELECT id INTO v_response FROM cash_register WHERE closed = FALSE;

	RETURN v_response;
END;
$$
LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION get_open_cash_register ()
RETURNS cash_register AS $$
    SELECT * FROM cash_register WHERE closed = FALSE;
$$
LANGUAGE sql;


CREATE OR REPLACE FUNCTION cash_register_update_gross_total (
	p_amount							real
)
RETURNS void AS $$
    UPDATE cash_register 
	SET total.total_gross = total_gross(total(get_open_cash_register())) + p_amount,
		total.total_net = total_net(total(get_open_cash_register())) + p_amount
	WHERE id = get_open_cash_register_id();
$$
LANGUAGE sql;


CREATE OR REPLACE FUNCTION cash_register_add_cash (
	p_cash								real
)
RETURNS void AS $$
    UPDATE cash_register 
	SET partial_totals.total_cash = total_cash(partial_totals(get_open_cash_register())) + p_cash
	WHERE id = get_open_cash_register_id();

	SELECT cash_register_update_gross_total(p_cash);
$$
LANGUAGE sql;


CREATE OR REPLACE FUNCTION cash_register_add_debit (
	p_debit								real
)
RETURNS void AS $$
    UPDATE cash_register 
	SET partial_totals.total_debit = total_debit(partial_totals(get_open_cash_register())) + p_debit
	WHERE id = get_open_cash_register_id();

	SELECT cash_register_update_gross_total(p_debit);
$$
LANGUAGE sql;


CREATE OR REPLACE FUNCTION cash_register_add_credit (
	p_credit							real
)
RETURNS void AS $$
    UPDATE cash_register 
	SET partial_totals.total_credit = total_credit(partial_totals(get_open_cash_register())) + p_credit
	WHERE id = get_open_cash_register_id();

	SELECT cash_register_update_gross_total(p_credit);
$$
LANGUAGE sql;


CREATE OR REPLACE FUNCTION cash_register_add_transfer (
	p_transfer							real
)
RETURNS void AS $$
    UPDATE cash_register 
	SET partial_totals.total_transfer = total_transfer(partial_totals(get_open_cash_register())) + p_transfer
	WHERE id = get_open_cash_register_id();

	SELECT cash_register_update_gross_total(p_transfer);
$$
LANGUAGE sql;


CREATE OR REPLACE FUNCTION cash_register_add_mp (
	p_mp								real
)
RETURNS void AS $$
    UPDATE cash_register 
	SET partial_totals.total_mp = total_mp(partial_totals(get_open_cash_register())) + p_mp
	WHERE id = get_open_cash_register_id();

	SELECT cash_register_update_gross_total(p_mp);
$$
LANGUAGE sql;


CREATE OR REPLACE FUNCTION cash_register_close ()
RETURNS void AS $$
BEGIN
	IF is_any_cash_register_open() THEN
		UPDATE cash_register 
		SET closed = TRUE, closure_timestamp = current_timestamp
		WHERE id = get_open_cash_register_id();
	ELSE 
		RAISE EXCEPTION 'There is no open cash register';
	END IF;
END;
$$
LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION cash_register_substract_cash (
	p_amount							real,
	p_description						text,
	p_user_owner_id						int
)
RETURNS cash_register AS $$
BEGIN
    UPDATE cash_register 
	SET total.total_net = total_net(total(get_open_cash_register())) - p_amount,
		outgoing_cash = array_append(outgoing_cash(get_open_cash_register()), (p_amount, p_description, p_user_owner_id)::cash_register_movements)
	WHERE id = get_open_cash_register_id();

	RETURN get_open_cash_register();
END;
$$
LANGUAGE plpgsql VOLATILE STRICT;


CREATE OR REPLACE FUNCTION get_cash_registers (
    p_date_from             			timestamp without time zone,
    p_date_to               			timestamp without time zone
)
RETURNS cash_register[] AS $$
	SELECT array (
		SELECT c FROM cash_register c
            WHERE creation_timestamp BETWEEN p_date_from AND p_date_to + '1 day'
			    ORDER BY creation_timestamp DESC
	);
$$
LANGUAGE sql STABLE STRICT
SET search_path FROM CURRENT;


CREATE OR REPLACE FUNCTION get_cash_register_by_id (
    p_id                        		int
)
RETURNS cash_register AS $$
    SELECT c FROM cash_register c
        WHERE id = p_id
$$
LANGUAGE sql STABLE STRICT
SET search_path FROM CURRENT;


CREATE OR REPLACE FUNCTION get_total_cash_register_pages (
	p_cash_registers			        cash_register[]
)
RETURNS int AS $$
DECLARE
	v_rest				    			int;
	v_total_pages		    			int;
BEGIN
	v_rest := array_length(p_cash_registers, 1) % 20;
	v_total_pages := (array_length(p_cash_registers, 1) / 20);

	IF v_rest > 0 THEN
		v_total_pages := v_total_pages + 1;
	END IF;

    RETURN v_total_pages;
END$$
LANGUAGE plpgsql IMMUTABLE STRICT
SET search_path FROM CURRENT;


CREATE OR REPLACE FUNCTION paginate_cash_registers (
	p_page				    			int,
	p_cash_registers			        cash_register[]
)
RETURNS cash_register[] AS $$
DECLARE
	v_rest				    			int;
	v_total_pages		    			int;
	v_cash_registers			        text;
BEGIN
	v_rest := array_length(p_cash_registers, 1) % 20;
	v_total_pages := (array_length(p_cash_registers, 1) / 20);

	IF v_rest > 0 THEN
		v_total_pages := v_total_pages + 1;
	END IF;
	
	IF p_page < 1 THEN
		RAISE EXCEPTION 'Page cannot be lesser than 1';
	END IF;
	
	IF p_page > v_total_pages THEN
		RAISE EXCEPTION 'Page cannot be more than maximum pages';
	END IF;

	EXECUTE format (
		'SELECT array(
			SELECT o FROM unnest(%L::%s) o
				LIMIT %L OFFSET %s
		)', p_cash_registers, pg_typeof(p_cash_registers), 20, ((p_page - 1) * 20)
    ) INTO v_cash_registers;

    RETURN v_cash_registers;
END$$
LANGUAGE plpgsql IMMUTABLE STRICT
SET search_path FROM CURRENT;


CREATE OR REPLACE FUNCTION search_cash_registers (
	p_page								int,
	p_date_from             			timestamp without time zone DEFAULT '2022-01-01'::timestamp,
	p_date_to               			timestamp without time zone DEFAULT current_timestamp
)
RETURNS text AS $$
DECLARE
	v_cash_registers					cash_register[];
	v_response							jsonb;
	v_total_pages						int DEFAULT 0;
BEGIN

    IF p_date_from IS NULL THEN
        p_date_from := '2022-01-01'::timestamp;
    END IF;

    IF p_date_to IS NULL THEN
        p_date_to := current_timestamp;
    END IF;

	v_cash_registers := get_cash_registers(p_date_from, p_date_to);
	
	IF p_page != 0
	THEN
		v_cash_registers := paginate_cash_registers(p_page, v_cash_registers);
	END IF;

	v_total_pages := get_total_cash_register_pages(v_cash_registers);

	IF v_total_pages IS NULL THEN
		v_total_pages := 0;
	END IF;
	
	v_response := jsonb_build_object (
		'cash_registers', array_to_json(v_cash_registers),
		'total_pages', v_total_pages,
		'page_number', p_page
	);

	RETURN v_response::text;
END;
$$ LANGUAGE plpgsql STABLE
SET search_path FROM CURRENT;


CREATE OR REPLACE FUNCTION cash_register_identify_by_id (
    p_id                    		int
)
RETURNS text AS $$
DECLARE
	v_cash_register					cash_register;
	v_response						jsonb;
BEGIN

	v_cash_register := get_cash_register_by_id(p_id);
	
	v_response := to_json(v_cash_register);
	
	RETURN v_response::text;
END;
$$ LANGUAGE plpgsql STABLE
SET search_path FROM CURRENT;
