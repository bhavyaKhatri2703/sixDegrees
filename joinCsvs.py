import duckdb

duckdb.sql("""
    COPY (
        SELECT f1.from, f2.id
        FROM read_csv('redirects.csv', HEADER=true, DELIM=',', QUOTE='"') AS f1
        INNER JOIN read_csv('pages1.csv', HEADER=true, DELIM=',', QUOTE='"') AS f2
        ON f1.to = f2.title
    ) TO 'redirects_relations.csv' WITH (HEADER, DELIMITER ',');
""")
