-- ========== 4. ALBUM ==========
CREATE TABLE albums (
  id           bigserial PRIMARY KEY,
  slug         text UNIQUE NOT NULL,
  title        text NOT NULL,
  artist_id    bigint NOT NULL REFERENCES artists(id),
  album_type   text DEFAULT 'album' CHECK (album_type IN ('album','ep','single','compilation','live')),
  release_date date,
  year         int,
  label        text,
  cover_url    text,
  description  jsonb
);
