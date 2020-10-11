function buildRows(knex) {
  let rows = [];
  for (let i of [1, 2, 3]) {
    for (let j of [1, 2, 3]) {
      rows.push({
        student_id: i,
        classroom_id: j,
        joined_date: knex.fn.now(),
      });
    }
  }
  return rows;
}

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("m_student_classroom")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("m_student_classroom").insert(buildRows(knex));
    });
};
