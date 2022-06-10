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