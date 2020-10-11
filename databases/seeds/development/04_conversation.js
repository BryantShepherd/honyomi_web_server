exports.seed = function (knex) {
  return knex("conversation")
    .del()
    .then(function () {
      return knex("conversation").insert([
        {
          name: null,
          classroom_id: 1,
          creator_id: 1,
        },
        {
          name: "Group Chat 2",
          classroom_id: 2,
          creator_id: 2,
        },
        {
          name: null,
          classroom_id: 3,
          creator_id: 3,
        },
      ]);
    });
};
