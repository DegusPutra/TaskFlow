import UserModel from "./user.js";
import ProjectModel from "./project.js";
import ProjectMemberModel from "./projectMember.js";
import ColumnModel from "./column.js";
import TaskModel from "./task.js";
import InviteModel from "./invite.js";

export default (sequelize) => {
  // Inisialisasi semua model
  const User = UserModel(sequelize);
  const Project = ProjectModel(sequelize);
  const ProjectMember = ProjectMemberModel(sequelize);
  const Column = ColumnModel(sequelize);
  const Task = TaskModel(sequelize);
  const Invite = InviteModel(sequelize);

  // 1. User - Project (Admin)
  User.hasMany(Project, { foreignKey: "adminId", as: "ownedProjects" });
  Project.belongsTo(User, { foreignKey: "adminId", as: "admin" });

  // 2. Project - ProjectMember (Many to Many via ProjectMember)
  Project.hasMany(ProjectMember, {
    foreignKey: "projectId",
    onDelete: "CASCADE",
    as: "memberships",
  });
  ProjectMember.belongsTo(Project, { foreignKey: "projectId" });

  User.hasMany(ProjectMember, { foreignKey: "userId", as: "projectRoles" });
  ProjectMember.belongsTo(User, { foreignKey: "userId", as: "member" });

  // 3. Project - Column
  Project.hasMany(Column, {
    foreignKey: "projectId",
    onDelete: "CASCADE",
    as: "columns",
  });
  Column.belongsTo(Project, { foreignKey: "projectId" });

  // 4. Column - Task
  Column.hasMany(Task, {
    foreignKey: "columnId",
    onDelete: "SET NULL",
    as: "tasks",
  });
  Task.belongsTo(Column, { foreignKey: "columnId" });

  // 5. Project - Task
  Project.hasMany(Task, {
    foreignKey: "projectId",
    onDelete: "CASCADE",
    as: "tasks",
  });
  Task.belongsTo(Project, { foreignKey: "projectId" });

  // 6. User - Task (creator & assignee)
  User.hasMany(Task, { foreignKey: "createdBy", as: "createdTasks" });
  Task.belongsTo(User, { foreignKey: "createdBy", as: "creator" });

  User.hasMany(Task, { foreignKey: "assigneeId", as: "assignedTasks" });
  Task.belongsTo(User, { foreignKey: "assigneeId", as: "assignee" });

  // 7. Project - Invite
  Project.hasMany(Invite, {
    foreignKey: "projectId",
    onDelete: "CASCADE",
    as: "invites",
  });
  Invite.belongsTo(Project, { foreignKey: "projectId" });

  // Return semua model
  return {
    User,
    Project,
    ProjectMember,
    Column,
    Task,
    Invite,
  };
};
