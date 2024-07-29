model RolePermissionFeature {
  id         Int        @id @default(autoincrement())
  roleId     Int
  permissionId Int
  featureId  Int

  role       RoleEntity       @relation(fields: [roleId], references: [id])
  permission PermissionEntity @relation(fields: [permissionId], references: [id])
  feature    FeatureEntity    @relation(fields: [featureId], references: [id])
}

model RoleEntity {
  id                   Int                   @id @default(autoincrement())
  rolePermissionFeature RolePermissionFeature[]
}

model PermissionEntity {
  id                   Int                   @id @default(autoincrement())
  rolePermissionFeature RolePermissionFeature[]
}

model FeatureEntity {
  id                   Int                   @id @default(autoincrement())
  rolePermissionFeature RolePermissionFeature[]
}
