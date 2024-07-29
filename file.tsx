import { PrismaClient } from '@prisma/client';
import { permissions, roles, features, rolePermissions } from './../../resources/seedData';

const prisma = new PrismaClient();

export async function seedData(): Promise<void> {
  for (const permission of permissions) {
    const isExist = await prisma.permissionEntity.findUnique({
      where: {
        action: permission,
      },
    });
    if (isExist) continue;
    await prisma.permissionEntity.create({
      data: {
        action: permission,
      },
    });
  }

  for (const role of roles) {
    const isExist = await prisma.roleEntity.findUnique({
      where: {
        role_name: role,
      },
    });
    if (isExist) continue;
    await prisma.roleEntity.create({
      data: { role_name: role },
    });
  }

  for (const feature of features) {
    const isExist = await prisma.featureEntity.findUnique({
      where: {
        name: feature,
      },
    });
    if (isExist) continue;
    await prisma.featureEntity.create({
      data: { name: feature },
    });
  }

  for (const roleKey in rolePermissions) {
    const role = await prisma.roleEntity.findUnique({
      where: { role_name: roleKey },
    });
    if (!role) continue;

    for (const featureKey in rolePermissions[roleKey as keyof typeof rolePermissions]) {
      const feature = await prisma.featureEntity.findUnique({
        where: { name: featureKey },
      });
      if (!feature) continue;

      for (const _permission of rolePermissions[roleKey as keyof typeof rolePermissions][featureKey as keyof typeof rolePermissions[typeof roleKey]]) {
        const permission = await prisma.permissionEntity.findUnique({
          where: { action: _permission },
        });
        if (!permission) continue;

        const isExist = await prisma.rolePermissionFeature.findFirst({
          where: {
            roleId: role.id,
            featureId: feature.id,
            permissionId: permission.id,
          },
        });
        if (isExist) continue;

        await prisma.rolePermissionFeature.create({
          data: {
            role: { connect: { id: role.id } },
            feature: { connect: { id: feature.id } },
            permission: { connect: { id: permission.id } },
          },
        });
      }
    }
  }
}
