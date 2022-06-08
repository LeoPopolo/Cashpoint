CREATE TYPE sale_item AS (
    id                      int,
    name                    text NOT NULL,
    description             text,
    price                   real NOT NULL,
    barcode                 text,
	brand			        text,
    quantity                int
);

CREATE TABLE sale (
    products            sale_item[],
    user_owner_id           int,
    total                   real,
    payment_method          text,
    status                  text,
    discount                real
) INHERITS (
	core_object
);

CREATE OR REPLACE FUNCTION create_sale (
    p_items				    sale_item[],
    p_user_owner_id    	    int,
    p_payment_method     	text,
    p_discount  			real
)
RETURNS text AS $$
DECLARE
    v_item 				    sale_item;
    v_response				record;
    v_total				    real DEFAULT 0;
	v_sale_status			text;
	v_current_stock			int;
    v_price				    real;
BEGIN

    FOREACH v_item IN ARRAY p_items
    LOOP
        SELECT stock, price INTO v_current_stock, v_price FROM product WHERE id = v_item.id;
        
        v_total := v_total + (v_item.quantity * v_item.price);
		
		IF v_current_stock >= v_item.quantity THEN
            UPDATE product SET stock = v_current_stock - v_item.quantity WHERE id = v_item.id;
        ELSE
            RAISE EXCEPTION 'Not enough stock of product with id = %', v_item.id;
        END IF;
    END LOOP;
    
    IF p_discount > 0 THEN

        v_total := v_total - (v_total * p_discount / 100);
    END IF;

    INSERT INTO sale (
        products, 
        user_owner_id, 
        total, 
        payment_method, 
        status, 
        discount
    ) VALUES (
        p_items, 
        p_user_owner_id, 
        v_total, 
        p_payment_method, 
        'closed',
        p_discount
    ) RETURNING * INTO v_response;
    
    RETURN json_build_object(
        'id', v_response.id,
        'total', v_response.total
    )::text;
END$$
LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION get_sales (
    p_date_from             timestamp without time zone,
    p_date_to               timestamp without time zone
)
RETURNS sale[] AS $$
	SELECT array (
		SELECT s FROM sale s
            WHERE creation_timestamp BETWEEN p_date_from AND p_date_to + '1 day'
			    ORDER BY creation_timestamp DESC
	);
$$
LANGUAGE sql STABLE STRICT
SET search_path FROM CURRENT;


CREATE OR REPLACE FUNCTION get_sale_by_id (
    p_id                        int
)
RETURNS sale AS $$
    SELECT s FROM sale s
        WHERE id = p_id
$$
LANGUAGE sql STABLE STRICT
SET search_path FROM CURRENT;


CREATE OR REPLACE FUNCTION get_total_sales_pages (
	p_sales			        sale[]
)
RETURNS int AS $$
DECLARE
	v_rest				    int;
	v_total_pages		    int;
BEGIN
	v_rest := array_length(p_sales, 1) % 20;
	v_total_pages := (array_length(p_sales, 1) / 20);

	IF v_rest > 0 THEN
		v_total_pages := v_total_pages + 1;
	END IF;

    RETURN v_total_pages;
END$$
LANGUAGE plpgsql IMMUTABLE STRICT
SET search_path FROM CURRENT;


CREATE OR REPLACE FUNCTION paginate_sales (
	p_page				    int,
	p_sales			        sale[]
)
RETURNS sale[] AS $$
DECLARE
	v_rest				    int;
	v_total_pages		    int;
	v_sales			        text;
BEGIN
	v_rest := array_length(p_sales, 1) % 20;
	v_total_pages := (array_length(p_sales, 1) / 20);

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
		)', p_sales, pg_typeof(p_sales), 20, ((p_page - 1) * 20)
    ) INTO v_sales;

    RETURN v_sales;
END$$
LANGUAGE plpgsql IMMUTABLE STRICT
SET search_path FROM CURRENT;


CREATE OR REPLACE FUNCTION filter_sales_by_total (
    p_sales                       sale[],
    p_total                       real
) RETURNS sale[] AS $$
DECLARE
    v_sales                       text;
    v_querystring                 text;
BEGIN

    v_querystring := format (
        'SELECT ARRAY(SELECT x FROM unnest(%L::sale[]) x 
            WHERE total = %L)', 
        p_sales,
        p_total
    );

    EXECUTE v_querystring INTO v_sales;

    RETURN v_sales;
END;
$$ LANGUAGE plpgsql STABLE STRICT
SET search_path FROM CURRENT;


CREATE OR REPLACE FUNCTION filter_sales_by_payment_method (
    p_sales                       sale[],
    p_payment_method              text
) RETURNS sale[] AS $$
DECLARE
    v_sales                       text;
    v_querystring                 text;
BEGIN

    v_querystring := format (
        'SELECT ARRAY(SELECT x FROM unnest(%L::sale[]) x 
            WHERE payment_method = %L)', 
        p_sales,
        p_payment_method
    );

    EXECUTE v_querystring INTO v_sales;

    RETURN v_sales;
END;
$$ LANGUAGE plpgsql STABLE STRICT
SET search_path FROM CURRENT;


CREATE OR REPLACE FUNCTION filter_sales_by_creation_timestamp (
    p_sales                       sale[],
    p_date_from                   timestamp,
    p_date_to                     timestamp
) RETURNS sale[] AS $$
DECLARE
    v_sales                       text;
    v_querystring                 text;
BEGIN

    v_querystring := format (
        'SELECT ARRAY(SELECT x FROM unnest(%L::sale[]) x 
            WHERE creation_timestamp BETWEEN %L AND %L)', 
        p_sales,
        p_date_from,
        p_date_to
    );

    EXECUTE v_querystring INTO v_sales;

    RETURN v_sales;
END;
$$ LANGUAGE plpgsql STABLE STRICT
SET search_path FROM CURRENT;


CREATE OR REPLACE FUNCTION search_sales (
	p_page					int,
	p_total					real DEFAULT -1,
	p_payment_method        text DEFAULT '%',
	p_date_from             timestamp without time zone DEFAULT '2022-01-01'::timestamp,
	p_date_to               timestamp without time zone DEFAULT current_timestamp
)
RETURNS text AS $$
DECLARE
	v_sales					sale[];
	v_response				jsonb;
	v_total_pages			int DEFAULT 0;
BEGIN

    IF p_date_from IS NULL THEN
        p_date_from := '2022-01-01'::timestamp;
    END IF;

    IF p_date_to IS NULL THEN
        p_date_to := current_timestamp;
    END IF;

	v_sales := get_sales(p_date_from, p_date_to);
	
	IF p_total != -1 AND p_total IS NOT NULL
	THEN
		v_sales := filter_sales_by_total(v_sales, p_total);
	END IF;

    IF p_payment_method != '%' AND p_payment_method IS NOT NULL
	THEN
		v_sales := filter_sales_by_payment_method(v_sales, p_payment_method);
	END IF;
	
	IF p_page != 0
	THEN
		v_sales := paginate_sales(p_page, v_sales);
	END IF;

	v_total_pages := get_total_sales_pages(v_sales);

	IF v_total_pages IS NULL THEN
		v_total_pages := 0;
	END IF;
	
	v_response := jsonb_build_object (
		'sales', array_to_json(v_sales),
		'total_pages', v_total_pages,
		'page_number', p_page
	);

	RETURN v_response::text;
END;
$$ LANGUAGE plpgsql STABLE
SET search_path FROM CURRENT;


CREATE OR REPLACE FUNCTION sale_identify_by_id (
    p_id                    int
)
RETURNS text AS $$
DECLARE
	v_sale					sale;
	v_response				jsonb;
BEGIN

	v_sale := get_sale_by_id(p_id);
	
	v_response := to_json(v_sale);
	
	RETURN v_response::text;
END;
$$ LANGUAGE plpgsql STABLE
SET search_path FROM CURRENT;
