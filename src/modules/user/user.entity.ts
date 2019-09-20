import { IsNotEmpty } from 'class-validator';
import { BeforeInsert, Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { hashPassword } from '../auth/utils/password';

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  role: string;

  @IsNotEmpty()
  @Column()
  public firstname: string;

  @IsNotEmpty()
  @Column()
  public lastname: string;

  @IsNotEmpty()
  @PrimaryColumn({
    unique: true,
  })
  public email: string;

  @IsNotEmpty()
  @Column()
  public password: string;

  @IsNotEmpty()
  @Column({
    default: false,
  })
  enabled: boolean;

  @BeforeInsert()
  public async hashPassword(): Promise<void> {
    this.password = await hashPassword(this.password);
  }
}
