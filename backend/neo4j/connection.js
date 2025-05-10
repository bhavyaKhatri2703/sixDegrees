import neo4j from "neo4j-driver";

const url = "bolt://localhost:7687";
const user = "neo4j";
const password = "bhavi123";

const driver= neo4j.driver(url, neo4j.auth.basic(user, password));



const allShortestPaths = `MATCH (start:Page {id: $id1}), (end:Page {id: $id2})
MATCH path = allShortestPaths((start)-[*]->(end))
RETURN path
`

function extractPath(segments)
{
    const path = []
    path.push(segments[0].start.properties)
    path.push(segments[0].end.properties)

    for(let i = 1 ; i<segments.length ; i++)
    {
        path.push(segments[i].end.properties)
    }

    return path

}

export async function getShortestPaths(start, end) {
    const result = await driver.executeQuery(
      allShortestPaths,
      { id1: start, id2: end },
      { database: 'neo4j' }
    );

    const allPaths = []

    for(let i = 0 ; i<result.records.length ; i++)
    {
       let path = extractPath(result.records[i].get('path').segments)
       allPaths.push(path)
    }

    return allPaths

  }

  console.log(await getShortestPaths('27040','66890'))


