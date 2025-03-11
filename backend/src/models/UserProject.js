module.exports = (sequelize, DataTypes) => {
    const UserProject = sequelize.define('UserProject', {
      role: {
        type: DataTypes.ENUM('owner', 'manager', 'member'),
        defaultValue: 'member'
      }
    }, {
      timestamps: true
    });
  
    return UserProject;
};