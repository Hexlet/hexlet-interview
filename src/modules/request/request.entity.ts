import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn, BeforeInsert, BeforeUpdate } from 'typeorm';

@Entity('request')
export class Request extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  state: string;

  @Column()
  username: string;

  @Column()
  profession: string;

  @Column()
  position: string;

  @Column()
  description: string;

  @Column({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'updated_at' })
  updatedAt: Date;

  @BeforeInsert()
  setDefaults() {
    this.state = 'new';
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  updateUpdatedAt() {
    this.updatedAt = new Date();
  }
}
