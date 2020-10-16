const express = require("express");
const router = express.Router();

router.route("/")
  .get((req, res) => {
    return res.json(classrooms)
  })
  .post((req, res) => {
    const classroom = req.body;
    return res.status(201).json(classroom);
  })


router.use('/:classroomId',(req, res, next) => {
  const classroom = classrooms.find(classroom => classroom.id === parseInt(req.params.classroomId));
  if (classroom) {
    req.classroom = classroom;
    return next();
  }
  return res.sendStatus(404);
})

router.route("/:classroomId")
  .get((req, res) => {
    const classroom = req.classroom;
    return res.json(classroom);
  })

  .put((req, res) => {
    let classroom = req.classroom;
    classroom.code = req.body.code;
    classroom.school = req.body.school;
    return res.status(201).json(classroom);
  })

  .patch((req, res) => {
    let classroom = req.classroom;
    return res.status(201).json(classroom);
  })

  .delete((req, res) => {
    let classroom = req.classroom;
    return res.status(201).json(classroom);
  })

classrooms = [
  {
    id: 1,
    code: '1a2b3c',
    name: 'UI Class',
    school: 'UET',
    created_at: '',
    updated_at: ''
  },
  {
    id: 2,
    code: '1a2b3d',
    name: 'DBMS Class',
    school: 'UET',
    created_at: '',
    updated_at: ''
  },
  {
    id: 3,
    code: '1a2b3f',
    name: 'Web Class',
    school: 'UET',
    created_at: '',
    updated_at: ''
  }
]

module.exports = router;