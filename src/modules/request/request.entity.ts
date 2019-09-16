import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('request')
export class Request extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'new' })
  state: string;

  @Column()
  username: string;

  @Column()
  profession: string;

  @Column()
  position: string;

  @Column()
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
