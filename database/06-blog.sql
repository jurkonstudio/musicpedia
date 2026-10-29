-- ========== 6. BLOG ==========
CREATE TABLE authors (
  id    serial PRIMARY KEY,
  name  text NOT NULL,
  bio   text,
  photo text
);

CREATE TABLE post_categories (
  id   serial PRIMARY KEY,
  slug text UNIQUE NOT NULL,               -- berita, tutorial-chord, ulasan, sejarah
  name jsonb NOT NULL
);

CREATE TABLE posts (
  id           bigserial PRIMARY KEY,
  slug         text UNIQUE NOT NULL,
  category_id  int REFERENCES post_categories(id),
  author_id    int REFERENCES authors(id),
  title        jsonb NOT NULL,
  excerpt      jsonb,
  body         jsonb NOT NULL,             -- markdown per bahasa
  cover_url    text,
  seo          jsonb,                      -- {"title":{},"description":{}}
  related_artist_id bigint REFERENCES artists(id),
  related_song_id   bigint REFERENCES songs(id),
  status       text DEFAULT 'draft',
  published_at timestamptz,
  views        bigint DEFAULT 0
);

CREATE TABLE post_tags (
  post_id bigint REFERENCES posts(id) ON DELETE CASCADE,
  tag_id  int    REFERENCES tags(id)  ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);
