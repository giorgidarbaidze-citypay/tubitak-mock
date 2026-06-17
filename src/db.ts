import "reflect-metadata";
import * as eciesjs from "eciesjs";
import { DataSource, In } from "typeorm";
import { User } from "./entities/User";
import { Vasp } from "./entities/Vasp";
import { TravelRule } from "./entities/TravelRule";
import { StatusHistory } from "./entities/StatusHistory";

export const AppDataSource = new DataSource({
  type: "better-sqlite3",
  database: "db.sqlite",
  entities: [User, Vasp, TravelRule, StatusHistory],
  synchronize: true,
  logging: false,
});

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    await AppDataSource.synchronize(false);
    console.log("Data Source has been initialized!");
    await seedDatabase();
  } catch (err) {
    console.error("Error during Data Source initialization", err);
  }
};

function getRandomPublicKey(): string {
  const pk = new eciesjs.PrivateKey();

  return pk.publicKey.toHex();
}

async function seedDatabase() {
  const userRepository = AppDataSource.getRepository(User);
  const vaspRepository = AppDataSource.getRepository(Vasp);

  // Insert Mock Login Credentials
  const mockUsers = [
    { username: "sample_vasp", password: "secure_password123" },
    { username: "testkrp", password: "testpass01" },
  ];

  await userRepository.delete({
    username: In(mockUsers.map((u) => u.username)),
  });
  for (const userData of mockUsers) {
    const existingUser = await userRepository.findOneBy({
      username: userData.username,
    });
    if (!existingUser) {
      await userRepository.save(userData);
    }
  }

  // Seed Mock Turkish Exchanges Data
  const mockVasps = [
    {
      vaspCode: "BTCTURK",
      vaspName: "BtcTurk | Kripto",
      publicKey: getRandomPublicKey(),
    },
    {
      vaspCode: "BINANCE",
      vaspName: "Binance",
      publicKey: getRandomPublicKey(),
    },
    {
      vaspCode: "COINBASE",
      vaspName: "Coinbase",
      publicKey: getRandomPublicKey(),
    },
    {
      vaspCode: "KRAKEN",
      vaspName: "Kraken",
      publicKey: getRandomPublicKey(),
    },
    {
      vaspCode: "TETRI",
      vaspName: "Tetri",
      publicKey: getRandomPublicKey(),
    },
  ];

  await vaspRepository.delete({
    vaspCode: In(mockVasps.map((v) => v.vaspCode)),
  });
  for (const vaspData of mockVasps) {
    await vaspRepository.upsert(vaspData, ["vaspCode"]);
  }

  console.log(
    "Database schemas created and mock directories seeded successfully.",
  );
}

// Helper functions for legacy support if needed, or we refactor them out
export const dbGet = async (query: string, params: any[]) => {
  return AppDataSource.query(query, params).then((res) => res[0]);
};

export const dbRun = async (query: string, params: any[]) => {
  return AppDataSource.query(query, params);
};

export const dbAll = async (query: string, params: any[]) => {
  return AppDataSource.query(query, params);
};
