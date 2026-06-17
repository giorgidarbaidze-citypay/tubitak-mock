import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("vasps")
export class Vasp {
  @PrimaryColumn()
  vaspCode!: string;

  @Column()
  vaspName!: string;

  @Column()
  publicKey!: string;
}
