CREATE TABLE customer (
    name                    text NOT NULL,
    identifier              text,
    phone_number            text,
    iva_responsability      text,
    deleted                 boolean DEFAULT FALSE
) INHERITS (
    core_object
);

ALTER TABLE customer
ADD CONSTRAINT UQ_customer_identifier 
UNIQUE (identifier);

CREATE OR REPLACE FUNCTION get_customer_by_id (
    p_id                        int
)
RETURNS customer AS $$
    SELECT c FROM customer c
        WHERE id = p_id
$$
LANGUAGE sql STABLE STRICT
SET search_path FROM CURRENT;

CREATE OR REPLACE FUNCTION customer_identify_by_id (
    p_id                    int
)
RETURNS text AS $$
DECLARE
	v_customer				customer;
	v_response				jsonb;
BEGIN

	v_customer := get_customer_by_id(p_id);
	
	v_response := to_json(v_customer);
	
	RETURN v_response::text;
END;
$$ LANGUAGE plpgsql STABLE
SET search_path FROM CURRENT;