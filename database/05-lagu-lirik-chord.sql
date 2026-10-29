-- ========== 5. LAGU ==========
CREATE TABLE songs (
  id            bigserial PRIMARY KEY,
  slug          text NOT NULL,             -- url: /chord/{artist-slug}/{slug}
  title         text NOT NULL,
  artist_id     bigint NOT NULL REFERENCES artists(id),
  album_id      bigint REFERENCES albums(id),
  year          int,
  country_code  char(2) REFERENCES countries(code),
  original_lang text REFERENCES languages(code),
  songwriters   text[],
  duration_sec  int,
  youtube_id    text,
  spotify_id    text,
  has_chord     boolean DEFAULT false,
  has_lyrics    boolean DEFAULT false,
  has_translation boolean DEFAULT false,
  status        text DEFAULT 'draft' CHECK (status IN ('draft','review','published')),
  views_total   bigint DEFAULT 0,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now(),
  UNIQUE (artist_id, slug)
);

CREATE TABLE song_genres (
  song_id  bigint REFERENCES songs(id)  ON DELETE CASCADE,
  genre_id int    REFERENCES genres(id) ON DELETE CASCADE,
  PRIMARY KEY (song_id, genre_id)
);

-- Lirik asli + terjemahan (Indonesia, Inggris, dst) dalam satu tabel
CREATE TABLE song_lyrics (
  id            bigserial PRIMARY KEY,
  song_id       bigint NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  lang          text NOT NULL REFERENCES languages(code),
  kind          text NOT NULL CHECK (kind IN ('original','translation','romanization')),
  content       text NOT NULL,             -- baris per baris, selaras dengan lirik asli
  translator    text,
  review_status text DEFAULT 'pending' CHECK (review_status IN ('pending','approved','rejected')),
  updated_at    timestamptz DEFAULT now(),
  UNIQUE (song_id, lang, kind)
);

-- Chord format ChordPro: "[C]Kata [G]lirik" — transpose dilakukan di browser
CREATE TABLE song_chords (
  id           bigserial PRIMARY KEY,
  song_id      bigint NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  version      int DEFAULT 1,
  instrument   text DEFAULT 'guitar' CHECK (instrument IN ('guitar','ukulele','piano','bass')),
  original_key text,                       -- C, G, Am
  capo         int DEFAULT 0,
  tuning       text DEFAULT 'EADGBE',
  tempo_bpm    int,
  time_sig     text DEFAULT '4/4',
  difficulty   text CHECK (difficulty IN ('beginner','intermediate','advanced')),
  content      text NOT NULL,              -- ChordPro
  author       text,
  is_primary   boolean DEFAULT true,
  views        bigint DEFAULT 0,
  updated_at   timestamptz DEFAULT now()
);

-- Kamus bentuk chord (diagram jari)
CREATE TABLE chord_dictionary (
  id         serial PRIMARY KEY,
  name       text NOT NULL,                -- Am, F#m7, Cadd9
  root       text NOT NULL,
  quality    text NOT NULL,                -- major, minor, 7, maj7, sus4
  instrument text NOT NULL DEFAULT 'guitar',
  fingering  jsonb NOT NULL,               -- {"frets":[-1,0,2,2,1,0],"fingers":[0,0,2,3,1,0],"barre":null}
  UNIQUE (name, instrument)
);
