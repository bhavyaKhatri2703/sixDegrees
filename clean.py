import csv

# Step 1: Read all valid page IDs into a set
valid_ids = set()
with open("pages1.csv", "r", encoding="utf-8") as f:
    reader = csv.DictReader(f)
    for row in reader:
        valid_ids.add(int(row["id"]))

print(f"Loaded {len(valid_ids)} valid page IDs.")

# Step 2: Stream pagelinks.csv and filter
with open("redirects_relations.csv", "r", encoding="utf-8") as infile, \
     open("redirects_relations_fixed.csv", "w", newline='', encoding="utf-8") as outfile:

    reader = csv.DictReader(infile)
    writer = csv.DictWriter(outfile, fieldnames=[":START_ID", ":END_ID"])
    writer.writeheader()

    count_in = 0
    count_out = 0

    for row in reader:
        count_in += 1
        source = int(row[":START_ID"])
        target = int(row[":END_ID"])
        if source in valid_ids and target in valid_ids:
            writer.writerow({":START_ID": source, ":END_ID": target})
            count_out += 1

        if count_in % 100000 == 0:
            print(f"Checked {count_in} links, kept {count_out} valid links.")

print(f"Done. Kept {count_out} valid links out of {count_in} total.")
