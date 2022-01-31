import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { OperationType } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { GetStatementOperationError } from "./GetStatementOperationError"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"

let inMemoryUsersRepository : InMemoryUsersRepository
let inMemoryStatementsRepository : InMemoryStatementsRepository
let getStatementOperationUseCase : GetStatementOperationUseCase


describe("GetStatementOperation",()=>{
    beforeEach(()=> {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        getStatementOperationUseCase = new GetStatementOperationUseCase(
            inMemoryUsersRepository,
            inMemoryStatementsRepository)
    });
 
    it("should be able to get a deposit statement operation", async() => {
        const user = await inMemoryUsersRepository.create({
            name: "daniel morais", 
            email: "daniel@bumlai.com.br",
            password: "12345"
        });

        const statement = await inMemoryStatementsRepository.create({
            amount: 70,
            description: "DEPOSITO",
            type: OperationType.DEPOSIT,
            user_id: user.id as string,
        });

        expect(statement).toHaveProperty("type");
        expect(statement.type).toEqual(OperationType.DEPOSIT);
    });

    it("should be able to get a withdraw statement operation", async() => {
        const user = await inMemoryUsersRepository.create({
            name: "daniel morais", 
            email: "daniel@bumlai.com.br",
            password: "12345"
        });

        const statement = await inMemoryStatementsRepository.create({
            amount: 50,
            description: "SAQUE",
            type: OperationType.WITHDRAW,
            user_id: user.id as string,
        });

        expect(statement).toHaveProperty("type");
        expect(statement.type).toEqual(OperationType.WITHDRAW);
    });

    it("should not be able to get a statement operation from a non existing user",async() =>{
        const statement = await inMemoryStatementsRepository.create({
            amount: 50,
            description: "SAQUE",
            type: OperationType.WITHDRAW,
            user_id: "nonexistinguser"
        });
        await expect(async ()=>{
            await getStatementOperationUseCase.execute({
                user_id: "123",
                statement_id: statement.id as string
            });
        }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
     });
    
     it("should not be able to get a statement operation from a non existing statement",async() =>{
        const user = await inMemoryUsersRepository.create({
            name: "daniel morais", 
            email: "daniel@bumlai.com.br",
            password: "12345"
        });
        await expect(async ()=>{
            await getStatementOperationUseCase.execute({
                user_id: user.id as string,
                statement_id: 'YXYXY'
            });
        }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
     });
});