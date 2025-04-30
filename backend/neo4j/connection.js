import neo4j from "neo4j-driver";

const url = "bolt://localhost:7687";
const user = "neo4j";
const password = "bhavi123";

const driver= neo4j.driver(url, neo4j.auth.basic(user, password));


//  shortest distance 
const shortestPathQuery = `
  MATCH (start {id: $id1}), (end {id: $id2})
  MATCH path = allShortestPaths((start)-[*]-(end))
  RETURN path, length(path) AS distance
`;

// all paths

const allPathsQuery = `
  MATCH (start {id: $id1}), (end {id: $id2})
  MATCH path = (start)-[*]->(end)
  RETURN path, length(path) AS distance
  ORDER BY distance ASC
`;

async function getShortestPaths(start, end) {
    const result = await driver.executeQuery(
      shortestPathQuery,
      { id1: start, id2: end },
      { database: 'neo4j' }
    );

    console.log(result)
  
  }

  getShortestPaths("12","2633")