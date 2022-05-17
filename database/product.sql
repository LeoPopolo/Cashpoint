CREATE TABLE product (
    id              serial,
    name            text NOT NULL,
    description     text,
    price           real NOT NULL,
    stock           int NOT NULL,
    barcode         text,
    deleted         boolean
);

ALTER TABLE product
ADD CONSTRAINT UQ_product_name 
UNIQUE (name);

ALTER TABLE product
ADD CONSTRAINT UQ_product_barcode 
UNIQUE (barcode);