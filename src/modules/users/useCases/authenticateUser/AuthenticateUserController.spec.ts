import request from "supertest"
import { v4 as uuid } from "uuid"
import { hash } from "bcryptjs";

import { Connection, createConnection } from "typeorm";

import { app } from "../../../../app";

let connection: Connection;

describe("Authenticate",() => {

    beforeAll(async ()=> {
       connection = await createConnection();
       await connection.runMigrations();
        
        const id = uuid();

        const password = await hash("admin",8);
    
        await connection.query(`
          INSERT INTO USERS(id, name, email, password, created_at, updated_at)
          values('${id}','admin','admin@finapi.com.br','${password}', 'now()','now()')`);
    });

    afterAll(async ()=> {
        await connection.dropDatabase(); 
        await connection.close(); 
    })

    it("should be able to create a session",async() => {
        const responseToken = await request(app)
        .post("/api/v1/sessions")
        .send({
            email: "admin@finapi.com.br",
            password: "admin"
        });

        expect(responseToken.body).toHaveProperty("token");
    });

    it("should not be able to authenticate with wrong email", async() =>{
        const response = await request(app)
            .post("/api/v1/sessions")
            .send({
                email: "admin@gmail.com.br",
                password: "admin",
            });

        expect(response.status).toBe(401);
    });

    it("should not be able to authenticate with wrong password", async() =>{
        const response = await request(app)
            .post("/api/v1/sessions")
            .send({
                email: "admin@finapi.com.br",
                password: "wrongpassword",
            });

        expect(response.status).toBe(401);
    });
});
    
