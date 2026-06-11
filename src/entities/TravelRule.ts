import { KtdmTravelRuleStatus } from "src/router";
import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("travel_rules")
export class TravelRule {
  @PrimaryColumn()
  id!: string;

  @Column({ nullable: true })
  transactionRef?: string;

  @Column()
  transactionAsset!: string;

  @Column()
  transactionAssetNetwork!: string;

  @Column({ nullable: true })
  transactionAssetTag?: string;

  @Column({ nullable: true, type: "integer" })
  transactionAssetDecimals?: number;

  @Column()
  transactionAmount!: string;

  @Column({ nullable: true })
  chargedQuantity?: string;

  @Column()
  originatorVASPdid!: string;

  @Column()
  beneficiaryVASPdid!: string;

  @Column({ nullable: true })
  piiEncryptedPayload?: string;

  @Column({ nullable: true })
  piiEncryptionType?: string;

  @Column()
  status!: KtdmTravelRuleStatus;

  @Column({ default: "ACTIVE" })
  lifecycleStatus!: string;

  @Column({ nullable: true })
  txHash?: string;

  @Column()
  createdAt!: string;

  @Column({ nullable: true, type: "text" })
  rawPayload?: string;
}
