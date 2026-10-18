import urllib.request
import json
import os

BOOK_IDS = [
    "gen", "exo", "lev", "num", "deu", "jos", "jdg", "rut", "1sa", "2sa",
    "1ki", "2ki", "1ch", "2ch", "ezr", "neh", "est", "job", "psa", "pro",
    "ecc", "sng", "isa", "jer", "lam", "ezk", "dan", "hos", "jol", "amo",
    "oba", "jon", "mic", "nam", "hab", "zep", "hag", "zec", "mal",
    "mat", "mrk", "luk", "jhn", "act", "rom", "1co", "2co", "gal", "eph",
    "php", "col", "1th", "2th", "1ti", "2ti", "tit", "phm", "heb", "jas",
    "1pe", "2pe", "1jn", "2jn", "3jn", "jud", "rev"
]

url = "https://raw.githubusercontent.com/shemmjunior/swahili-bible-edition/main/json/full_version/swahili-bible-edition.json"
req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})

print("Downloading Swahili Bible from GitHub...")
with urllib.request.urlopen(req) as resp:
    raw_data = json.loads(resp.read().decode("utf-8"))

converted = []
bible_books = raw_data.get("BIBLEBOOK", [])
print(f"Downloaded {len(bible_books)} books. Converting...")

for b in bible_books:
    num = int(b.get("book_number", 0))
    name = b.get("book_name", "").strip()
    testament = "OT" if num <= 39 else "NT"
    book_id = BOOK_IDS[num - 1] if 1 <= num <= len(BOOK_IDS) else f"b{num}"

    chaps_input = b.get("CHAPTER", [])
    if isinstance(chaps_input, dict):
        chaps_input = [chaps_input]
    elif not isinstance(chaps_input, list):
        chaps_input = []

    chapters = []
    for c in chaps_input:
        if not isinstance(c, dict):
            continue
        c_num = int(c.get("chapter_number", 0))
        verses_input = c.get("VERSES", [])
        if isinstance(verses_input, dict):
            verses_input = [verses_input]
        elif not isinstance(verses_input, list):
            verses_input = []

        verses = []
        for v in verses_input:
            if not isinstance(v, dict):
                continue
            v_num = int(v.get("verse_number", 0))
            v_text = v.get("verse_text", "").strip()
            verses.append({"verseNumber": v_num, "text": v_text})
        chapters.append({"chapterNumber": c_num, "verses": verses})

    converted.append({
        "id": book_id,
        "name": name,
        "testament": testament,
        "chapters": chapters
    })

target_path = "/Users/rn/Github/true-north/android/app/src/main/assets/scriptures_sw.json"
os.makedirs(os.path.dirname(target_path), exist_ok=True)

with open(target_path, "w", encoding="utf-8") as f:
    json.dump(converted, f, ensure_ascii=False, separators=(",", ":"))

total_verses = sum(len(c["verses"]) for b in converted for c in b["chapters"])
file_size_mb = os.path.getsize(target_path) / (1024 * 1024)
print(f"Saved {len(converted)} books and {total_verses} verses to {target_path} ({file_size_mb:.2f} MB)")
