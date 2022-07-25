CREATE TABLE login (
    username VARCHAR(150) NOT NULL,
    version SMALLINT NOT NULL,
    salt TEXT NOT NULL,
    password TEXT NOT NULL,
    CONSTRAINT pk_login
        PRIMARY KEY (username)
);

CREATE TABLE login_session (
    login_session_uuid UUID NOT NULL,
    username VARCHAR(150) NOT NULL,
    login_nonce TEXT NOT NULL,
    server_nonce TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT pk_login_session
        PRIMARY KEY (login_session_uuid),
    CONSTRAINT fk_login_session___login
        FOREIGN KEY (username)
        REFERENCES login (username)
        ON DELETE NO ACTION
        ON UPDATE CASCADE
);

CREATE TABLE password_change (
    username VARCHAR(150),
    private_key TEXT,
    CONSTRAINT pk_password_change
        PRIMARY KEY (username),
    CONSTRAINT fk_password_change___login
        FOREIGN KEY (username)
        REFERENCES login (username)
        ON DELETE NO ACTION
        ON UPDATE CASCADE
);