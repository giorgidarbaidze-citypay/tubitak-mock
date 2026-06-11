import express from "express";
import router from "./router";
import { syncMockExpectations } from "./sync-expectations";
import { initializeDatabase } from "./db";

const app = express();
const PORT = process.env["MOCK_SERVER_URL"] || 9987;

app.use(express.json());
app.use(router);

app.listen(PORT, async () => {
  await initializeDatabase();
  await syncMockExpectations();

  console.log(
    `TÜBİTAK Travel Rule (KTDM) Mock Server listening at http://localhost:${PORT}`,
  );
});
