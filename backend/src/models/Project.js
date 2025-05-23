module.exports = (sequelize, DataTypes) => {
    const Project = sequelize.define('Project', {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [2, 100]
        }
      },
      description: {
        type: DataTypes.TEXT
      },
      key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [2, 10]
        }
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    }, {
      timestamps: true
    });
  
    Project.associate = (models) => {
      Project.hasMany(models.Ticket, {
        foreignKey: 'projectId',
        as: 'tickets'
      });
      Project.belongsToMany(models.User, {
        through: models.UserProjects,
        as: 'members',
        foreignKey: 'projectId',
        otherKey: 'userId'
      });
    };

      // Additional helper methods for member management
  Project.prototype.hasMember = async function(userId) {
    const members = await this.getMembers({ where: { id: userId } });
    return members.length > 0;
  };
  
    return Project;
  };