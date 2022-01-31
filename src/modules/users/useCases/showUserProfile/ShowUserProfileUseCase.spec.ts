import { User } from "../../entities/User"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ShowUserProfileError } from "./ShowUserProfileError"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

describe("Profile User", () => {

    let inMemoryUsersRepository: InMemoryUsersRepository
    let showUserProfileUseCase: ShowUserProfileUseCase


    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository()
        showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)

    })

    it("should be able to show the User's Profile", async () => {

        const user = await inMemoryUsersRepository.create({
            name: "Daniel Morais",
            email: "daniel@bumlai.com.br",
            password: "123456"
        });

        if (user.id) {
            const userProfile = await showUserProfileUseCase.execute(user.id);
            expect(userProfile).toHaveProperty("email")
        }
    });

    it("should not be able to show the User's Profile with wrong id", async () => {
        expect(async () => {
            const user = await inMemoryUsersRepository.create({
                name: "Daniel Morais",
                email: "daniel@bumlai.com.br",
                password: "123456"
            });
             const userProfile = await showUserProfileUseCase.execute("321123");
        }).rejects.toBeInstanceOf(ShowUserProfileError);

    })
})