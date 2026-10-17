-- Rättelse: två gruppingresser på bildhubben påstod att montering ingår.
-- Montering för LED-vägg och trailer är obligatorisk men debiteras.

UPDATE popular_groups SET
  lead = 'När bakersta raden sitter långt bak – stora projektordukar eller LED-vägg på tross.',
  updated_at = NOW()
WHERE id = 'pg-bild-stor-bild-inomhus';

UPDATE popular_groups SET
  lead = 'Full sol utan nedmörkning. Mobil LED-trailer, färdigriggad på plats – transport och montering tillkommer.',
  updated_at = NOW()
WHERE id = 'pg-bild-utomhus-dagsljus';
