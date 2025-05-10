import express from "express";
import cors from "cors"; 
import { getShortestPaths } from "./neo4j/connection.js";

const app = express();

app.use(cors()); 
app.use(express.json());

app.post('/', async (req, res) => {
  const { startPage, endPage } = req.body;
  console.log("Start:", startPage);
  console.log("End:", endPage);

 const result = await getShortestPaths(startPage.pageid.toString(),endPage.pageid.toString())

  console.log(result)

  res.status(200).json({ message: "Received", startPage, endPage,result });
});

app.listen(3000, () => console.log(`Server running on http://localhost:3000`));
