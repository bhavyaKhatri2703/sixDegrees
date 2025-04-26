import re
import pandas as pd

page_rows = []
with open("/home/bhavya/Downloads/enwiki-latest-redirect.sql", "r", encoding="utf-8") as f:
    for line in f:
        if line.startswith("INSERT INTO"):
            # Adjust regex to capture the page_id, namespace, title, and is_redirect
            values = re.findall(r'\((\d+),(\d+),\'(.*?)\'', line)
            for v in values:
                from_page_id = int(v[0])
                namespace = int(v[1])
                to_title = v[2].replace("_", " ")  # Clean up title
                if namespace == 0:  # Only main namespace articles
                    page_rows.append((from_page_id, to_title))

# Save to CSV
df_pages = pd.DataFrame(page_rows, columns=["from", "to"])
df_pages.to_csv("redirects.csv", index=False)

print(f"Saved {len(df_pages)} mainspace pages to pages.csv")
