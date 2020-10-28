const responseUtil = require("../utils/responseUtils");
const classroomService = require("../services/classroom.service");

const getClassrooms = async (req, res, next) => {
  try {
    let query = req.query;
    let user = req.user;
    const classroomsOwner = await classroomService.getClassroomOwner(user, query);
    const classroomsJoined = await classroomService.getClassroomJoined(user, query);
    return responseUtil.success(res, 200, {
      owner: classroomsOwner,
      joined: classroomsJoined,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
}

const postClassroom = async (req, res, next) => {
  try {
    const user = req.user;
    const {code, name, school} = req.body;
    const classroom = await classroomService.createClassroom({
      code: code,
      name: name,
      school: school,
    });
    await classroomService.addOwnerClassroom(classroom, user);
    return responseUtil.success(res, 201, classroom);
  } catch (err) {
    next(err);
  }
}

const middleware = async (req, res, next) => {
  try {
    const classroomId = parseInt(req.params.classroomId);
    const classroom = await classroomService.getClassroom(classroomId);

    if (classroom) {
      req.classroom = classroom;
      req.classroomId = classroomId;
      return next();
    }
    return responseUtil.error(res, 404);
  } catch (err) {
    next(err);
  }
}

const getClassroom = async (req, res, next) => {
  try {
    const classroom = req.classroom;
    return responseUtil.success(res, 200, classroom);
  } catch (err) {
    next(err);
  }
}

const putClassroom = async (req, res, next) => {
  try {
    const classroom = req.classroom;

    const {code, school, name} = req.body;

    const newClassroom = await classroomService.updateClassroom(classroom,
        {
          code: code,
          school: school,
          name: name,
        });
    return responseUtil.success(res, 202, newClassroom);
  } catch (err) {
    next(err);
  }
}

const patchClassroom = async (req, res, next) => {
  try {
    const classroom = req.classroom;
    if (req.body.id) {
      delete req.body.id;
    }
    const newClassroom = await classroomService.patchClassroom(classroom, req.body);

    return responseUtil.success(res, 202, newClassroom);
  } catch (err) {
    next(err);
  }
}

const deleteClassroom = async (req, res, next) => {
  try {
    const classroom = req.classroom;
    await classroomService.deleteClassroom(classroom);
    return responseUtil.success(res, 202, {});
  } catch (err) {
    next(err);
  }
}

const getOwners = async (req, res, next) => {
  try {
    const classroom = req.classroom;
    const owners = await classroomService.getOwners(classroom);
    return responseUtil.success(res, 200, owners);
  } catch (err) {
    next(err);
  }
}

const getStudents = async (req, res, next) => {
  try {
    const classroom = req.classroom;
    const students = await classroomService.getStudents(classroom);
    return responseUtil.success(res, 200, students);
  } catch (err) {
    next(err);
  }
}

const joinClassroom = async (req, res, next) => {
  try {
    const {user, classroom} = req;
    const response = await classroomService.joinClassroom(user, classroom);
    if (response) {
      return responseUtil.success(res, 201, response);
    }
    return responseUtil.error(res, 200, "Already joined");
  } catch (err) {
    next(err);
  }
}

const leaveClassroom = async (req, res, next) => {
  try {
    const {user, classroom} = req;
    const response = await classroomService.leaveClassroom(user, classroom);
    if (response) {
      return responseUtil.success(res, 201, response);
    }
    return responseUtil.error(res, 200, "Can leave this room");
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getClassrooms,
  postClassroom,
  middleware,
  getClassroom,
  putClassroom,
  patchClassroom,
  deleteClassroom,
  getOwners,
  getStudents,
  joinClassroom,
  leaveClassroom,

}