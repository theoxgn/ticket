module.exports = (sequelize, DataTypes) => {
  const UserProjects = sequelize.define('UserProjects', {
    role: {
      type: DataTypes.ENUM('owner', 'manager', 'member'),
      defaultValue: 'member'
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    projectId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Projects',
        key: 'id'
      }
    }
  }, {
    tableName: 'UserProjects'
  });

  return UserProjects;
};