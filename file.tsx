import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { RoleEntity } from './role.entity';
import { PermissionEntity } from './permission.entity';
import { FeatureEntity } from './feature.entity';

@Entity()
export class RolePermissionFeature {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => RoleEntity, (role) => role.id, { cascade: true })
  role: RoleEntity;

  @ManyToOne(() => PermissionEntity, (permission) => permission.id, {
    cascade: true,
  })
  permission: PermissionEntity;

  @ManyToOne(() => FeatureEntity, (feature) => feature.id, { cascade: true })
  feature: FeatureEntity;
}
