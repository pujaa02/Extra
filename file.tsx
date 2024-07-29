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
