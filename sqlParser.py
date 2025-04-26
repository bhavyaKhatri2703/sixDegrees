import re
import pandas as pd

page_rows = []
with open("/home/bhavya/Downloads/enwiki-latest-page.sql", "r", encoding="utf-8") as f:
    for line in f:
        if line.startswith("INSERT INTO"):
            # Adjust regex to capture the page_id, namespace, title, and is_redirect
            values = re.findall(r'\((\d+),(\d+),\'(.*?)\',(\d+)', line)
            for v in values:
                page_id = int(v[0])
                namespace = int(v[1])
                title = v[2].replace("_", " ")  # Clean up title
                is_redirect = int(v[3])  # Capture the is_redirect value

                if namespace == 0:  # Only main namespace articles
                    page_rows.append((page_id, title, is_redirect))

# Save to CSV
df_pages = pd.DataFrame(page_rows, columns=["id", "title", "redirect"])
df_pages.to_csv("pages.csv", index=False)

print(f"Saved {len(df_pages)} mainspace pages to pages.csv")
