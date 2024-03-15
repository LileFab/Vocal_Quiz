CREATE USER superdevuser;
CREATE DATABASE superdevdb;
GRANT ALL PRIVILEGES ON DATABASE superdevdb TO superdevuser;
ALTER USER superdevuser with PASSWORD 'P@ssword1';
ALTER USER postgres with PASSWORD 'P@ssword1';
