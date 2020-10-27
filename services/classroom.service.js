const Classroom = require("../models/Classroom");
const User = require("../models/User");

function getAllClassrooms(query) {
  return Classroom.query().where(query);
}

/**
 *
 * @param {int} classroomId
 */
function getClassroom(classroomId) {
  return Classroom.query()
      .findById(classroomId);
}

/**
 * Create new classroom
 * @param {Classroom} classroom
 */
function createClassroom(classroom) {
  return Classroom.query().insert(classroom);
}

/**
 *
 * @param {Classroom} classroom
 * @param {User} owner
 */
function addOwnerClassroom(classroom, owner) {
  return classroom.$relatedQuery("owner").relate(owner);
}

/**
 *
 * @param {Classroom} classroom
 */
function deleteClassroom(classroom) {
  return classroom.$query().delete();
}

/**
 *
 * @param {Classroom} classroom
 * @param {{code: *, school: *, name: *}} newClassroom
 */
function updateClassroom(classroom, newClassroom) {
  return classroom.$query().patchAndFetch(newClassroom);
}

/**
 *
 * @param {Classroom} classroom
 * @param {Classroom|Model} newClassroom
 */
function patchClassroom(classroom, newClassroom) {
  return classroom.$query().patchAndFetch(newClassroom);
}

module.exports = {
  getAllClassrooms,
  getClassroom,
  createClassroom,
  setOwnerClassroom: addOwnerClassroom,
  deleteClassroom,
  updateClassroom,
  patchClassroom
}