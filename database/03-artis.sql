-- ========== 3. MUSISI / BAND ==========
CREATE TABLE artists (
  id           bigserial PRIMARY KEY,
  slug         text UNIQUE NOT NULL,
  name         text NOT NULL,
  type         text NOT NULL CHECK (type IN ('solo','band','duo','group','orchestra')),
  real_name    text,
  country_code char(2) REFERENCES countries(code),
  birth_date   date,
  origin_city  text,
  formed_year  int,
  disbanded_year int,
  bio          jsonb,                      -- biodata per bahasa
  image_url    text,
  socials      jsonb,                      -- {"instagram":"","youtube":"","spotify":""}
  members      jsonb,                      -- [{"name":"","role":"","years":""}]
  is_verified  boolean DEFAULT false,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

CREATE TABLE artist_genres (
  artist_id bigint REFERENCES artists(id) ON DELETE CASCADE,
  genre_id  int    REFERENCES genres(id)  ON DELETE CASCADE,
  PRIMARY KEY (artist_id, genre_id)
);
