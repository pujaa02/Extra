// Fetch role and permission with associated feature, role, and permission data
const roleAndPermission = await prisma.rolePermission.findMany({
  where: {
    roleId: user.role_id, // Assuming 'roleId' is the correct field name
  },
  include: {
    feature: {
      select: {
        name: true,
        id: true,
      },
    },
    permission: {
      select: {
        name: true,
        id: true,
      },
    },
    role: {
      select: {
        name: true,
      },
    },
  },
});

// Fetch all roles
const role = await prisma.role.findMany({});

// Fetch all permissions
const permission = await prisma.permission.findMany({});

// Fetch trainer ratings (assuming this is a custom method or a relation in the trainer model)
const trainerRating = await prisma.trainer.getSurveyRating(req, res);
