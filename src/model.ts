import {BaseEntity, Column, PrimaryColumn, VersionColumn} from 'typeorm';

/**
 * Public entity.
 */
export class PublicEntity extends BaseEntity {
  /**
   * Data ID.
   */
  @PrimaryColumn({
    type: 'bigint',
    nullable: false,
    comment: 'Data ID.',
  })
  id!: string;

  /**
   * Project ID.
   */
  @Column({
    name: 'project_id',
    type: 'bigint',
    nullable: false,
    default: '0',
    comment: 'Project ID.',
  })
  projectId!: string;

  /**
   * Data creation time.
   */
  @Column({
    name: 'created_at',
    type: 'bigint',
    nullable: false,
    comment: 'Data creation time.',
  })
  createdAt!: string;

  /**
   * Data update time.
   */
  @Column({
    name: 'updated_at',
    type: 'bigint',
    nullable: false,
    comment: 'Data update time.',
  })
  updatedAt!: string;

  /**
   * Data delete time.
   */
  @Column({
    name: 'deleted_at',
    type: 'bigint',
    nullable: false,
    default: '0',
    comment: 'Data delete time.',
  })
  deletedAt!: string;

  /**
   * Data version.
   */
  @VersionColumn({
    type: 'bigint',
    nullable: false,
    comment: 'Data version.',
  })
  version!: string;
}
