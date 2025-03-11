module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      }
    }, {
      timestamps: true
    });
  
    Comment.associate = (models) => {
      Comment.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
  
      Comment.belongsTo(models.Ticket, {
        foreignKey: 'ticketId',
        as: 'ticket'
      });
    };
  
    return Comment;
  };
  