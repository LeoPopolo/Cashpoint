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