const responseUtil = require("../utils/responseUtils");
const { userService } = require("../services");
const Classroom = require("../models/Classroom");


const getClassrooms = async (req, res, next) => {
  try {
    let query = req.query;
    const classrooms = await Classroom.query()
        .where(query);
    return res.status(200).json(classrooms);
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

    return res.status(201).json(classroom);
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
    return res.sendStatus(404);
  } catch (err) {
    next(err);
  }
}

const getClassroom = async (req, res, next) => {
  try {
    const classroom = req.classroom;
    return res.status(200).json(classroom);
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

    const newClassroom = await Classroom.query()
        .updateAndFetchById(req.classroomId, classroom)
    return res.status(202).json(newClassroom);
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

    Object.entries(req.body).forEach((item) => {
      const key = item[0];
      const value =item[1];
      classroom[key] = value;
    });

    const newClassroom = await Classroom.query()
        .patchAndFetchById(req.classroomId, classroom);

    return res.status(202).json(newClassroom);
  } catch (err) {
    next(err);
  }
}

const deleteClassroom = async (req, res, next) => {
  try {
    const classroom = await Classroom.query()
        .deleteById(req.classroomId);

    return res.sendStatus(202);
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