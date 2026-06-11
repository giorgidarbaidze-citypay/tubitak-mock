import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("users")
export class User {
  @PrimaryColumn()
  username!: string;

  @Column()
  password!: string;
}
