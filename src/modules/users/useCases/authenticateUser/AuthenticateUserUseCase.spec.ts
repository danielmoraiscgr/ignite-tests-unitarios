import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"

describe("Authenticate user",() => {

    let inMemoryUsersRepository: InMemoryUsersRepository
    let createUserUseCase: CreateUserUseCase
    let authenticateUserUseCase: AuthenticateUserUseCase

    beforeEach(()=> {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    })

    it("should be able to authenticate user", async ()=> {

        const userAdd = await createUserUseCase.execute({
            name: "Daniel Morais",
            email: "daniel@bumlai.com.br",
            password: "123456"
        });

        // const { user, token } = await authenticateUserUseCase.execute({
        //     email: "daniel@bumlai.com.br",
        //     password: "123456"
        // });

    

    
    })
})