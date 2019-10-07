import { IsNotEmpty } from 'class-validator';
import { BeforeInsert, Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import * as uuidGenerate from 'uuid/v4';
import { hashPassword } from '../../common/utils/password';
import { Interview } from '../interview/interview.entity';

@Entity('user')
export class User {
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
  @Column({
    unique: true,
  })
  public email: string;

  @Column()
  public password: string;

  @Column({
    unique: true,
    name: 'github_uid',
  })
  public githubUid: string;

  @IsNotEmpty()
  @Column({
    default: true,
  })
  enabled: boolean;

  @Column({
    default: false,
  })
  verified: boolean;

  @Column({
    default: false,
  })
  archived: boolean;

  @Column('uuid', { name: 'confirmation_token', nullable: true })
  confirmationToken: string | null;

  @OneToMany(() => Interview, interview => interview.interviewee)
  interviews: Interview[];

  toString(): string {
    return `${this.firstname} ${this.lastname}`;
  }

  @BeforeInsert()
  public async hashPassword(): Promise<void> {
    if (this.password) {
      this.password = await hashPassword(this.password);
    }
    this.enabled = true;
  }

  @BeforeInsert()
  public async createToken(): Promise<void> {
    this.confirmationToken = uuidGenerate();
  }
}
