CREATE TABLE users (
                       id BIGSERIAL PRIMARY KEY,
                       org_id BIGINT NOT NULL DEFAULT 1,
                       name VARCHAR(255) NOT NULL,
                       email VARCHAR(255) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       role VARCHAR(255) NOT NULL,
                       created_at TIMESTAMP NOT NULL
);