import { IsNotEmpty } from 'class-validator';
import { BeforeInsert, Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, BaseEntity, OneToMany } from 'typeorm';
import { hashPassword } from '../auth/utils/password';
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

  @IsNotEmpty()
  @Column()
  public password: string;

  @IsNotEmpty()
  @Column({
    default: true,
  })
  enabled: boolean;

  @OneToMany(type => Interview, interview => interview.interviewee)
  interviews: Interview[];

  toString() {
    return `${this.firstname} ${this.lastname}`;
  }

  @BeforeInsert()
  public async hashPassword(): Promise<void> {
    this.password = await hashPassword(this.password);
    this.enabled = true;
  }
}
