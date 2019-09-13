import * as bcrypt from 'bcrypt';
import { IsNotEmpty } from 'class-validator';
import { BeforeInsert, Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity('user')
export class User extends BaseEntity {
  public static hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                return reject(err);
            }
            resolve(hash);
        });
    });
  }

  public static comparePassword(user: User, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, res) => {
            resolve(res === true);
        });
    });
  }

  @PrimaryGeneratedColumn('increment')
  id: number;

  @IsNotEmpty()
  @Column({ name: 'first_name' })
  public firstName: string;

  @IsNotEmpty()
  @Column({ name: 'last_name' })
  public lastName: string;

  @IsNotEmpty()
  @Column({
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

  @IsNotEmpty()
  @Column({
    default: UserRole.USER,
  })
  role: UserRole;

  public toString(): string {
    return `${this.firstName} ${this.lastName} (${this.email})`;
  }

  @BeforeInsert()
  public async hashPassword(): Promise<void> {
    this.password = await User.hashPassword(this.password);
  }
}
