
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { AuthMethod } from "../../common/enums/auth-method.enum";
import { Role } from "../../common/enums/roles.enum";
import { UserStatus } from "../../common/enums/user-status.enum";

@Entity('users')
export class User {
  @Column({ nullable: true })
  full_name?: string;
  @PrimaryGeneratedColumn('uuid')
  id !: string;

  @Column({ unique: true })
  email !: string;

  @Column()
  password !: string;

  @Column({
    type: 'enum',
    enum: AuthMethod,
    default: AuthMethod.EMAIL,
  })
  auth_method !: AuthMethod;

  @Column({
    type: 'enum',
    enum: Role,
  })
  role !: Role;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING,
  })
  status !: UserStatus;

  @Column({ type: 'timestamp', nullable: true })
  email_verified_at !: Date | null;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @Column({ type: 'text', nullable: true })
  verification_token!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  verification_token_expires_at!: Date | null;

  @Column({ type: 'text', nullable: true })
  refresh_token!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  refresh_token_expires_at!: Date | null;

  @Column({ type: 'text', nullable: true })
  reset_password_token!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  reset_password_token_expires_at!: Date | null;
}