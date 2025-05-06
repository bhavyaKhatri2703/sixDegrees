import csv

# Open the original CSV file for reading
with open('pages.csv', 'r', newline='', encoding='utf-8') as infile:
    # Read the CSV file
    reader = csv.reader(infile)
    
    # Open a new file to write the fixed CSV data
    with open('pages_fixed1.csv', 'w', newline='', encoding='utf-8') as outfile:
        writer = csv.writer(outfile)
        
        # Iterate over each row in the CSV file
        for row in reader:
            # Iterate through each field in the row
            for i in range(len(row)):
                # Replace escaped quotes (\" -> "") correctly
                row[i] = row[i].replace(r'\"', '"')
                row[i] = row[i].replace('_',' ')
            
            # Write the fixed row to the new file
            writer.writerow(row)

print("CSV has been fixed and saved to 'pages_fixed.csv'")
