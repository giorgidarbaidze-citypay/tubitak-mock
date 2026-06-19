import express from "express";
import router from "./router";
import { syncMockExpectations } from "./sync-expectations";
import { initializeDatabase } from "./db";
import { sendErrorResponse } from "./utils";

const app = express();
const PORT = process.env["MOCK_SERVER_URL"] || 9987;

app.use(express.json());
app.use(router);
app.use(errorHandler);

function errorHandler(err, req, res, next) {
  console.log("Uncaught error: ", err);

  sendErrorResponse(res, 500, [
    { code: "500", message: "Internal Server Error", type: "ERROR" },
  ]);
}

app.listen(PORT, async () => {
  try {
    await initializeDatabase();
    await syncMockExpectations();

    console.log(
      `TÜBİTAK Travel Rule (KTDM) Mock Server listening at http://localhost:${PORT}`,
    );
  } catch (error) {
    console.error(error);
  }
});
