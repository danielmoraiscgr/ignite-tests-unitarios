import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { OperationType } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "./CreateStatementUseCase"

describe("Create Statement", ()=>{

    let inMemoryStatementsRepository : InMemoryStatementsRepository
    let inMemoryUsersRepository : InMemoryUsersRepository
    let createStatementUseCase : CreateStatementUseCase

    beforeEach( ()=> {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        inMemoryStatementsRepository = new InMemoryStatementsRepository()
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository,inMemoryStatementsRepository);
    })

    it("should be able to create a new stamentment", async() => {
        const user = await inMemoryUsersRepository.create({
            name: "Daniel Morais",
            email: "daniel@bumlai.com.br",
            password: "123456"
        });

         const statement = await inMemoryStatementsRepository.create({
                user_id: user.id as string,
                description: "description",
                amount: 100,
                type: OperationType.DEPOSIT

            });

            expect(statement).toHaveProperty("id");
            expect(statement.user_id).toEqual(user.id); 
        });
})