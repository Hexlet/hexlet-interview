import * as bcrypt from 'bcrypt';
import { IsNotEmpty } from 'class-validator';
import { BeforeInsert, Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('user')
export class User extends BaseEntity {
  public static async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  public async comparePassword(password: string) {
    return await bcrypt.compare(password, this.password);
  }

  @PrimaryGeneratedColumn('increment')
  id: number;

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

  public toString(): string {
    return `${this.firstname} ${this.lastname} (${this.email})`;
  }

  @BeforeInsert()
  public async hashPassword(): Promise<void> {
    this.password = await User.hashPassword(this.password);
  }
}
