import { Optional } from '@nestjs/common';
import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class Document {
  @PrimaryColumn()
  id: number;

  @Column({nullable: true})
  email?: string;

  @Column({nullable: true})
  fullName?: string;

  @Column({nullable: true})
  birthDate?: string;

  @Column({nullable: true})
  password?: string;

  @Column({nullable: true})
  sampleNumber?: string;

  @Column({nullable: true})
  gender?: string;

  @Column({nullable: true})
  age?: string;

  @Column({nullable: true})
  takingDate?: string;

  @Column({nullable: true})
  registrationDate?: string;

  @Column({nullable: true})
  registrationTime?: string;

  @Column({nullable: true})
  completionDate?: string;

  @Column({nullable: true})
  completionTime?: string;

  @Column({nullable: true})
  printoutDate?: string;

  @Column({nullable: true})
  printoutTime?: string;

  @Column({nullable: true})
  institution?: string;

  @Column({nullable: true})
  result?: string;

  @Column({nullable: true})
  filename?: string;

  @Column({ type: 'timestamptz' })
  created: Date;

  @Column({nullable: true})
  researchNumber?: string;
}