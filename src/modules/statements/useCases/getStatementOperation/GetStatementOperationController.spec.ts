import request from "supertest"
import { hash } from "bcryptjs";
import { Connection, createConnection } from "typeorm";
import { v4 as uuid } from "uuid"

import { app } from "../../../../app";

let connection: Connection
let token: string
let operationId: string

describe("Get Statement Operation Controller", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();

        const id = uuid();

        const password = await hash("admin", 8);

        await connection.query(`
        INSERT INTO USERS(id, name, email, password, created_at, updated_at)
        values('${id}','admin','admin@finapi.com.br','${password}', 'now()','now()')`);

        const response = await request(app)
            .post("/api/v1/sessions")
            .send({
                email: "admin@finapi.com.br",
                password: "admin",
            });

        const { body } = response;

        token = body.token;

        const responseId = await request(app)
            .post("/api/v1/statements/deposit")
            .send({
                email: "admin@finapi.com.br",
                password: "admin",
            })
            .set({
                Authorization: `Bearer ${token}`,
            });

        operationId = responseId.body.id;

    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close;
    });

    it("should not be able to get a statement operation from a non existent user", async () => {
        const response = await request(app)
            .get(`/api/v1/statements/${operationId}`)
            .set({
                Authorization: `Bearer ${token}`,
            })
    });
});