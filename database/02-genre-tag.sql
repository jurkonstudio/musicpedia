-- ========== 2. GENRE & TAG ==========
CREATE TABLE genres (
  id        serial PRIMARY KEY,
  parent_id int REFERENCES genres(id),     -- Rock > Pop Punk
  slug      text UNIQUE NOT NULL,
  name      jsonb NOT NULL
);

CREATE TABLE tags (
  id   serial PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  name jsonb NOT NULL
);
