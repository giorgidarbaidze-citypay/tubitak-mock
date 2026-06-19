import express from "express";
import { AppDataSource } from "./db";
import { User } from "./entities/User";
import { Vasp } from "./entities/Vasp";
import { TravelRule } from "./entities/TravelRule";
import { StatusHistory } from "./entities/StatusHistory";
import { sendTubitakResponse, sendErrorResponse } from "./utils";
import jwt from "jsonwebtoken";
import {
  JWT_SECRET,
  ORIGINATOR_CALLBACK_URL_ACCEPT,
  ORIGINATOR_CALLBACK_URL_CONFIRM,
  ORIGINATOR_CALLBACK_URL_DECLINE,
  ORIGINATOR_CALLBACK_URL_NOT_READY,
  ORIGINATOR_CALLBACK_URL_REJECT,
  TOKEN_EXPIRY,
} from "./constants";
import { travelRuleCreateSchema, validateBody } from "./validation";
import crypto from "crypto";

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const vaspRepository = AppDataSource.getRepository(Vasp);
const travelRuleRepository = AppDataSource.getRepository(TravelRule);
const statusHistoryRepository = AppDataSource.getRepository(StatusHistory);

export type KtdmTravelRuleStatus =
  | "NEW"
  | "ACKNOWLEDGED"
  | "ACCEPTED"
  | "CONFIRM"
  | "DECLINED"
  | "REJECTED"
  | "NOT_READY"
  | "CANCELLED";

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return sendErrorResponse(res, 403, [
      {
        code: "403",
        message: "Forbidden: Access code is empty/invalid/unsuccessful.",
        type: "ERROR",
      },
    ]);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return sendErrorResponse(res, 401, [
        {
          code: "403",
          message: "Forbidden: Access code is empty/invalid/unsuccessful.",
          type: "ERROR",
        },
      ]);
    }
    req.user = user;
    next();
  });
}

// Helper to save status history
async function saveStatusHistory(
  travelRuleId: string,
  status: string,
  statusDetail: string,
) {
  const timestamp = new Date().toISOString();
  const statusHistory = statusHistoryRepository.create({
    travelRuleId,
    status,
    statusDetail,
    changedAt: timestamp,
  });
  await statusHistoryRepository.save(statusHistory);
  return timestamp;
}

router.post("/api/auth/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return sendErrorResponse(res, 400, [
      {
        code: "400",
        message: "Username and password fields are required.",
        type: "ERROR",
      },
    ]);
  }

  try {
    const newUser = userRepository.create({ username, password });
    await userRepository.save(newUser);
    return sendTubitakResponse(res, 201, {
      message: {
        code: "00",
        message: "User registered successfully.",
        type: "SUCCESS",
      },
    });
  } catch (err) {
    if (
      err.message.includes("UNIQUE constraint failed") ||
      err.code === "SQLITE_CONSTRAINT"
    ) {
      return sendErrorResponse(res, 409, [
        { code: "9916", message: "Username already exists", type: "ERROR" },
      ]);
    }
    return sendErrorResponse(res, 500, [
      { code: "9900", message: err.message, type: "ERROR" },
    ]);
  }
});

// ==========================================
// 1. JWT TOKEN RETRIEVAL
// ==========================================
router.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return sendErrorResponse(res, 400, [
      {
        code: "400",
        message: "Username and password fields are required.",
        type: "ERROR",
      },
    ]);
  }

  const user = await userRepository.findOneBy({ username, password });
  if (!user) {
    return sendErrorResponse(res, 401, [
      {
        code: "403",
        message: "Forbidden: Access code is empty/invalid/unsuccessful.",
        type: "ERROR",
      },
    ]);
  }

  const accessToken = jwt.sign({ sub: user.username }, JWT_SECRET, {
    expiresIn: TOKEN_EXPIRY,
  });
  return res.status(200).json({
    access_token: accessToken,
    token_type: "Bearer",
    expires_in: 300,
  });
});

// ==========================================
// 2. TRANSMISSION OF ENCRYPTED TRANSFER DATA TO TRSP
// ==========================================
router.post(
  "/api/v1/ktdm/tr/create",
  authenticateToken,
  validateBody(travelRuleCreateSchema),
  async (req, res) => {
    const {
      transactionRef,
      transactionAsset,
      transactionAssetNetwork,
      transactionAssetTag,
      transactionAssetDecimals,
      transactionAmount,
      chargedQuantity,
      originatorVASPdid,
      beneficiaryVASPdid,
      piiEncryptedPayload,
      piiEncryptionType,
    } = req.body;

    try {
      // Validate beneficiary VASP exists
      const targetVasp = await vaspRepository.findOneBy({
        vaspCode: beneficiaryVASPdid,
      });
      if (!targetVasp) {
        return sendErrorResponse(res, 400, [
          {
            code: "9913",
            message: "Vasp Not Found",
            type: "VaspNotFoundException",
          },
        ]);
      }

      const generatedUUID = crypto.randomUUID();
      const initialStatus = "NEW";
      const timestamp = new Date().toISOString();

      const travelRule = travelRuleRepository.create({
        id: generatedUUID,
        transactionRef: transactionRef || null,
        transactionAsset,
        transactionAssetNetwork,
        transactionAssetTag: transactionAssetTag || null,
        transactionAssetDecimals: transactionAssetDecimals || null,
        transactionAmount,
        chargedQuantity: chargedQuantity || null,
        originatorVASPdid,
        beneficiaryVASPdid,
        piiEncryptedPayload: piiEncryptedPayload || null,
        piiEncryptionType: piiEncryptionType || null,
        status: initialStatus,
        lifecycleStatus: "ACTIVE",
        createdAt: timestamp,
        rawPayload: JSON.stringify(req.body),
      });
      await travelRuleRepository.save(travelRule);

      await saveStatusHistory(
        generatedUUID,
        initialStatus,
        "CREATE_SAVED_IN_DB",
      );
      await saveStatusHistory(
        generatedUUID,
        initialStatus,
        "CREATE_QUEUED_FOR_FORWARDING",
      );

      return sendTubitakResponse(res, 201, {
        message: {
          code: "00",
          message: "Creating Travel Rule completed.",
          type: "SUCCESS",
        },
        status: initialStatus,
        transactionType: "TRAVELRULE",
        id: generatedUUID,
      });
    } catch (err) {
      return sendErrorResponse(res, 500, [
        {
          code: "9900",
          message: "Error at creating travel rule",
          type: "TravelRuleSaveExcepiton",
        },
      ]);
    }
  },
);

// ==========================================
// 3. STATUS TRANSITIONS (Beneficiary Actions)
// ==========================================

// CONFIRM/ACK - Wallet ownership verified
router.post("/api/v1/ktdm/tr/confirm", authenticateToken, async (req, res) => {
  const { id } = req.body;

  const tr = await travelRuleRepository.findOneBy({ id });
  if (!tr) {
    return sendErrorResponse(res, 404, [
      {
        code: "9910",
        message: "Travel Rule not found",
        type: "TravelRuleNotFoundExcepiton",
      },
    ]);
  }
  if (tr.status !== "NEW" && tr.status !== "NOT_READY") {
    return sendErrorResponse(res, 400, [
      {
        code: "9912",
        message: `Travel Rule status can not be updated because its current status is '${tr.status}'.`,
        type: "TravelRuleCanNotBeUpdatedException",
      },
    ]);
  }

  tr.status = "ACKNOWLEDGED";
  await travelRuleRepository.save(tr);

  await saveStatusHistory(id, "ACKNOWLEDGED", "CONFIRM_RECEIVED");
  await saveStatusHistory(id, "ACKNOWLEDGED", "CONFIRM_QUEUED_FOR_FORWARDING");

  return sendTubitakResponse(res, 200, {
    message: {
      code: "00",
      message: "Travel Rule Status Update completed.",
      type: "SUCCESS",
    },
    status: "ACKNOWLEDGED",
    transactionType: "TRAVELRULE",
    id,
  });
});

// ACCEPTED - AML checks passed
router.post("/api/v1/ktdm/tr/accept", authenticateToken, async (req, res) => {
  const { id } = req.body;

  const tr = await travelRuleRepository.findOneBy({ id });
  if (!tr) {
    return sendErrorResponse(res, 404, [
      {
        code: "9910",
        message: "Travel Rule not found",
        type: "TravelRuleNotFoundExcepiton",
      },
    ]);
  }
  if (
    tr.status !== "NEW" &&
    tr.status !== "ACKNOWLEDGED" &&
    tr.status !== "NOT_READY"
  ) {
    return sendErrorResponse(res, 400, [
      {
        code: "9912",
        message: `Travel Rule status can not be updated because its current status is '${tr.status}'.`,
        type: "TravelRuleCanNotBeUpdatedException",
      },
    ]);
  }

  tr.status = "ACCEPTED";
  await travelRuleRepository.save(tr);

  await saveStatusHistory(id, "ACCEPTED", "ACCEPT_RECEIVED");
  await saveStatusHistory(id, "ACCEPTED", "ACCEPT_QUEUED_FOR_FORWARDING");

  return sendTubitakResponse(res, 200, {
    message: {
      code: "00",
      message: "Travel Rule Status Update completed.",
      type: "SUCCESS",
    },
    status: "ACCEPTED",
    transactionType: "TRAVELRULE",
    id,
  });
});

// REJECTED - Wallet doesn't belong to beneficiary VASP
router.post("/api/v1/ktdm/tr/reject", authenticateToken, async (req, res) => {
  const { id, reason } = req.body;

  const tr = await travelRuleRepository.findOneBy({ id });
  if (!tr) {
    return sendErrorResponse(res, 404, [
      {
        code: "9910",
        message: "Travel Rule not found",
        type: "TravelRuleNotFoundExcepiton",
      },
    ]);
  }
  if (
    tr.status !== "NEW" &&
    tr.status !== "ACKNOWLEDGED" &&
    tr.status !== "NOT_READY"
  ) {
    return sendErrorResponse(res, 400, [
      {
        code: "9912",
        message: `Travel Rule status can not be updated because its current status is '${tr.status}'.`,
        type: "TravelRuleCanNotBeUpdatedException",
      },
    ]);
  }

  tr.status = "REJECTED";
  await travelRuleRepository.save(tr);

  await saveStatusHistory(id, "REJECTED", "REJECT_RECEIVED");
  await saveStatusHistory(id, "REJECTED", "REJECT_QUEUED_FOR_FORWARDING");

  return sendTubitakResponse(res, 200, {
    message: {
      code: "00",
      message: "Travel Rule Status Update completed.",
      type: "SUCCESS",
    },
    status: "REJECTED",
    transactionType: "TRAVELRULE",
    id,
  });
});

// DECLINED - AML checks failed
router.post("/api/v1/ktdm/tr/decline", authenticateToken, async (req, res) => {
  const { id, reason } = req.body;

  const tr = await travelRuleRepository.findOneBy({ id });
  if (!tr) {
    return sendErrorResponse(res, 404, [
      {
        code: "9910",
        message: "Travel Rule not found",
        type: "TravelRuleNotFoundExcepiton",
      },
    ]);
  }
  if (
    tr.status !== "NEW" &&
    tr.status !== "ACKNOWLEDGED" &&
    tr.status !== "NOT_READY"
  ) {
    return sendErrorResponse(res, 400, [
      {
        code: "9912",
        message: `Travel Rule status can not be updated because its current status is '${tr.status}'.`,
        type: "TravelRuleCanNotBeUpdatedException",
      },
    ]);
  }

  tr.status = "DECLINED";
  await travelRuleRepository.save(tr);

  await saveStatusHistory(id, "DECLINED", "DECLINE_RECEIVED");
  await saveStatusHistory(id, "DECLINED", "DECLINE_QUEUED_FOR_FORWARDING");

  return sendTubitakResponse(res, 200, {
    message: {
      code: "00",
      message: "Travel Rule Status Update completed.",
      type: "SUCCESS",
    },
    status: "DECLINED",
    transactionType: "TRAVELRULE",
    id,
  });
});

// NOT_READY - Beneficiary VASP not ready to respond
router.post("/api/v1/ktdm/tr/notready", authenticateToken, async (req, res) => {
  const { id } = req.body;

  const tr = await travelRuleRepository.findOneBy({ id });
  if (!tr) {
    return sendErrorResponse(res, 404, [
      {
        code: "9910",
        message: "Travel Rule not found",
        type: "TravelRuleNotFoundExcepiton",
      },
    ]);
  }
  if (tr.status !== "NEW") {
    return sendErrorResponse(res, 400, [
      {
        code: "9912",
        message: `Travel Rule status can not be updated because its current status is '${tr.status}'.`,
        type: "TravelRuleCanNotBeUpdatedException",
      },
    ]);
  }

  tr.status = "NOT_READY";
  await travelRuleRepository.save(tr);

  await saveStatusHistory(id, "NOT_READY", "NOTREADY_RECEIVED");
  await saveStatusHistory(id, "NOT_READY", "NOTREADY_QUEUED_FOR_FORWARDING");

  return sendTubitakResponse(res, 200, {
    message: {
      code: "00",
      message: "Travel Rule Status Update completed.",
      type: "SUCCESS",
    },
    status: "NOT_READY",
    transactionType: "TRAVELRULE",
    id,
  });
});

// ==========================================
// 4. RECORDING THE TRANSFER TRANSACTION IN TRSP
// ==========================================
router.post("/api/v1/ktdm/tr/update", authenticateToken, async (req, res) => {
  const { id, txHash } = req.body;
  if (!id || !txHash) {
    return sendErrorResponse(res, 400, [
      {
        code: "400",
        message: "Invalid Request",
        type: "MethodArgumentNotValidException",
      },
    ]);
  }

  const tr = await travelRuleRepository.findOneBy({ id });
  if (!tr) {
    return sendErrorResponse(res, 404, [
      {
        code: "9910",
        message: "Travel Rule not found",
        type: "TravelRuleNotFoundExcepiton",
      },
    ]);
  }
  if (tr.status !== "ACCEPTED") {
    return sendErrorResponse(res, 400, [
      {
        code: "9912",
        message: `Travel Rule status can not be updated because its current status is '${tr.status}'.`,
        type: "TravelRuleCanNotBeUpdatedException",
      },
    ]);
  }

  tr.txHash = txHash;
  await travelRuleRepository.save(tr);

  await saveStatusHistory(id, tr.status, "UPDATE_RECEIVED");
  await saveStatusHistory(id, tr.status, "UPDATE_QUEUED_FOR_FORWARDING");

  return sendTubitakResponse(res, 200, {
    message: {
      code: "00",
      message: "Travel Rule Blockchain txHash Update completed.",
      type: "SUCCESS",
    },
    status: tr.status,
    transactionType: "TRAVELRULE",
    id,
  });
});

// ==========================================
// 5. RETRIEVING THE LIST OF VASP
// ==========================================
router.get("/api/v1/ktdm/tr/vasp-list", authenticateToken, async (req, res) => {
  const list = await vaspRepository.find();
  const vaspList = list.map((v) => ({
    vaspCode: v.vaspCode,
    vaspName: v.vaspName,
  }));
  return res.status(200).json({
    message: {
      message: `${list.length} adet tanımlı KVHS bulunmaktadır.`,
      type: "INFO",
    },
    messages: null,
    vaspList,
  });
});

// ==========================================
// 6. RETRIEVING THE VASP CERTIFICATE
// ==========================================
router.get("/api/v1/ktdm/tr/vasp-cert", authenticateToken, async (req, res) => {
  const vaspDID = req.query.vaspDID as string;
  if (!vaspDID) {
    return sendErrorResponse(res, 400, [
      {
        code: "9900",
        message: "vaspDID query parameter is required",
        type: "ERROR",
      },
    ]);
  }

  const vasp = await vaspRepository.findOneBy({ vaspCode: vaspDID });
  if (!vasp) {
    return sendErrorResponse(res, 404, [
      {
        code: "9914",
        message: "Vasp Endpoint Not Found",
        type: "VaspEndpointNotFoundException",
      },
    ]);
  }

  return res.status(200).json({
    message: {
      message: "Certificate successfully retrieved.",
      type: "SUCCESS",
    },
    messages: null,
    certInfo: {
      base64Certificate: vasp.publicKey,
      vaspDID: vasp.vaspCode,
    },
  });
});

// ==========================================
// 7. QUERYING TRAVEL RULE REQUEST STATUS INFORMATION
// ==========================================
router.get("/api/v1/ktdm/tr/status", authenticateToken, async (req, res) => {
  const travelRuleId = req.query.travelRuleId as string;
  if (!travelRuleId) {
    return sendErrorResponse(res, 400, [
      {
        code: "9900",
        message: "travelRuleId query parameter is required",
        type: "ERROR",
      },
    ]);
  }

  const mainRecord = await travelRuleRepository.findOneBy({
    id: travelRuleId,
  });
  if (!mainRecord) {
    return sendErrorResponse(res, 404, [
      {
        code: "9910",
        message: "Travel Rule not found",
        type: "TravelRuleNotFoundExcepiton",
      },
    ]);
  }

  const traceTimeline = await statusHistoryRepository.find({
    where: { travelRuleId },
    order: { id: "DESC" },
  });

  const latestEntry = traceTimeline[0];

  return res.status(200).json({
    message: null,
    messages: null,
    currentStatus: {
      status: mainRecord.status,
      statusDetail: latestEntry?.statusDetail ?? null,
      date: mainRecord.createdAt,
    },
    history: traceTimeline.map((entry) => ({
      status: entry.status,
      statusDetail: entry.statusDetail,
      date: entry.changedAt,
    })),
  });
});

// ==========================================
// 8. TRAVEL RULE CREDIT INQUIRY SERVICE
// ==========================================
router.get(
  "/api/v1/ktdm/tr/quota/remaining",
  authenticateToken,
  async (req, res) => {
    return res.status(200).json({
      message: {
        message: "Quota inquiry completed successfully.",
        type: "SUCCESS",
      },
      messages: null,
      remainingQuota: 1000,
    });
  },
);

// ==========================================
// 9. BLOCKCHAIN NETWORK LISTING SERVICE
// ==========================================
router.get("/api/public/blockchain-info/network-list", (req, res) => {
  const networks = [
    { networkSymbol: "ACA", networkName: "Acala" },
    { networkSymbol: "ADA", networkName: "Cardano" },
    { networkSymbol: "BTC", networkName: "Bitcoin" },
    { networkSymbol: "ETH", networkName: "Ethereum" },
    { networkSymbol: "ERC20", networkName: "Ethereum (ERC-20)" },
    { networkSymbol: "TRC20", networkName: "Tron (TRC-20)" },
    { networkSymbol: "BEP20", networkName: "BNB Smart Chain (BEP-20)" },
    { networkSymbol: "AVAXC", networkName: "Avalanche C-Chain" },
    { networkSymbol: "SOL", networkName: "Solana" },
    { networkSymbol: "XRP", networkName: "XRP Ledger" },
  ];

  return res.status(200).json({
    message: {
      message: `${networks.length} adet tanımlı Blockchain Network bulunmaktadır.`,
      type: "INFO",
    },
    messages: null,
    blockchainNetworkInfoList: networks,
  });
});

// ==========================================
// 10. TRAVEL RULE CANCEL SERVICE
// ==========================================
router.post("/api/v1/ktdm/tr/cancel", authenticateToken, async (req, res) => {
  const { id, reason } = req.body;
  if (!id) {
    return sendErrorResponse(res, 400, [
      {
        code: "400",
        message: "Invalid Request",
        type: "MethodArgumentNotValidException",
      },
    ]);
  }

  const tr = await travelRuleRepository.findOneBy({ id });
  if (!tr) {
    return sendErrorResponse(res, 404, [
      {
        code: "9910",
        message: "Travel Rule not found",
        type: "TravelRuleNotFoundExcepiton",
      },
    ]);
  }

  // Can only cancel if not yet completed and no blockchain tx initiated
  if (tr.txHash) {
    return sendErrorResponse(res, 400, [
      {
        code: "9912",
        message:
          "Travel Rule can not be cancelled because blockchain transaction has already been initiated.",
        type: "TravelRuleCanNotBeUpdatedException",
      },
    ]);
  }

  if (tr.lifecycleStatus === "CANCELLED") {
    return sendErrorResponse(res, 400, [
      {
        code: "9912",
        message: "Travel Rule has already been cancelled.",
        type: "TravelRuleCanNotBeUpdatedException",
      },
    ]);
  }

  tr.lifecycleStatus = "CANCELLED";
  await travelRuleRepository.save(tr);

  await saveStatusHistory(id, tr.status, "CANCELLED");

  return sendTubitakResponse(res, 200, {
    message: {
      code: "00",
      message: "Successfully cancelled.",
      type: "SUCCESS",
    },
    status: tr.status,
    transactionType: "TRAVELRULE",
    lifecycleStatus: "CANCELLED",
    id,
  });
});

router.post("/api/admin/callback-status", async (req, res) => {
  const travelRuleId = req.query.travelRuleId as string;
  const status = req.query.status as KtdmTravelRuleStatus;
  const reason = req.query.reason as string | undefined;
  const samples = req.query.samples ? parseInt(req.query.samples) : 1;
  const ORIGINATOR_CALLBACK_URLS: Partial<
    Record<KtdmTravelRuleStatus, string>
  > = {
    CONFIRM: ORIGINATOR_CALLBACK_URL_CONFIRM,
    REJECTED: ORIGINATOR_CALLBACK_URL_REJECT,
    NOT_READY: ORIGINATOR_CALLBACK_URL_NOT_READY,
    ACCEPTED: ORIGINATOR_CALLBACK_URL_ACCEPT,
    DECLINED: ORIGINATOR_CALLBACK_URL_DECLINE,
  };
  const FIRST_STAGE_STATUSES: KtdmTravelRuleStatus[] = [
    "CONFIRM",
    "REJECTED",
    "NOT_READY",
  ];
  const SECOND_STAGE_STATUSES: KtdmTravelRuleStatus[] = [
    "ACCEPTED",
    "DECLINED",
  ];
  const ALLOWED_TRANSITIONS = {
    ACKNOWLEDGED: FIRST_STAGE_STATUSES,
    NEW: FIRST_STAGE_STATUSES,
    CONFIRM: SECOND_STAGE_STATUSES,
    REJECTED: [],
    NOT_READY: FIRST_STAGE_STATUSES,
    CANCELLED: [],
    ACCEPTED: [],
    DECLINED: [],
  } satisfies Record<KtdmTravelRuleStatus, KtdmTravelRuleStatus[]>;

  if (!travelRuleId || !status) {
    return sendErrorResponse(res, 400, [
      {
        code: "400",
        message: "travelRuleId and status query parameters are required",
        type: "MethodArgumentNotValidException",
      },
    ]);
  }

  const tr = await travelRuleRepository.findOneBy({ id: travelRuleId });
  if (!tr) {
    return sendErrorResponse(res, 404, [
      {
        code: "9910",
        message: "Travel Rule not found",
        type: "TravelRuleNotFoundExcepiton",
      },
    ]);
  }

  const isAllowedTransition = ALLOWED_TRANSITIONS[tr.status].includes(status);

  if (!isAllowedTransition) {
    return sendErrorResponse(res, 400, [
      {
        code: "9912",
        message: `Impossible transition from '${tr.status}' to '${status}'.`,
        type: "CustomError",
      },
    ]);
  }

  return await AppDataSource.transaction(async (tx) => {
    const travelRuleRepository = tx.getRepository(TravelRule);
    const statusHistoryRepository = tx.getRepository(StatusHistory);

    await travelRuleRepository.update(tr.id, {
      status,
    });
    await saveStatusHistory(
      travelRuleId,
      status,
      `ADMIN_CALLBACK_${status}_APPLIED`,
    );

    const callbackUrl = ORIGINATOR_CALLBACK_URLS[status];
    if (!callbackUrl) {
      return sendErrorResponse(res, 400, [
        {
          code: "9912",
          message: `Failed to determine callback url.`,
          type: "CustomError",
        },
      ]);
    }

    const isFailed = ["REJECTED", "DECLINED"].includes(status);
    const response = await fetch(callbackUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: travelRuleId,
        reason: isFailed ? (reason ?? "unknown reason") : undefined,
      }),
    });

    const samplesSent = await Promise.allSettled([
      ...Array.from({ length: samples - 1 }).map(() =>
        fetch(callbackUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: travelRuleId,
            reason: isFailed ? (reason ?? "unknown reason") : undefined,
          }),
        }),
      ),
    ])
      .then((results) =>
        results.filter((result) => result.status === "fulfilled"),
      )
      .then((results) => results.length + 1);

    await saveStatusHistory(
      travelRuleId,
      status,
      `CALLBACK_${response.ok ? "DELIVERED" : "FAILED"}_HTTP_${response.status}`,
    );

    return sendTubitakResponse(res, 200, {
      message: {
        code: "00",
        message: "Travel Rule Status Update completed.",
        type: "SUCCESS",
        callbackUrl,
        samplesSent,
        response: await response.text(),
      },
      messages: null,
    });
  });
});

router.get("/api/admin/travel-rules", async (req, res) => {
  const travelRules = await travelRuleRepository.find();
  return res.status(200).json(travelRules);
});

export default router;
