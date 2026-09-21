# Spec-generator

Bygger `Scenkonsult_Spec_Dok1–6` som .docx.

```bash
pip install python-docx --break-system-packages   # en gång
python3 spec_builder.py "../Claude outputs"
```

| Fil | Roll |
|---|---|
| `spec_builder.py` | Formatmall och rendering. Blocktyper: `h1`, `h2`, `p`, `ul`, `table`, `note`, `code`. |
| `spec_content.py` | Samlar de sex dokumenten. |
| `spec_doc1.py` … `spec_doc6.py` | Innehållet, ett dokument per fil. |

**Vid uppdatering:** ändra i rätt `spec_docN.py`, bumpa `version` och `date`,
lägg en rad i dokumentets ändringshistorik, och kör om. Uppdatera **projektets
instruktionsfält** i samma svep — se Dok 6 §7.5.

Text i `p`, `ul`, `note` och tabellceller stödjer `**fet**` och `` `kod` ``.
