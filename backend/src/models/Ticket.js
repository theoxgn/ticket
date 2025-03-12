module.exports = (sequelize, DataTypes) => {
    const Ticket = sequelize.define('Ticket', {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 150]
        }
      },
      description: {
        type: DataTypes.TEXT
      },
      type: {
        type: DataTypes.ENUM('bug', 'feature', 'improvement', 'task'),
        defaultValue: 'task'
      },
      status: {
        type: DataTypes.ENUM('open', 'in_progress', 'code_review', 'testing', 'closed'),
        defaultValue: 'open'
      },
      priority: {
        type: DataTypes.ENUM('lowest', 'low', 'medium', 'high', 'highest'),
        defaultValue: 'medium'
      },
      ticketKey: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      dueDate: {
        type: DataTypes.DATE
      },
      photoUrl: {
        type: DataTypes.STRING,
        allowNull: true
      },
      videoLink: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          isUrl: true
        }
      }
    }, {
      timestamps: true
    });

    Ticket.associate = (models) => {
      Ticket.belongsTo(models.User, {
        foreignKey: 'reporterId',
        as: 'reporter'
      });

      Ticket.belongsTo(models.User, {
        foreignKey: 'assigneeId',
        as: 'assignee'
      });

      Ticket.belongsTo(models.Project, {
        foreignKey: 'projectId',
        as: 'project'
      });

      Ticket.hasMany(models.Comment, {
        foreignKey: 'ticketId',
        as: 'comments'
      });
    };

    return Ticket;
  };