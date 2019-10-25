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
import { User } from '../user/user.entity';
import { StateMachine } from '../../common/state-machine.decorator';

export enum interviewState {
  WAIT_FOR_INTERVIEWER = 'wait_for_interviewer',
  COMING = 'coming',
  PASSED = 'passed',
  CANCELLED = 'cancelled',
}

export const InterviewStateMachine = {
  init: 'wait_for_interviewer',
  transitions: [
    { name: 'assign', from: 'wait_for_interviewer', to: 'assigned' },
    { name: 'cancel', from: ['wait_for_interviewer', 'assigned'], to: 'cancelled' },
    { name: 'pass', from: 'assigned', to: 'passed' },
  ],
};

@Entity('interview')
@StateMachine(InterviewStateMachine)
export class Interview extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  state: interviewState;

  @ManyToOne(() => User, user => user.interviews)
  @JoinColumn({ name: 'interviewee_id' })
  interviewee: User;

  @ManyToOne(() => User, user => user.interviews)
  @JoinColumn({ name: 'interviewer_id' })
  interviewer: User | null;

  @Column()
  profession: string;

  @Column()
  position: string;

  @Column()
  description: string;

  @Column({ name: 'video_link' })
  videoLink: string;

  @Column()
  date: Date;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;

  @BeforeInsert()
  setDefaults(): void {
    // this.state = this.state || interviewState.WAIT_FOR_INTERVIEWER;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  updateUpdatedAt(): void {
    this.updatedAt = new Date();
  }
}

// for fsm methods working
export interface Interview {
  assign(): void;
  cancel(): void;
  pass(): void;
}
