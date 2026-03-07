#!/usr/bin/env python3
"""
Scenkonsult – Bildnedladdning & optimering
Kör detta script från roten av scenkonsult-astro-mappen:
  python3 download_images.py

Kräver: pip install requests Pillow
"""

import os
import sys
import urllib.request
import urllib.error
from pathlib import Path

try:
    from PIL import Image
    HAS_PILLOW = True
except ImportError:
    HAS_PILLOW = False
    print("⚠  Pillow ej installerat – bilder sparas som PNG utan optimering.")
    print("   Installera med: pip3 install Pillow\n")

# ── Konfiguration ──────────────────────────────────────────────────────────────
BASE_URL   = "https://scenkonsult.se"
PUBLIC_DIR = Path("public/images")   # relativt scenkonsult-astro/
WEBP_QUALITY = 82                     # 0–100, 82 är ett bra default
# ──────────────────────────────────────────────────────────────────────────────

IMAGES = {
    # Logo
    "logo.png": "/wp-content/uploads/2023/06/scenkonsult-low-resolution-logo-white-on-transparent-background-180x180.png",

    # Scener – produktbilder
    "scen/scen_small.png":             "/wp-content/uploads/2025/12/Scen_small-1024x853.png",
    "scen/scen_small_plus.png":        "/wp-content/uploads/2025/12/Scen_small_plus-1024x853.png",
    "scen/scen_small_plus_plus.png":   "/wp-content/uploads/2025/12/Scen_small_plus_plus-1024x853.png",
    "scen/scen_medium.png":            "/wp-content/uploads/2025/12/Scen_medium-1024x853.png",
    "scen/scen_medium_plus.png":       "/wp-content/uploads/2025/12/Scen_medium_plus-1024x853.png",
    "scen/scen_medium_plus_med_tak.png": "/wp-content/uploads/2025/12/Scen_medium_plus_med_tak-1024x853.png",
    "scen/scen_medium_plus_plus.png":  "/wp-content/uploads/2025/12/Scen_medium_plus_plus-1024x853.png",
    "scen/scen_large.png":             "/wp-content/uploads/2025/12/Scen_large-1024x853.png",
    "scen/scen_large_plus.png":        "/wp-content/uploads/2025/12/Scen_large_plus-1024x853.png",
    "scen/scen_large_plus_med_tak.png": "/wp-content/uploads/2025/12/Scen_large_plus_med_tak-1024x853.png",
    "scen/scen_xl.png":                "/wp-content/uploads/2025/12/Scen_xl-1024x853.png",
    "scen/scen_xl_plus.png":           "/wp-content/uploads/2025/12/Scen_xl_plus-1024x853.png",
    "scen/scentrapp.png":              "/wp-content/uploads/2025/12/Scentrapp-1024x853.png",
    "scen/scenkjol.png":               "/wp-content/uploads/2025/12/Scenkjol-1024x853.png",
    "scen/backdrop.png":               "/wp-content/uploads/2025/12/Backdrop-1024x853.png",

    # Ljud – kategoribilder
    "ljud/plugg_event.png":     "/wp-content/uploads/2026/01/plugg_event-scaled.png",
    "ljud/plugg_live.png":      "/wp-content/uploads/2026/01/plugg_live-scaled.png",
    "ljud/plugg_music.png":     "/wp-content/uploads/2026/01/plugg_music-scaled.png",
    "ljud/plugg_portabelt.png": "/wp-content/uploads/2026/01/plugg_portabelt-scaled.png",
    "ljud/line_array.png":      "/wp-content/uploads/2025/08/Line_ArrayPNG.png",

    # Ljus – kategoribilder
    "ljus/plugg_paket.png":    "/wp-content/uploads/2026/01/plugg_paket-scaled.png",
    "ljus/plugg_effekter.png": "/wp-content/uploads/2026/01/plugg_effekter-scaled.png",
    "ljus/plugg_rok.png":      "/wp-content/uploads/2026/01/plugg_rok-scaled.png",
    "ljus/plugg_stativ.png":   "/wp-content/uploads/2026/01/plugg_t-stativ-tross-scaled.png",
    "ljus/ljus_storre.png":    "/wp-content/uploads/2026/01/pp_ljus_storre_event.png",

    # Startsida – karusellbilder
    "hero/karusell_01.jpg": "/wp-content/uploads/2025/12/Karusell_bild01_2512-scaled.png",
    "hero/karusell_02.jpg": "/wp-content/uploads/2025/10/Karusell_bild02-scaled-e1759332176564.png",
    "hero/karusell_03.jpg": "/wp-content/uploads/2025/10/Karusell_bild03-scaled-e1759332276863.png",
    "hero/karusell_04.jpg": "/wp-content/uploads/2025/10/Karusell_bild04-scaled.png",
    "hero/karusell_05.jpg": "/wp-content/uploads/2025/12/Karusell_bild05_2512-scaled-e1765920410283.png",
    "hero/karusell_06.jpg": "/wp-content/uploads/2025/12/Karusell_bild06_2512-scaled.png",

    # Pluggar – startsida
    "tjanster/plugg_scener.png":       "/wp-content/uploads/2025/08/plugg_scener.png",
    "tjanster/plugg_ljus.png":         "/wp-content/uploads/2025/08/plugg_ljus.png",
    "tjanster/plugg_event_ljud.png":   "/wp-content/uploads/2025/08/plugg_event-ljud2.png",
    "tjanster/plugg_live_ljud.png":    "/wp-content/uploads/2025/08/plugg_live-ljud2.png",
    "tjanster/plugg_dance_ljud.png":   "/wp-content/uploads/2025/08/plugg_dance-ljud2.png",
    "tjanster/plugg_portabelt.png":    "/wp-content/uploads/2025/08/plugg_portabelt-ljud2.png",
    "tjanster/plugg_bild.png":         "/wp-content/uploads/2025/08/plugg_bild.png",
    "tjanster/plugg_dj.png":           "/wp-content/uploads/2025/08/plugg_dj.png",

    # Prismärken (om du vill använda dem)
    "priser/pris_599.png":   "/wp-content/uploads/2025/09/Pris_599.png",
    "priser/pris_899.png":   "/wp-content/uploads/2025/09/Pris_899.png",
    "priser/pris_1199.png":  "/wp-content/uploads/2025/09/Pris_1199.png",
    "priser/pris_1499.png":  "/wp-content/uploads/2025/09/Pris_1499.png",
    "priser/pris_1799.png":  "/wp-content/uploads/2025/11/Pris_1799.png",
    "priser/pris_2399.png":  "/wp-content/uploads/2025/09/Pris_2399.png",
    "priser/pris_2999.png":  "/wp-content/uploads/2025/09/Pris_2999.png",
    "priser/pris_3599.png":  "/wp-content/uploads/2025/09/Pris_3599.png",
    "priser/pris_5399.png":  "/wp-content/uploads/2025/12/Pris_5399.png",
    "priser/pris_7199.png":  "/wp-content/uploads/2025/12/Pris_7199.png",
}


def sizeof_fmt(num):
    for unit in ("B", "KB", "MB"):
        if abs(num) < 1024.0:
            return f"{num:.0f} {unit}"
        num /= 1024.0
    return f"{num:.1f} GB"


def download_and_optimize(local_path: str, remote_path: str):
    dest = PUBLIC_DIR / local_path
    dest.parent.mkdir(parents=True, exist_ok=True)

    url = BASE_URL + remote_path
    tmp = dest.with_suffix(".tmp")

    # Download
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = resp.read()
        tmp.write_bytes(data)
    except Exception as e:
        print(f"  ✗  {local_path:50s}  NEDLADDNING MISSLYCKADES: {e}")
        return False

    original_size = len(data)

    # Optimize to WebP if Pillow available
    if HAS_PILLOW:
        try:
            webp_dest = dest.with_suffix(".webp")
            img = Image.open(tmp)

            # Resize if very large (max 1200px wide for product images)
            if img.width > 1200 and "hero" not in local_path:
                ratio = 1200 / img.width
                img = img.resize((1200, int(img.height * ratio)), Image.LANCZOS)

            img.save(webp_dest, "WEBP", quality=WEBP_QUALITY, method=6)
            webp_size = webp_dest.stat().st_size
            saving = (1 - webp_size / original_size) * 100
            print(f"  ✓  {local_path:50s}  {sizeof_fmt(original_size):>8} → {sizeof_fmt(webp_size):>8} WebP  (-{saving:.0f}%)")
            tmp.unlink()
            return True
        except Exception as e:
            print(f"  ⚠  {local_path:50s}  WebP-konvertering misslyckades: {e} – sparar PNG")

    # Fallback: keep original
    tmp.rename(dest)
    print(f"  ✓  {local_path:50s}  {sizeof_fmt(original_size):>8}")
    return True


def main():
    # Check we're in the right directory
    if not Path("astro.config.mjs").exists():
        print("❌  Kör scriptet från roten av scenkonsult-astro-mappen!")
        print(f"   Nuvarande mapp: {Path.cwd()}")
        sys.exit(1)

    PUBLIC_DIR.mkdir(parents=True, exist_ok=True)

    print(f"\n🖼  Laddar ned {len(IMAGES)} bilder från {BASE_URL}\n")
    print(f"   Destination: {PUBLIC_DIR.resolve()}\n")
    print("─" * 80)

    ok = 0
    fail = 0
    for local_path, remote_path in IMAGES.items():
        dest_webp = (PUBLIC_DIR / local_path).with_suffix(".webp")
        dest_png  = (PUBLIC_DIR / local_path)
        if dest_webp.exists() or dest_png.exists():
            print(f"  –  {local_path:50s}  (redan nedladdad)")
            ok += 1
            continue
        if download_and_optimize(local_path, remote_path):
            ok += 1
        else:
            fail += 1

    print("─" * 80)
    print(f"\n✅  Klart! {ok} bilder nedladdade, {fail} misslyckades.\n")

    if HAS_PILLOW:
        print("💡  Bilderna är konverterade till WebP och optimerade.")
        print("   Uppdatera referenserna i scenes.json från .png till .webp")
        print("   Exempel: '/images/scen/scen_small.png' → '/images/scen/scen_small.webp'\n")

    if fail > 0:
        print("⚠  Bilder som misslyckades kan ha ändrat URL i WordPress-mediebiblioteket.")
        print("   Logga in på WordPress admin → Media → hitta bilden → kopiera URL manuellt.\n")


if __name__ == "__main__":
    main()
