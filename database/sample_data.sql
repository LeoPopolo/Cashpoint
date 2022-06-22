INSERT INTO brand (id, name) VALUES (100, 'Coca Cola Company'), (101, 'Bagley'), (102, 'Terrabusi'), (103, 'Diversion');

SELECT create_product('Coca Cola','2.5L',250,500,'1111',100);
SELECT create_product('Fanta','2.5L',250,500,'1112',100);
SELECT create_product('Sprite','2.5L',250,500,'1113',100);
SELECT create_product('Surtido Bagley','400gr',180,500,'1114',101);
SELECT create_product('Variedad Terrabusi','400gr',190,500,'1115',102);
SELECT create_product('Surtido Diversion','450gr',160,500,'1116',103);

INSERT INTO system_user (username, name, surname, email, role, password) 
VALUES ('admin', 'user', 'administrator', 'admin@admin.com', 'admin', '$2a$10$vBoeuG9MMzYa5.oa9FI4W.MZaDZLSfSVOMhkgf7.9jgEgO7As3U6G');

INSERT INTO customer (id, name, identifier, phone_number, iva_responsability) 
VALUES (1, 'CONSUMIDOR FINAL', '--', '--', 'CONSUMIDOR FINAL');

SELECT create_cash_register(200);
