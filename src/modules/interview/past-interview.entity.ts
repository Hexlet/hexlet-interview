import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('past_interview')
export class PastInterview {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  interviewer: string;

  @Column()
  interviewee: string;

  @Column()
  profession: string;

  @Column()
  position: string;

  @Column({ name: 'video_link' })
  videoLink: string;

  @Column()
  date: Date;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @BeforeInsert()
  setDefaults() {
    this.createdAt = new Date();
  }
}
