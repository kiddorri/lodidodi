-- Demo data for the EcoTrack / AI Sort map. Real waste infrastructure
-- points for Uralsk (Oral), Kazakhstan, gathered from public research.
-- The two "collection" rows are representative examples, not addresses of
-- specific containers — the city has 750+ container sites and no open
-- dataset lists them individually.
--
-- Collection points use fixed UUIDs so the demo route below (and the mock in
-- lib/mockRoutes.ts) can reference them by a stable id.

-- Re-runnable: clear previous demo rows first, in FK-safe order.
delete from route_points;
delete from routes;
delete from trucks;
update waste_items set nearest_point_id = null;
delete from collection_points;

insert into collection_points (id, name, lat, lng, type) values
  ('11111111-1111-1111-1111-111111111101', 'Полигон ТБО и МСК «ICM Recycling»', 51.1899056, 51.219866, 'landfill'),
  ('11111111-1111-1111-1111-111111111102', 'Экопункт «Таза Орал» — ул. А. Кердери, 133', 51.214735, 51.3769898, 'recycling'),
  ('11111111-1111-1111-1111-111111111103', 'Экопункт «Таза Орал» — ул. М. Монкеулы, 77', 51.178336, 51.2945149, 'recycling'),
  ('11111111-1111-1111-1111-111111111104', 'Экопункт «Таза Орал» — мкр Кадыра Мырза Али', 51.2491403, 51.4258449, 'recycling'),
  ('11111111-1111-1111-1111-111111111105', 'ИП «Zhayik Polimer» (приём вторсырья)', 51.2403617, 51.382356, 'recycling'),
  ('11111111-1111-1111-1111-111111111106', 'Контейнерная площадка, ул. Достык', 51.2333, 51.3667, 'collection'),
  ('11111111-1111-1111-1111-111111111107', 'Контейнерная площадка, ул. Фрунзе', 51.228, 51.37, 'collection');

-- One demo truck and an in-progress route from the ул. Достык collection point
-- to the ICM Recycling landfill, carrying the default mixed municipal waste.
insert into trucks (id, plate_number, driver_name) values
  ('22222222-2222-2222-2222-222222222201', '911 ABC 07', 'Ержан Сапаров');

insert into routes
  (id, truck_id, status, origin_point_id, destination_point_id, cargo_type, started_at)
values
  ('33333333-3333-3333-3333-333333333301',
   '22222222-2222-2222-2222-222222222201',
   'in_progress',
   '11111111-1111-1111-1111-111111111106',
   '11111111-1111-1111-1111-111111111101',
   'Смешанные ТБО',
   '2026-07-20T08:15:00+05:00');
