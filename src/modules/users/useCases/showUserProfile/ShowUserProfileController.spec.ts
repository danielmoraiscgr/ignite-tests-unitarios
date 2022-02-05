import request from "supertest"
import { v4 as uuid } from "uuid"
import { Connection, createConnection } from "typeorm";
import { hash } from "bcryptjs";
import { app } from "../../../../app";

let connection: Connection

describe("Show User Profile Controller", ()=> {
    beforeAll(async ()=>{
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
        await connection.close; 
    });

    it("should be able to show User's profile", async() =>{
        // pegar o token primeiro
        const response = await request(app)
        .post("/api/v1/sessions")
        .send({
            email: "admin@finapi.com.br",
            password: "admin"
        })

        const { token } = response.body; 

        const showProfileUser = await request(app)
        .get("/api/v1/profile")
        .set({ 
            Authorization: `Bearer ${token}`,
        });

        expect(showProfileUser.body).toHaveProperty("id");
        expect(showProfileUser.body).toHaveProperty("email");

    })
})