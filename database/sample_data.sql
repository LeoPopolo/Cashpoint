INSERT INTO product (
                        name,description,price,stock,barcode,brand
                    ) 
                    VALUES 
                    (
                        'Coca Cola','2.5L',250,500,'1111','Coca Cola Company'
                    ),
                    (
                        'Fanta','2.5L',250,500,'1112','Coca Cola Company'
                    ),
                    (
                        'Sprite','2.5L',250,500,'1113','Coca Cola Company'
                    ),
                    (
                        'Surtido Bagley','400gr',180,500,'1114','Bagley'
                    ),
                    (
                        'Variedad Terrabusi','400gr',190,500,'1115','Terrabusi'
                    ),
                    (
                        'Surtido Diversion','450gr',160,500,'1116','Diversion'
                    );

INSERT INTO system_user (username, name, surname, email, role, password) 
VALUES ('admin', 'user', 'administrator', 'admin@admin.com', 'admin', '$2a$10$vBoeuG9MMzYa5.oa9FI4W.MZaDZLSfSVOMhkgf7.9jgEgO7As3U6G');

INSERT INTO customer (id, name, identifier, phone_number, iva_responsability) 
VALUES (1, 'CONSUMIDOR FINAL', '--', '--', 'CONSUMIDOR FINAL');

SELECT create_cash_register(200);
