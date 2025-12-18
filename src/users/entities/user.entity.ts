import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  telephone?: string;

  @Column()
  password?: string;

  @Column()
  createdAt?: Date;

  @Column()
  updatedAt?: Date;
}
