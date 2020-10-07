const request = require("supertest");
const app = require("../../app");
const knex = require("../../databases/knex");

beforeAll(async () => {
  await knex.migrate.down();
  await knex.migrate.latest();
  await knex.seed.run();
});

test("Log the right user in", async () => {
  const res = await request(app)
    .post("/api/user/login")
    .send({
      email: "nagisa@gmail.com",
      password: "password",
    })
    .set("content-type", "application/json");
  expect(res.status).toBe(200);
  expect(res.body.data).toBeDefined();
});

test("Keep the wrong users out", async () => {
  const res = await request(app)
    .post("/api/user/login")
    .send({
      email: "definitely.wrong.email@gmail.com",
      password: "incorrectpassword",
    })
    .set("content-type", "application/json");

  expect(res.status).toBe(401);
  expect(res.body.error).toBeDefined();
});

test("Can register user", async () => {
  const res = await request(app).post("/api/user/register").send({
    name: "Rick Sanchez",
    email: "rickboi@email.com",
    password: "password",
    role_id: 1,
  });

  const response = {
    id: expect.any(Number),
    name: "Rick Sanchez",
    email: "rickboi@email.com",
    role_id: 1,
  };

  expect(res.status).toBe(201);
  expect(res.body.data).toBeDefined();
  expect(res.body.data).toEqual(response);
});
