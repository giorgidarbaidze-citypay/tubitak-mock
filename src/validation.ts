import { z } from "zod";
import { sendValidationError } from "./utils";

// ==========================================
// ZOD VALIDATION SCHEMA DEFINITION
// ==========================================
export const travelRuleCreateSchema = z.object({
  piiEncryptionSpec: z.object({
    base64EncodedEphemeralPublicKey: z.string(),
    encryptionAlgorithm: z.string(),
  }),

  piiEncryptionType: z.enum(["FIELD", "OBJECT"]),

  piiSchemaVersion: z.string().optional(),

  transactionRef: z.string().optional(),

  transactionAsset: z.string({
    error: "transactionAsset: transactionAsset cannot be null or empty",
  }),

  transactionAssetTag: z.string().optional(),

  transactionAssetNetwork: z.string({
    error: "transactionAssetNetwork: transactionAssetNetwork cannot be null or empty",
  }),

  transactionAssetDecimals: z.number().optional(),

  transactionAmount: z.string({
    error: "transactionAmount: transactionAmount cannot be null or empty",
  }),

  chargedQuantity: z.string().optional(),

  amountInLocalCurrency: z.object({
    currency: z.string(),
    amountInLocalCurrency: z.number(),
  }).optional(),

  beneficiaryAmountInLocalCurrency: z.object({
    currency: z.string(),
    amountInLocalCurrency: z.number(),
  }).optional(),

  originatorDid: z.string().optional(),
  beneficiaryDid: z.string().optional(),

  originatorVASPdid: z.string({
    error: "originatorVASPdid: originatorVASPdid cannot be null or empty",
  }),

  beneficiaryVASPdid: z.string({
    error: "beneficiaryVASPdid: beneficiaryVASPdid cannot be null or empty",
  }),

  beneficiaryRef: z.string().optional(),
  originatorRef: z.string().optional(),

  transactionBlockchainInfo: z.object({
    origin: z.string().optional(),
    destination: z.string(),
  }),

  piiEncryptedPayload: z.string().nullable().optional(),

  pii: z.any().optional(),
});

// ==========================================
// GENERIC EXPRESS VALIDATION MIDDLEWARE
// ==========================================
export const validateBody =
  (schema) =>
  (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const validationMessages = result.error.issues.map((issue) => ({
        message: `${issue.path.join(".")}: ${issue.message}`,
        type: "validation",
      }));

      return sendValidationError(res, validationMessages);
    }

    req.body = result.data;
    next();
  };
