-- ========== 8. INDEKS & SEO ==========
CREATE INDEX idx_songs_artist   ON songs(artist_id);
CREATE INDEX idx_songs_album    ON songs(album_id);
CREATE INDEX idx_songs_country  ON songs(country_code, year);
CREATE INDEX idx_songs_status   ON songs(status);
CREATE INDEX idx_views_day      ON song_views_daily(day, country_code);
CREATE INDEX idx_trend_lookup   ON trending_snapshots(scope, metric, period, region_id, country_code, rank);
CREATE INDEX idx_artists_country ON artists(country_code);
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX idx_songs_title_trgm   ON songs   USING gin (title gin_trgm_ops);
CREATE INDEX idx_artists_name_trgm  ON artists USING gin (name  gin_trgm_ops);

-- Sumber data sitemap.xml (per bahasa, untuk hreflang)
CREATE VIEW v_sitemap AS
  SELECT '/chord/' || a.slug || '/' || s.slug AS path, s.updated_at AS lastmod, 'song' AS type
  FROM songs s JOIN artists a ON a.id = s.artist_id WHERE s.status = 'published'
  UNION ALL SELECT '/artis/' || slug, updated_at, 'artist' FROM artists
  UNION ALL SELECT '/blog/' || slug, published_at, 'post' FROM posts WHERE status = 'published';
