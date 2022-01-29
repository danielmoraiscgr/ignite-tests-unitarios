import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError"
import { CreateUserUseCase } from "./CreateUserUseCase"


describe("Create User", () => {
    let createUserUseCase: CreateUserUseCase
    let inMemoryUsersRepository: InMemoryUsersRepository

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    });
    
    it("should be able to add a new user", async () => {

        const user = await createUserUseCase.execute({
            name: "Daniel Morais",
            email: "daniel@bumlai.com.br",
            password: "123456"
        });


        expect(user).toHaveProperty("id");
        expect(user.name).toEqual("Daniel Morais");
    });

    it("should not be able to add a new user with same email", async () => {

        expect(async ()=> {
             await createUserUseCase.execute({
                name: "Daniel Morais",
                email: "daniel@bumlai.com.br",
                password: "123456"
            });

            const user = await createUserUseCase.execute({
                name: "Daniel Morais",
                email: "daniel@bumlai.com.br",
                password: "123456"
            });
        }).rejects.toBeInstanceOf(CreateUserError);

    });
})