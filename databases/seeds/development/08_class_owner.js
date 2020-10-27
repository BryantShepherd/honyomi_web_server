exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("class_owner")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("class_owner").insert([
        {
          teacher_id: 1,
          classroom_id: 1,
        },
        {
          teacher_id: 2,
          classroom_id: 2,
        },
        {
          teacher_id: 3,
          classroom_id: 3,
        },
        {
          teacher_id: 1,
          classroom_id: 3,
        },
      ]);
    });
};
