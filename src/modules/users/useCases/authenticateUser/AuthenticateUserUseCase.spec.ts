import { hash } from "bcryptjs"

import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  });

  it("should be able to authenticate user", async () => {
   
    const user: ICreateUserDTO = {
      email: "daniel@bumlai.com.br",
      name: "daniel morais",
      password: "1234",
    }
    
    await createUserUseCase.execute(user);

    const session = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(session).toHaveProperty("token");
  });

  it("should not be able to authenticate with a non-existent user", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "non@existent.com",
        password: "non-existent",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate with a wrong password", async () => {
    expect(async () => {
      await inMemoryUsersRepository.create({
        email: "test@test.com",
        name: "test",
        password: await hash("1234", 8),
      });

      await authenticateUserUseCase.execute({
        email: "test@test.com",
        password: "wrong-password",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not be able to authenticate with a wrong email", async () => {
    expect(async () => {
      await inMemoryUsersRepository.create({
        email: "test@test.com",
        name: "test",
        password: await hash("1234", 8),
      });

      const response = await authenticateUserUseCase.execute({
        email: "non@existent.com",
        password: "1234",
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});