const responseUtil = require("../utils/responseUtils");
const { userService } = require("../services");
const Classroom = require("../models/Classroom");


const getClassrooms = async (req, res, next) => {
  try {
    let query = req.query;
    const classrooms = await Classroom.query()
        .where(query);
    return responseUtil.success(res, 200, classrooms);
  } catch (err) {
    next(err);
  }
}

const postClassroom = async (req, res, next) => {
  try {
    const {code, name, school} = req.body;
    const classroom = await Classroom.query()
        .insert({
          code: code,
          name: name,
          school: school
        });

    return responseUtil.success(res, 201, classroom);
  } catch (err) {
    next(err);
  }
}

const middleware = async (req, res, next) => {
  try {
    const classroomId = parseInt(req.params.classroomId);
    const classroom = await Classroom.query()
        .findById(classroomId);

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

    classroom.code = req.body.code;
    classroom.school = req.body.school;
    classroom.name = req.body.name;

    const newClassroom = await classroom.$query().updateAndFetch();

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

    const newClassroom = await classroom.$query().patchAndFetch(req.body);

    return responseUtil.success(res, 202, newClassroom);
  } catch (err) {
    next(err);
  }
}

const deleteClassroom = async (req, res, next) => {
  try {
    await req.classroom.$query().delete();

    return responseUtil.success(res, 202);
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