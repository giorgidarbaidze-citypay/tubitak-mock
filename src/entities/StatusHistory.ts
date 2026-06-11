import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("status_history")
export class StatusHistory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  travelRuleId!: string;

  @Column()
  status!: string;

  @Column({ nullable: true })
  statusDetail?: string;

  @Column()
  changedAt!: string;
}
