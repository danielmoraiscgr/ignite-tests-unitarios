import request from "supertest";
import { v4 as uuid } from "uuid"

import { Connection, createConnection } from "typeorm"
import { hash } from "bcryptjs";
import { app } from "../../../../app";
import { OperationType } from "../../entities/Statement";

let connection: Connection
let token: string; 

describe("Create Statement Controller", () => {
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
        
    });
    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });


    it("should not be able to do a deposit statement with wrong token",async()=>{ 
        const statement = await request(app)
        .post("/api/v1/statements/deposit")
        .set({
            Authorization: `Bearer invalidToken`,
        })
        .send({
            amount: 100,
            description: "Deposit",
            type: OperationType.DEPOSIT,
        });

        expect(statement.status).toBe(401);
    });

    it("should be able to do a deposit statement",async()=>{ 
        const statement = await request(app)
        .post("/api/v1/statements/deposit")
        .set({
            Authorization: `Bearer ${token}`,
        })
        .send({
            amount: 100,
            description: "Deposit",
            type: OperationType.DEPOSIT,
        });

        expect(statement.status).toBe(201);
    });
   
    it("should be able to do a withdraw statement",async()=>{ 
        const statement = await request(app)
        .post("/api/v1/statements/withdraw")
        .set({
            Authorization: `Bearer ${token}`,
        })
        .send({
            amount: 50,
            description: "Saque",
            type: OperationType.WITHDRAW,
        });

        expect(statement.status).toBe(201);
    });
  
    it("should not be able to do a withdraw without enough balance",async()=>{ 
        const statement = await request(app)
        .post("/api/v1/statements/withdraw")
        .set({
            Authorization: `Bearer ${token}`,
        })
        .send({
            amount: 60,
            description: "Saque",
            type: OperationType.WITHDRAW,
        });

        expect(statement.status).toBe(400);
    });
});