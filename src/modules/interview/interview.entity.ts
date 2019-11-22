import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TypeState } from 'typestate';
import { InvalidStateTransition } from './exception/invalid-state-transition.exception';
import { User } from '../user/user.entity';

export enum interviewState {
  WAIT_FOR_INTERVIEWER = 'wait_for_interviewer',
  COMING = 'coming',
  PASSED = 'passed',
  CANCELLED = 'cancelled',
}

@Entity('interview')
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
    this.state = this.state || interviewState.WAIT_FOR_INTERVIEWER;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  updateUpdatedAt(): void {
    this.updatedAt = new Date();
  }

  // Finite state machine specific methods
  private fsm: TypeState.FiniteStateMachine<interviewState>;

  private async performTransition(state: interviewState): Promise<void> {
    try {
      this.fsm.go(state);
    } catch (e) {
      throw new InvalidStateTransition('Raz');
    }
  }

  @AfterLoad()
  initStateMachine(): void {
    const fsm = new TypeState.FiniteStateMachine<interviewState>(this.state);

    fsm.from(interviewState.WAIT_FOR_INTERVIEWER).to(interviewState.COMING);
    fsm.from(interviewState.WAIT_FOR_INTERVIEWER).to(interviewState.CANCELLED);

    fsm.from(interviewState.COMING).to(interviewState.CANCELLED);
    fsm.from(interviewState.COMING).to(interviewState.WAIT_FOR_INTERVIEWER);

    this.fsm = fsm;
  }

  async assign(): Promise<void> {
    this.performTransition(interviewState.COMING);
  }
}
