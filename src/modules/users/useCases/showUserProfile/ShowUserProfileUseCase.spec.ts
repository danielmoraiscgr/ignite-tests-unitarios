import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

describe("Profile User", ()=> {
     
    let inMemoryUsersRepository : InMemoryUsersRepository
    let showUserProfileUseCase : ShowUserProfileUseCase
    let createUserUseCase : CreateUserUseCase

    beforeEach(()=> {
         inMemoryUsersRepository = new InMemoryUsersRepository()
         showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)
         createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    })
    
    it("should be able to show the User's Profile", async() => {

        const user = await createUserUseCase.execute({
            name: "Daniel Morais",
            email: "daniel@bumlai.com.br",
            password: "123456"
        });

        const userProfile = await showUserProfileUseCase.execute(user.id);

        expect(userProfile).toBe(200);

    })
})