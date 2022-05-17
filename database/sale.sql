CREATE TYPE sale_item AS (
    product_id          int,
    quantity            int
);

CREATE TABLE sale (
    id                  serial,
    products            sale_item[],
    user_owner_id       int,
    total               real,
    payment_method      text,
    status              text,
    discount            real
);

INSERT INTO sale (products, user_owner_id, total, payment_method, status, discount) VALUES (array[(1, 2),(1, 2)]::sale_item[], 16, 440, 'efectivo', 'open', 0); 
SELECT array_to_json(products) FROM sale;