CREATE TABLE system_user (
    username        text,
    name            text,
    surname         text,
    email           text,
    role            text,
    password        text,
    deleted         boolean DEFAULT FALSE
) INHERITS (
	core_object
);

ALTER TABLE system_user
ADD CONSTRAINT UQ_user_username 
UNIQUE (username);

ALTER TABLE system_user
ADD CONSTRAINT UQ_user_email
UNIQUE (email);

INSERT INTO system_user (username, name, surname, email, role, password) 
VALUES ('admin', 'user', 'administrator', 'admin@admin.com', 'admin', '$2a$10$vBoeuG9MMzYa5.oa9FI4W.MZaDZLSfSVOMhkgf7.9jgEgO7As3U6G');