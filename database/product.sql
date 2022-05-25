CREATE TABLE product (
    name            text NOT NULL,
    description     text,
    price           real NOT NULL,
    stock           int NOT NULL,
    barcode         text,
    deleted         boolean
) INHERITS (
	core_object
);


ALTER TABLE product
ADD CONSTRAINT UQ_product_name 
UNIQUE (name);


ALTER TABLE product
ADD CONSTRAINT UQ_product_barcode 
UNIQUE (barcode);


CREATE OR REPLACE FUNCTION get_products ()
RETURNS product[] AS $$
	SELECT array (
		SELECT pr FROM product pr 
			WHERE NOT deleted
				ORDER BY id ASC
	);
$$
LANGUAGE sql STABLE STRICT
SET search_path FROM CURRENT;


CREATE OR REPLACE FUNCTION get_total_products_pages (
	p_products			product[]
)
RETURNS int AS $$
DECLARE
	v_rest				int;
	v_total_pages		int;
BEGIN
	v_rest := array_length(p_products, 1) % 20;
	v_total_pages := (array_length(p_products, 1) / 20);

	IF v_rest > 0 THEN
		v_total_pages := v_total_pages + 1;
	END IF;

    RETURN v_total_pages;
END$$
LANGUAGE plpgsql IMMUTABLE STRICT
SET search_path FROM CURRENT;


CREATE OR REPLACE FUNCTION paginate_products (
	p_page				int,
	p_products			product[]
)
RETURNS product[] AS $$
DECLARE
	v_rest				int;
	v_total_pages		int;
	v_products			text;
BEGIN
	v_rest := array_length(p_products, 1) % 20;
	v_total_pages := (array_length(p_products, 1) / 20);

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
		)', p_products, pg_typeof(p_products), 20, ((p_page - 1) * 20)
    ) INTO v_products;

    RETURN v_products;
END$$
LANGUAGE plpgsql IMMUTABLE STRICT
SET search_path FROM CURRENT;
