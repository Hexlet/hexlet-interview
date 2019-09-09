import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity('interview')
export class Interview extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  interviewer: string;

  @Column()
  interviewee: string;

  @Column({ name: 'video_link' })
  videoLink: string;
}
