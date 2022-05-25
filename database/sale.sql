CREATE TYPE sale_item AS (
    product_id          int,
    quantity            int
);

CREATE TABLE sale (
    products            sale_item[],
    user_owner_id       int,
    total               real,
    payment_method      text,
    status              text,
    discount            real
) INHERITS (
	core_object
);

-- SELECT array_to_json(products) FROM sale;

CREATE OR REPLACE FUNCTION create_sale(
    p_items				    sale_item[],
    p_user_owner_id    	    int,
    p_payment_method     	text,
    p_discount  			real
)
RETURNS text AS $$
DECLARE
    v_item 				    sale_item;
    v_price				    real;
    v_response				record;
    v_total				    real DEFAULT 0;
BEGIN
    FOREACH v_item IN ARRAY p_items
    LOOP
        SELECT price INTO v_price FROM product WHERE id = v_item.product_id;
        
        v_total := v_total + (v_item.quantity * v_price);
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
        'open',
        p_discount
    ) RETURNING * INTO v_response;
    
    RETURN json_build_object(
        'id', v_response.id,
        'total', v_response.total
    )::text;
END$$
LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION close_sale(
    p_sale_id				int,
    p_payment_method    	text,
	p_discount				real
)
RETURNS void AS $$
DECLARE
    v_item 				    sale_item;
	v_items 				sale_item[];
    v_price				    real;
	v_total					real DEFAULT 0;
	v_sale_status			text;
	v_current_stock			int;
BEGIN

	SELECT products, status
	INTO v_items, v_sale_status
	FROM sale
	WHERE id = p_sale_id;
		
	IF v_sale_status = 'closed' THEN
		RAISE EXCEPTION 'Sale already closed';
	END IF;

    FOREACH v_item IN ARRAY v_items
    LOOP
        SELECT stock, price INTO v_current_stock, v_price FROM product WHERE id = v_item.product_id;
        
        v_total := v_total + (v_item.quantity * v_price);
		
		IF v_current_stock >= v_item.quantity THEN
            UPDATE product SET stock = v_current_stock - v_item.quantity WHERE id = v_item.product_id;
        ELSE
            RAISE EXCEPTION 'Not enough stock of product with id = %', v_item.product_id;
        END IF;
    END LOOP;
	
	IF p_discount > 0 THEN
        v_total := v_total - (v_total * p_discount / 100);
    END IF;
    
	UPDATE sale
	SET status = 'closed', 
		payment_method = p_payment_method, 
		discount = p_discount,
		total = v_total
	WHERE id = p_sale_id;
END$$
LANGUAGE plpgsql;