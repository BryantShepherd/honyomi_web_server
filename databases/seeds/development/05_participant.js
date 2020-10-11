exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("participant")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("participant").insert([
        {
          user_id: 1,
          conversation_id: 1,
          type: "private",
        },
        {
          user_id: 2,
          conversation_id: 1,
          type: "private",
        },
        {
          user_id: 1,
          conversation_id: 3,
          type: "group",
        },
        {
          user_id: 2,
          conversation_id: 3,
          type: "group",
        },
        {
          user_id: 3,
          conversation_id: 3,
          type: "group",
        },
        {
          user_id: 2,
          conversation_id: 2,
          type: "group",
        },
        {
          user_id: 3,
          conversation_id: 2,
          type: "group",
        },
      ]);
    });
};
