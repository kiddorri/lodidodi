-- Demo data for the EcoTrack map. Coordinates are approximate points
-- within Uralsk (Oral), Kazakhstan — good enough for a hackathon demo.

insert into collection_points (name, lat, lng, type) values
  ('Мусоросортировочная станция «Уральск»', 51.2200, 51.3800, 'sorting'),
  ('Пункт переработки пластика и стекла', 51.2450, 51.3550, 'recycling'),
  ('Контейнерная площадка, ул. Достык', 51.2333, 51.3667, 'collection');
