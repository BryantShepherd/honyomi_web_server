const responseUtil = require("../utils/responseUtils");
const classroomService = require("../services/classroom.service");

const getClassrooms = async (req, res, next) => {
  try {
    let query = req.query;
    const classrooms = await classroomService.getAllClassrooms(query);
    return responseUtil.success(res, 200, classrooms);
  } catch (err) {
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
    await classroomService.setOwnerClassroom(classroom, user);
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

module.exports = {
  getClassrooms,
  postClassroom,
  middleware,
  getClassroom,
  putClassroom,
  patchClassroom,
  deleteClassroom
}