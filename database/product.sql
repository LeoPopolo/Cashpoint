CREATE TABLE brand (
	provider_id			int DEFAULT null,
	name				text
) INHERITS (
	core_object
);


CREATE TABLE product (
    name            	text NOT NULL,
    description     	text,
    price           	real NOT NULL,
    stock           	int NOT NULL,
    barcode         	text,
	brand				brand,
    deleted         	boolean DEFAULT FALSE
) INHERITS (
	core_object
);


ALTER TABLE product
ADD CONSTRAINT UQ_product_name 
UNIQUE (name);


ALTER TABLE product
ADD CONSTRAINT UQ_product_barcode 
UNIQUE (barcode);


CREATE OR REPLACE FUNCTION create_product (
	p_name				text,
	p_description		text,
	p_price				real,
	p_stock				int,
	p_barcode 			text,
	p_brand				int
) RETURNS text AS $$
DECLARE
	v_brand				brand;
	v_query_response	product;
	v_json_response		jsonb;
BEGIN
	v_brand := brand_identify_by_id(p_brand);

	INSERT INTO product (name, description, price, stock, barcode, brand) 
				VALUES (p_name, p_description, p_price, p_stock, p_barcode, v_brand)
				RETURNING * INTO v_query_response;

	v_json_response := to_json(v_query_response);

	RETURN v_json_response::text;
END;
$$ LANGUAGE plpgsql VOLATILE STRICT; 


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


CREATE OR REPLACE FUNCTION filter_products_by_name (
    p_products                    product[],
    p_name                     	  text
) RETURNS product[] AS $$
DECLARE
    v_products                    text;
    v_querystring                 text;
BEGIN

    v_querystring := format (
        'SELECT ARRAY(SELECT x FROM unnest(%L::product[]) x 
            WHERE name ilike ''%%'' || %L || ''%%'')', 
        p_products,
        p_name
    );

    EXECUTE v_querystring INTO v_products;

    RETURN v_products;
END;
$$ LANGUAGE plpgsql STABLE STRICT
SET search_path FROM CURRENT;


CREATE OR REPLACE FUNCTION filter_products_by_brand (
    p_products                    product[],
    p_brand                       text
) RETURNS product[] AS $$
DECLARE
    v_products                    text;
    v_querystring                 text;
BEGIN

    v_querystring := format (
        'SELECT ARRAY(SELECT x FROM unnest(%L::product[]) x 
            WHERE brand ilike ''%%'' || %L || ''%%'')', 
        p_products,
        p_brand
    );

    EXECUTE v_querystring INTO v_products;

    RETURN v_products;
END;
$$ LANGUAGE plpgsql STABLE STRICT
SET search_path FROM CURRENT;


CREATE OR REPLACE FUNCTION filter_products_by_barcode (
    p_products                    product[],
    p_barcode                     text
) RETURNS product[] AS $$
DECLARE
    v_products                    text;
    v_querystring                 text;
BEGIN

    v_querystring := format (
        'SELECT ARRAY(SELECT x FROM unnest(%L::product[]) x 
            WHERE barcode ilike ''%%'' || %L || ''%%'')', 
        p_products,
        p_barcode
    );

    EXECUTE v_querystring INTO v_products;

    RETURN v_products;
END;
$$ LANGUAGE plpgsql STABLE STRICT
SET search_path FROM CURRENT;


CREATE OR REPLACE FUNCTION search_products (
	p_page					int,
	p_name					text DEFAULT '%',
	p_barcode				text DEFAULT '%',
	p_brand					text DEFAULT '%'
)
RETURNS text AS $$
DECLARE
	v_products				product[];
	v_response				jsonb;
	v_total_pages			int DEFAULT 0;
BEGIN
	
	v_products := get_products();
	
	IF p_name != '%' AND p_name IS NOT NULL
	THEN
		v_products := filter_products_by_name(v_products, p_name);
	END IF;
	
	IF p_barcode != '%' AND p_barcode IS NOT NULL
	THEN
		v_products := filter_products_by_barcode(v_products, p_barcode);
	END IF;

	IF p_brand != '%' AND p_brand IS NOT NULL
	THEN
		v_products := filter_products_by_brand(v_products, p_brand);
	END IF;
	
	IF p_page != 0
	THEN
		v_products := paginate_products(p_page, v_products);
	END IF;

	v_total_pages := get_total_products_pages(v_products);

	IF v_total_pages IS NULL THEN
		v_total_pages := 0;
	END IF;
	
	v_response := jsonb_build_object (
		'products', array_to_json(v_products),
		'total_pages', v_total_pages,
		'page_number', p_page
	);

	RETURN v_response::text;
END;
$$ LANGUAGE plpgsql STABLE
SET search_path FROM CURRENT;


CREATE OR REPLACE FUNCTION product_set_brand (
	p_product_id				int,
	p_brand_id					int
) RETURNS void AS $$
DECLARE
	v_brand 					brand;
BEGIN
	v_brand := brand_identify_by_id(p_brand_id);

	UPDATE product SET brand = v_brand WHERE id = p_product_id;
END$$ 
LANGUAGE plpgsql VOLATILE STRICT;


CREATE OR REPLACE FUNCTION product_identify_by_id (
	p_id						int
) RETURNS text AS $$
DECLARE
	v_response					jsonb;
	v_product					product;
BEGIN
	v_product := identify_product_by_id(p_id);

	v_response := to_json(v_product);

	RETURN v_response::text;
END$$
LANGUAGE plpgsql IMMUTABLE STRICT;


CREATE OR REPLACE FUNCTION identify_product_by_id (
	p_id						real
) RETURNS product AS $$
	
	SELECT * FROM product WHERE id = p_id;

$$ LANGUAGE sql IMMUTABLE STRICT;


CREATE OR REPLACE FUNCTION set_price_by_brand (
	p_percentage				real,
	p_brand_id					int
) RETURNS void AS $$
	UPDATE product
		SET price = price + (price * (p_percentage) / 100)
			WHERE id(brand) = p_brand_id;
$$ LANGUAGE sql VOLATILE STRICT;


CREATE OR REPLACE FUNCTION brand_identify_by_id (
	p_id			int
) RETURNS brand AS $$
	SELECT b FROM brand b WHERE id = p_id;
$$ LANGUAGE sql IMMUTABLE STRICT;


CREATE OR REPLACE FUNCTION get_brands ()
RETURNS brand[] AS $$
	SELECT array (
		SELECT br FROM brand br 
			ORDER BY name ASC
	);
$$
LANGUAGE sql STABLE STRICT;


CREATE OR REPLACE FUNCTION search_brands ()
RETURNS text AS $$
DECLARE
	v_brands				brand[];
	v_response				jsonb;
BEGIN
	
	v_brands := get_brands();
	
	v_response := jsonb_build_object (
		'brands', array_to_json(v_brands)
	);

	RETURN v_response::text;
END;
$$ LANGUAGE plpgsql STABLE