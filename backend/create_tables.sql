/* TO RUN IN POSTGRESQL */
/* sudo -i -u postgres psql -f /wsl.localhost/Ubuntu/root/biology_clinic/backend/create_tables.sql */

/* TO confirm table creation*/
/* 

sudo -i -u postgres psql
\c Genventory
\dt                     

 */

CREATE TABLE Strains (
    strain_id SERIAL PRIMARY KEY,
    name VARCHAR,
    type VARCHAR,
    location VARCHAR,
    source VARCHAR,
    acquisition_date DATE,
    notes TEXT
);

CREATE TABLE Alleles (
    allele_id SERIAL PRIMARY KEY,
    description TEXT,
    notes TEXT
);

CREATE TABLE StrainAlleles (
    strain_id INTEGER REFERENCES Strains(strain_id),
    allele_id INTEGER REFERENCES Alleles(allele_id),
    PRIMARY KEY (strain_id, allele_id)
);

CREATE TABLE Plasmids (
    plasmid_id SERIAL PRIMARY KEY,
    name VARCHAR,
    notes TEXT
);

CREATE TABLE Images (
    image_id SERIAL PRIMARY KEY,
    file_name VARCHAR,
    description TEXT,
    capture_date DATE,
    associated_strain_id INTEGER REFERENCES Strains(strain_id),
    notes TEXT
);

CREATE TABLE StorageLogs (
    log_id SERIAL PRIMARY KEY,
    item_type VARCHAR,
    item_id INTEGER,
    action VARCHAR,
    date DATE,
    handled_by VARCHAR,
    location VARCHAR
);

