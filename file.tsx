 const roleAndPermission = await this.rolePermissionRepository.getAll({
      include: [
        {
          model: Feature,
          attributes: [],
        },
        {
          model: Permission,
          attributes: [],
        },
        {
          model: Role,
          attributes: [],
        },
      ],
      attributes: [
        'access',
        [Sequelize.col('feature.name'), 'feature_name'],
        [Sequelize.col('role.name'), 'role_name'],
        [Sequelize.col('feature.id'), 'feature_id'],
        [Sequelize.col('permission.name'), 'permission_name'],
        [Sequelize.col('permission.id'), 'permission_id'],
      ],
      where: {
        role_id: user.role_id,
      },
    });
    const role = await this.roleRepository.getAll({});

    const permission = await this.permissionRepository.getAll({});

    const trainerRating = await this.trainerRepository.getAllSurveyRating(req, res);
