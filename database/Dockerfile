FROM postgres:16-bullseye

ADD pg_hba.conf /var/lib/postgresql/data/
ADD postgresql.conf /var/lib/postgresql/data/

COPY init.sql /docker-entrypoint-initdb.d/