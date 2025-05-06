import re
import csv

line_count = 0
matched_line_count = 0

with open("/home/bhavya/Downloads/enwiki-latest-linktarget.sql", "r", encoding="utf-8") as infile, \
     open("targetlinks.csv", "w", newline='', encoding="utf-8") as outfile:

    writer = csv.writer(outfile)
    writer.writerow(["target", "namespace","title"])  # Write CSV header

    for line in infile:
        line_count += 1
        if line.startswith("INSERT INTO"):
            matched_line_count += 1
            values = re.findall(r'\((\d+),(-?\d+),\'(.*?)\'', line)
            for v in values:
                page_id = int(v[0])
                namespace = int(v[1])
                title = v[2]
                writer.writerow([page_id,namespace, title])

        if line_count % 1000 == 0:
            print(f"Processed {line_count} lines, matched {matched_line_count} INSERT lines")

print(f"Finished! All mainspace pagelinks saved.")
