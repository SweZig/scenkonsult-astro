-- LED-trailers byts: 15 m² (SK-BLD-0011) → 11 m² (SK-BLD-0017),
-- 28 m² (SK-BLD-0012) → 21 m² (SK-BLD-0018). De gamla är utgångna i bild.json.
-- Topplistan pekar om till de nya artiklarna, i samma ordning.
-- Körs i Supabase SQL editor FÖRE push, annars skriver bygget tillbaka de gamla.

UPDATE popular_group_items SET artno = 'SK-BLD-0017'
WHERE artno = 'SK-BLD-0011';

UPDATE popular_group_items SET artno = 'SK-BLD-0018'
WHERE artno = 'SK-BLD-0012';

-- Kontroll: ska ge 0 rader
SELECT group_id, artno FROM popular_group_items
WHERE artno IN ('SK-BLD-0011','SK-BLD-0012');
