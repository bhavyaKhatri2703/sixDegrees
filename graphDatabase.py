from neo4j import GraphDatabase
import pandas as pd
from tqdm import tqdm

driver = GraphDatabase.driver("bolt://localhost:7687", auth=("neo4j", "bhavi@neo4j"))

df_pages = pd.read_csv("pages.csv")

def create_pages_batch(tx, pages_batch):
    query = """
    UNWIND $batch AS page
    MERGE (p:Page {id: page.id})
    SET p.title = page.title, p.is_redirect = page.redirect
    """
    tx.run(query, batch=pages_batch)

batch_size = 10000
total_batches = (len(df_pages) + batch_size - 1) // batch_size

with driver.session() as session:
    for i in tqdm(range(0, len(df_pages), batch_size), total=total_batches, desc="Inserting pages"):
        batch = df_pages.iloc[i:i+batch_size]
        pages_batch = batch.to_dict(orient="records")
        session.execute_write(create_pages_batch, pages_batch)

driver.close()
