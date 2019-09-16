import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('interview')
export class Interview extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'new' })
  state: string;

  @Column()
  interviewer: string;

  @Column()
  interviewee: string;

  @Column({ name: 'video_link' })
  videoLink: string;

  @Column()
  date: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
