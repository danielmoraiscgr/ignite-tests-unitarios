import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { UsersRepository } from "../../../users/repositories/UsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { StatementsRepository } from "../../repositories/StatementsRepository"
import { CreateStatementUseCase } from "./CreateStatementUseCase"

describe("Create Statement", ()=>{

    let createStatementUseCase : CreateStatementUseCase
    let createUserUseCase: CreateUserUseCase
    let inMemoryUsersRepository : InMemoryUsersRepository
    let inMemoryStatementsRepository : InMemoryStatementsRepository

    beforeEach( ()=> {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository,inMemoryStatementsRepository);
    })

    it("Create a new stamentment to user", async() => {
        // criar primeiro usuario e pegar o id para inserir o stamente
        const user = await createUserUseCase.execute({
            name: "Daniel Morais",
            email: "daniel@bumlai.com.br",
            password: "123456"
        });

        const { id } = user; 

    })
})