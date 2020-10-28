const express = require("express");
const router = express.Router();
const classroomController = require("../controllers/classroom.controller");
const auth = require("../config/auth");

router.use("/", auth.jwtAuth());

router.route("/")
  .get(classroomController.getClassrooms)
  .post(classroomController.postClassroom)

router.use('/:classroomId', classroomController.middleware)

router.route("/:classroomId")
  .get(classroomController.getClassroom)
  .put(classroomController.putClassroom)
  .patch(classroomController.patchClassroom)
  .delete(classroomController.deleteClassroom)

router.get("/:classroomId/owners", classroomController.getOwners)

router.get("/:classroomId/students", classroomController.getStudents)

router.post("/:classroomId/students/join", classroomController.joinClassroom)

router.post("/:classroomId/students/leave", classroomController.leaveClassroom)

module.exports = router;