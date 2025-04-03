import { CURRENT_TIMESTAMP } from 'src/utils/constanst';
import { UserType } from 'src/utils/enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Trainer } from '../trainers/entities/trainer.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: '150', nullable: false })
  username: string;

  @Column({ type: 'varchar', length: '250', unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    type: 'enum',
    enum: UserType,
    nullable: true,
    default: UserType.NORMAL_User,
  })
  userType: UserType;

  @Column({
    default:
      'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png',
  })
  profileImage: string;

  @Column({ nullable: true })
  @Exclude()
  profileImagePublicId: string;

  @Column({ default: false })
  isAccountVerified: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => CURRENT_TIMESTAMP,
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => CURRENT_TIMESTAMP,
    onUpdate: CURRENT_TIMESTAMP,
  })
  updatedAt: Date;
}
