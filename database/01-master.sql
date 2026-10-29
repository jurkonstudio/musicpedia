-- ========== 1. MASTER: BAHASA, REGION, NEGARA ==========
CREATE TABLE languages (
  code        text PRIMARY KEY,            -- id, en, es, pt, ja, ko, ar
  name        text NOT NULL,
  native_name text NOT NULL,
  dir         text NOT NULL DEFAULT 'ltr', -- ltr / rtl
  is_active   boolean DEFAULT true
);

CREATE TABLE regions (                     -- world, asia, europe, americas, africa, oceania
  id    serial PRIMARY KEY,
  slug  text UNIQUE NOT NULL,
  name  jsonb NOT NULL
);

CREATE TABLE countries (
  code         char(2) PRIMARY KEY,        -- ISO 3166-1: ID, JP, KR, US, GB
  region_id    int REFERENCES regions(id),
  sub_region   text,                       -- southeast-asia, east-asia, dst
  slug         text UNIQUE NOT NULL,
  name         jsonb NOT NULL,
  default_lang text REFERENCES languages(code)
);
