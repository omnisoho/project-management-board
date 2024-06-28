const prisma = require('./prismaClient');

module.exports.createTask = function createTask(name, statusId) {
  return prisma.task
    .create({
      data: {
        name,
        statusId,
      },
    })
    .then((task) => {
      console.log('Task created:', task);
      return task;
    });
};

module.exports.getAllTasks = function getAllTasks() {
  return prisma.task
    .findMany({
      include: {
        status: true,
        persons: {
          include: {
            person: true,
          },
        },
      },
    })
    .then((tasks) => {
      console.log('All tasks:', tasks);
      return tasks;
    });
};

module.exports.getTasksByStatus = function getTasksByStatus(statusId) {
  return prisma.task
    .findMany({
      where: { statusId },
      include: {
        status: true,
        persons: {
          include: {
            person: true,
          },
        },
      },
    })
    .then((tasks) => {
      console.log(`Tasks with status ID ${statusId}:`, tasks);
      return tasks;
    });
};

module.exports.updateTask = function updateTask(id, data) {
  return prisma.task
    .update({
      where: { id },
      data,
    })
    .then((task) => {
      console.log('Task updated:', task);
      return task;
    });
};

module.exports.deleteTask = function deleteTask(id) {
  return prisma.task
    .delete({
      where: { id },
    })
    .then((task) => {
      console.log('Task deleted:', task);
      return task;
    });
};
