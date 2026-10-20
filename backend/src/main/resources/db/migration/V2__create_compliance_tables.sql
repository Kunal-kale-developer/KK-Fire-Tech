CREATE TABLE agencies (
                          id BIGSERIAL PRIMARY KEY,
                          org_id BIGINT NOT NULL,
                          licence_no TEXT NOT NULL,
                          valid_from DATE NOT NULL,
                          valid_to DATE NOT NULL,
                          signatory_name TEXT NOT NULL,
                          UNIQUE (org_id, licence_no)
);

CREATE TABLE buildings (
                           id BIGSERIAL PRIMARY KEY,
                           org_id BIGINT NOT NULL,
                           agency_id BIGINT REFERENCES agencies(id),
                           name TEXT NOT NULL,
                           address TEXT NOT NULL,
                           segment TEXT NOT NULL CHECK (segment IN ('RESIDENTIAL','COMMERCIAL','INDUSTRIAL')),
                           jurisdiction TEXT NOT NULL CHECK (jurisdiction IN ('PMC','PCMC','MIDC','OTHER')),
                           owner_name TEXT,
                           owner_phone TEXT,
                           onboarded_on DATE NOT NULL DEFAULT current_date,
                           created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE building_units (
                                id BIGSERIAL PRIMARY KEY,
                                building_id BIGINT NOT NULL REFERENCES buildings(id),
                                name TEXT NOT NULL,
                                height_m NUMERIC,
                                UNIQUE (building_id, name)
);

CREATE TABLE compliance_cycles (
                                   id BIGSERIAL PRIMARY KEY,
                                   org_id BIGINT NOT NULL,
                                   building_id BIGINT NOT NULL REFERENCES buildings(id),
                                   year INT NOT NULL,
                                   half SMALLINT NOT NULL CHECK (half IN (1,2)),
                                   period_start DATE NOT NULL,
                                   period_end DATE NOT NULL,
                                   due_date DATE NOT NULL,
                                   UNIQUE (building_id, year, half)
);

CREATE INDEX idx_buildings_org ON buildings(org_id);
CREATE INDEX idx_cycles_org_period ON compliance_cycles(org_id, period_start, period_end);