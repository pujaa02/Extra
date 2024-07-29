import { features, rolePermissions } from './../../resources/seedData';
import { DataSource, Repository } from 'typeorm';
import { PermissionEntity } from 'src/entities/permission.entity';
import { RoleEntity } from 'src/entities/role.entity';
import { permissions, roles } from 'src/resources/seedData';
import { FeatureEntity } from 'src/entities/feature.entity';
import { RolePermissionFeature } from 'src/entities/rolePermissions.entity';

export async function seedData(dataSource: DataSource): Promise<void> {
  const permissionRepository: Repository<PermissionEntity> =
    dataSource.getRepository(PermissionEntity);
  const roleRepository: Repository<RoleEntity> =
    dataSource.getRepository(RoleEntity);
  const featureRepository: Repository<FeatureEntity> =
    dataSource.getRepository(FeatureEntity);
  const rolePermissionsRepository: Repository<RolePermissionFeature> =
    dataSource.getRepository(RolePermissionFeature);

  for (const permission of permissions) {
    const isExist: PermissionEntity = await permissionRepository.findOne({
      where: {
        action: permission,
      },
    });
    if (isExist) continue;
    await permissionRepository.save({
      action: permission,
    });
  }

  for (const role of roles) {
    const isExist: RoleEntity = await roleRepository.findOne({
      where: {
        role_name: role,
      },
    });
    if (isExist) continue;
    await roleRepository.save({ role_name: role });
  }

  for (const feature of features) {
    const isExist: FeatureEntity = await featureRepository.findOne({
      where: {
        name: feature,
      },
    });
    if (isExist) continue;
    await featureRepository.save({ name: feature });
  }

  for (const roleKey in rolePermissions) {
    const role: RoleEntity = await roleRepository.findOne({
      where: { role_name: roleKey },
    });
    if (!role) continue;
    for (const featureKey in rolePermissions[
      roleKey as keyof object
    ] as object) {
      const feature: FeatureEntity = await featureRepository.findOne({
        where: { name: featureKey },
      });
      if (!feature) continue;
      for (const _permission of rolePermissions[roleKey as keyof object][
        featureKey as keyof object
      ] as string[]) {
        const permission: PermissionEntity = await permissionRepository.findOne(
          {
            where: { action: _permission },
          },
        );
        if (!permission) continue;
        const isExist: RolePermissionFeature =
          await rolePermissionsRepository.findOne({
            where: {
              role,
              feature,
              permission,
            },
          });
        if (isExist) continue;
        await rolePermissionsRepository.save({
          role,
          feature,
          permission,
        });
      }
    }
  }
}
