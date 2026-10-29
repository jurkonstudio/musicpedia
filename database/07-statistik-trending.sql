-- ========== 7. STATISTIK & TRENDING ==========
-- Pencatatan tayangan harian per negara pengunjung
CREATE TABLE song_views_daily (
  song_id      bigint REFERENCES songs(id) ON DELETE CASCADE,
  country_code char(2),                    -- negara pengunjung
  day          date,
  chord_views  int DEFAULT 0,
  lyric_views  int DEFAULT 0,
  search_count int DEFAULT 0,
  PRIMARY KEY (song_id, country_code, day)
);

-- Hasil hitung Top 20 (diisi job harian / GitHub Actions)
CREATE TABLE trending_snapshots (
  id           bigserial PRIMARY KEY,
  scope        text NOT NULL CHECK (scope IN ('world','region','country')),
  region_id    int  REFERENCES regions(id),
  country_code char(2) REFERENCES countries(code),
  metric       text NOT NULL CHECK (metric IN ('chord','lyrics','translation')),
  period       text NOT NULL CHECK (period IN ('daily','weekly','monthly')),
  rank         int  NOT NULL CHECK (rank BETWEEN 1 AND 20),
  song_id      bigint NOT NULL REFERENCES songs(id),
  score        numeric,
  prev_rank    int,
  computed_at  timestamptz DEFAULT now()
);

-- Contoh query Top 20 chord Asia 7 hari terakhir
-- SELECT s.id, s.title, SUM(v.chord_views) AS score
-- FROM song_views_daily v
-- JOIN songs s ON s.id = v.song_id
-- JOIN countries c ON c.code = v.country_code
-- JOIN regions r ON r.id = c.region_id AND r.slug = 'asia'
-- WHERE v.day >= current_date - 7
-- GROUP BY s.id ORDER BY score DESC LIMIT 20;
