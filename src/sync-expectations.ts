import mockServer from "mockserver-client";
import {
  EXPRESS_HOST,
  EXPRESS_PORT,
  MOCK_SERVER_HOST,
  MOCK_SERVER_PORT,
} from "./constants";

const client = mockServer.mockServerClient(MOCK_SERVER_HOST, MOCK_SERVER_PORT);

export async function syncMockExpectations() {
  await client.reset().then(() => {
    client.mockAnyResponse({
      httpRequest: {
        path: "/.*",
      },
      httpForward: {
        host: EXPRESS_HOST,
        port: EXPRESS_PORT,
        scheme: "HTTP",
      },
    });
  });

  console.log("Expectations synched");
}
