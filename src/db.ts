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
      vaspCode: "KVSAKBANK",
      vaspName: "AKBANK TÜRK ANONİM ŞİRKETİ",
    },
    {
      vaspCode: "KRP001",
      vaspName: "BtcTurk Kripto Varlık Alım Satım Platformu A.Ş.",
    },
    {
      vaspCode: "TESTKRP01",
      vaspName: "Kamu SM Test KVHS",
    },
    {
      vaspCode: "TESTKRP02",
      vaspName: "Kamu SM Test KVHS-2",
    },
    {
      vaspCode: "KRP002",
      vaspName: "Paribu Kripto Varlık Alım Satım  Platformu A.Ş.",
    },
    {
      vaspCode: "KRP153",
      vaspName: "Keyex Kripto Varlık Alım Satım Platformu AŞ",
    },
    {
      vaspCode: "KRP180",
      vaspName: "Sarus Kripto Varlık Alım Satım Platformu AŞ",
    },
    {
      vaspCode: "KRP175",
      vaspName:
        "ERY BİLGİ TEKNOLOJİLERİ KRİPTO VARLIK ALIM SATIM PLATFORMU TİCARET ANONİM ŞİRKETİ (ELİTBİT)",
    },
    {
      vaspCode: "KRP012",
      vaspName: "ICRYPEX KRİPTO VARLIK ALIM SATIM PLATFORMU A.Ş.",
    },
    {
      vaspCode: "KRP155",
      vaspName: "Fuze Kripto Varlık Alım Satım Platformu A.Ş.",
    },
    {
      vaspCode: "KRPBTGURU",
      vaspName: "Btguru",
    },
    {
      vaspCode: "KRP_109",
      vaspName: "Kointra Kripto Varlık Alım Satım Platformu A.Ş",
    },
    {
      vaspCode: "KRP179",
      vaspName: "Finnova Kripto Alım Satım Platformu A.Ş.",
    },
    {
      vaspCode: "KRP108",
      vaspName: "OKX TR Kripto Varlık Alım Satım Platformu A.Ş.",
    },
    {
      vaspCode: "KRP006",
      vaspName: "BİNANCE TURKEY KRİPTO VARLIK ALIM SATIM PLATFORMU A.Ş.",
    },
    {
      vaspCode: "KRP183",
      vaspName: "Crybo Kripto Varlık Alım Satım Platformu Anonim Şirketi",
    },
    {
      vaspCode: "KRP137",
      vaspName: "BİTHERO KRİPTO VARLIK ALIM SATIM PLATFORMU ANONİM ŞİRKETİ",
    },
    {
      vaspCode: "KRP119",
      vaspName: "ARBİTEX KRİPTO VARLIK ALIM SATIM PLATFORMU A.Ş.",
    },
    {
      vaspCode: "KRP101",
      vaspName: "Foris Dax TR Kripto Varlık Alım Satım Platformu A.Ş. ",
    },
    {
      vaspCode: "KRP005",
      vaspName: "Bitexen Kripto Varlık Alım Satım Platformu A.Ş.",
    },
    {
      vaspCode: "KRP199",
      vaspName: "Misyon Kripto Varlık Alım Satım Platformu A.Ş.",
    },
    {
      vaspCode: "KRP130",
      vaspName: "Coino Kripto Varlık Alım Satım Platformu A.Ş.",
    },
    {
      vaspCode: "KRP023",
      vaspName: "DYOR KRIPTO VARLIK ALIM SATIM PLATFORMU A.Ş ",
    },
    {
      vaspCode: "KRP024",
      vaspName: "Rain Kripto Varlık Alım Satım Platformu A.Ş.",
    },
    {
      vaspCode: "KRP195",
      vaspName: "GOART KRİPTO VARLIK ALIM SATIM PLATFORMU ANONİM ŞİRKETİ",
    },
    {
      vaspCode: "KRPMYB",
      vaspName: "Misyon Yatırım Bakası A.Ş. ",
    },
    {
      vaspCode: "KRP046",
      vaspName: "Safebit Kripto Varlık Alım Satım Platformu A.Ş.",
    },
    {
      vaspCode: "KRP196",
      vaspName: "CLTS KRİPTO VARLIK ALIM SATIM PLATFORMU ANONİM ŞİRKETİ",
    },
    {
      vaspCode: "ERENB",
      vaspName: "ERENBTEST",
    },
    {
      vaspCode: "TESTKRP004",
      vaspName: "TESTKRP004",
    },
    {
      vaspCode: "KRP_017",
      vaspName: "Bitlo Kripto Varlık Alım Satım Platformu A.Ş.",
    },
    {
      vaspCode: "KRP162",
      vaspName: "Exzi Kripto Varlık Alım Satım Platformu A.Ş.",
    },
    {
      vaspCode: "KRP182",
      vaspName: "TRINKEX Kripto Varlık Alım Satım Platformu A.Ş.",
    },
    {
      vaspCode: "KRP174",
      vaspName: "Powerex Kripto Varlık Alım Satım Platformu A.Ş.",
    },
    {
      vaspCode: "KRP170",
      vaspName: "Ovro Kripto Varlık Alım Satım Platformu A.Ş.",
    },
    {
      vaspCode: "KRP110",
      vaspName: "Midas Kripto Varlık Alım Satım Platformu A.Ş.",
    },
    {
      vaspCode: "KRP118",
      vaspName: "Ekonobi Kripto Varlık Alım Satım Platformu Anonim Şirketi ",
    },
    {
      vaspCode: "KRP157",
      vaspName: "Kuantist Kripto Varlık Alım Satım Platformu Anonim Şirket",
    },
    {
      vaspCode: "KRP152",
      vaspName: "Kriptrade Kripto Varlık Alım Satım Platformu A.Ş.",
    },
    {
      vaspCode: "KRP106",
      vaspName: "Garanti BBVA Kripto Varlık Alım – Satım Platformu A.Ş.",
    },
    {
      vaspCode: "KRP145",
      vaspName: "Rootech Kripto Varlık Alım Satım Platformu AŞ - Roobit",
    },
    {
      vaspCode: "KRP125",
      vaspName: "CoinTR Kripto Varlık Alım Satım Platformu Anonim Şirketi",
    },
    {
      vaspCode: "KRP033",
      vaspName: "Futurance Kripto Varlık Alım Satım Platformu A.Ş - Fexobit",
    },
    {
      vaspCode: "KRP105",
      vaspName: "Whitebit Kripto Varlık Alım Satım Platformu A.Ş",
    },
    {
      vaspCode: "TESTKRP005",
      vaspName: "TESTKRP005",
    },
    {
      vaspCode: "TESTKRP006",
      vaspName: "TESTKRP006",
    },
    {
      vaspCode: "TESTKRP007",
      vaspName: "TESTKRP007",
    },
    {
      vaspCode: "TESTKRP008",
      vaspName: "TESTKRP008",
    },
    {
      vaspCode: "KRPAHL",
      vaspName: "Ahlatcı Kripto Varlık Alım Satım Platformu AŞ",
    },
    {
      vaspCode: "KRP124",
      vaspName: "Bilira Kripto Varlık Alım Satım Platformu AŞ",
    },
    {
      vaspCode: "TESTKRP002",
      vaspName: "TESTKRP002",
    },
    {
      vaspCode: "TESTKRP003",
      vaspName: "TESTKRP003",
    },
    {
      vaspCode: "KVHS-KAMUSM-DEV",
      vaspName: "KVHS-KAMUSM-DEV",
    },
    {
      vaspCode: "TESTKRP04",
      vaspName: "Kamu SM Test KVHS-4",
    },
    {
      vaspCode: "KVHS-Originator-Simulator",
      vaspName: "KVHS Originator Simulator",
    },
    {
      vaspCode: "KRPTKS",
      vaspName: "Takas İstanbul",
    },
    {
      vaspCode: "KRP135",
      vaspName: "Gate Kripto Varlık Alım Satım Platformu A.Ş.",
    },
    {
      vaspCode: "KRP_182",
      vaspName: "WELL WELL WELL Crypto Test by Ö.A",
    },
    {
      vaspCode: "KRP184",
      vaspName: "Destek Kripto Varlık Alım Satım Platformu A.Ş.",
    },
    {
      vaspCode: "KRP102",
      vaspName: "WH LAST STOP KRİPTO VARLIK ALIM SATIM PLATFORMU A.Ş",
    },
    {
      vaspCode: "KRP122",
      vaspName: "Stablex Kripto Varlık Alım Satım Platformu A.Ş.",
    },
    {
      vaspCode: "KRP_000",
      vaspName: "Test VASP",
    },
    {
      vaspCode: "TESTKRP03",
      vaspName: "Kamu SM Test KVHS-3",
    },
    {
      vaspCode: "KRP_001",
      vaspName: "Test VASP 1",
    },
    {
      vaspCode: "KRP165",
      vaspName: "Citypay Kripto Varlık Alım Satım Platformu Anonim Şirketi",
    },
    {
      vaspCode: "KRP202",
      vaspName: "Türkiye İş Bankası A.Ş.",
    },
    {
      vaspCode: "KVH176",
      vaspName: "Magician of Meta Kripto Varlık Alım Satım Platformu. AŞ.",
    },
    {
      vaspCode: "TEST_BIRNUR",
      vaspName: "Birnur KOPUZ",
    },
    {
      vaspCode: "TEST_ELIF",
      vaspName: "Elif YAZICI YILDIRIM",
    },
    {
      vaspCode: "KRP160",
      vaspName: "Kripdome Kripto Varlık Alım Satım PLatformu A.Ş.",
    },
    {
      vaspCode: "Demo_Gonderici",
      vaspName: "Demo_Gonderici",
    },
    {
      vaspCode: "Demo_Alici",
      vaspName: "Demo_Alici",
    },
    {
      vaspCode: "KRPYPFT",
      vaspName: "Yapı Kredi Finansal Teknolojiler A.Ş",
    },
    {
      vaspCode: "TESTKRP001",
      vaspName: "TESTKRP001",
    },
  ].map((item) => ({ ...item, publicKey: getRandomPublicKey() }));

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
