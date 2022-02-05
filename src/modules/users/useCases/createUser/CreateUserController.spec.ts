import { hash } from "bcryptjs";
import request from "supertest";
import { v4 as uuid } from "uuid"

import { Connection, createConnection  } from "typeorm";
import { app } from "../../../../app";

let connection : Connection

describe("Create User Controller", ()=> {
    beforeAll(async ()=> {
        connection = await createConnection();
        await connection.runMigrations(); 

        const id = uuid();

        const password = await hash("admin",8);
    
        await connection.query(`
          INSERT INTO USERS(id, name, email, password, created_at, updated_at)
          values('${id}','admin','admin@finapi.com.br','${password}', 'now()','now()')`);
    });

    afterAll(async()=>{
        await connection.dropDatabase(); 
        await connection.close(); 
    });

    it("should be able to create a new user", async()=> {
        const response = await request(app)
        .post("/api/v1/users")
        .send({
            name: "daniel morais",
            email: "daniel@gmail.com",
            password: "admin1234",
        });

        expect(response.status).toBe(201);
        
    })
})


