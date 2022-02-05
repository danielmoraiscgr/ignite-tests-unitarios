
import request from "supertest"
import { v4 as uuid } from "uuid"
import { hash } from "bcryptjs";

import { Connection } from "typeorm";

import { app } from "../../../../app";

//import createConnection from "../../../../database"

// let connection: Connection;

// describe("Authenticate",() => {
//     beforeAll(async ()=> {
//         connection = await createConnection();
//         await connection.runMigrations();
        
//         const id = uuid();

//         const password = await hash("admin",8);
    
//         await connection.query(`
//           INSERT INTO USERS(id, name, email, password, created_at, updated_at)
//           values('${id}','admin','admin@finapi.com.br','${password}', 'now()','now()')`);
//     });

//     it("should be able to authenticate a user",async() => {
//         const responseToken = await request(app)
//         .post("sessions")
//         .send({
//             email: "admin@finapi.com.br",
//             password: "admin"
//         });

//         const { token } = responseToken.body;

//         expect(responseToken.body).toHaveProperty("token");
//     });

//     afterAll(async ()=> {
//         await connection.dropDatabase(); 
//         await connection.close(); 
//     })
// });
    
