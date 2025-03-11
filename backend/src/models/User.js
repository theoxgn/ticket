module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 30]
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      role: {
        type: DataTypes.ENUM('admin', 'manager', 'developer', 'user'),
        defaultValue: 'user'
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      }
    }, {
      timestamps: true
    });
  
    User.associate = (models) => {
      User.hasMany(models.Ticket, {
        foreignKey: 'reporterId',
        as: 'reportedTickets'
      });
      
      User.hasMany(models.Ticket, {
        foreignKey: 'assigneeId',
        as: 'assignedTickets'
      });
  
      User.belongsToMany(models.Project, {
        through: 'UserProjects',
        as: 'projects',
        foreignKey: 'userId'
      });
    };
  
    return User;
  };