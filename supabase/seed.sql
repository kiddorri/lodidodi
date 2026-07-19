-- Demo data for the EcoTrack / AI Sort map. Real waste infrastructure
-- points for Uralsk (Oral), Kazakhstan, gathered from public research.
-- The two "collection" rows are representative examples, not addresses of
-- specific containers — the city has 750+ container sites and no open
-- dataset lists them individually.

-- Re-runnable: clear any previous demo rows first. waste_items.nearest_point_id
-- has no ON DELETE CASCADE, so detach references before deleting.
update waste_items set nearest_point_id = null;
delete from collection_points;

insert into collection_points (name, lat, lng, type) values
  ('Полигон ТБО и МСК «ICM Recycling»', 51.1899056, 51.219866, 'landfill'),
  ('Экопункт «Таза Орал» — ул. А. Кердери, 133', 51.214735, 51.3769898, 'recycling'),
  ('Экопункт «Таза Орал» — ул. М. Монкеулы, 77', 51.178336, 51.2945149, 'recycling'),
  ('Экопункт «Таза Орал» — мкр Кадыра Мырза Али', 51.2491403, 51.4258449, 'recycling'),
  ('ИП «Zhayik Polimer» (приём вторсырья)', 51.2403617, 51.382356, 'recycling'),
  ('Контейнерная площадка, ул. Достык', 51.2333, 51.3667, 'collection'),
  ('Контейнерная площадка, ул. Фрунзе', 51.228, 51.37, 'collection');
