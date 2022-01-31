import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { IUsersRepository } from "../../../users/repositories/IUsersRepository"
import { OperationType } from "../../entities/Statement"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { GetBalanceError } from "./GetBalanceError"
import { GetBalanceUseCase } from "./GetBalanceUseCase"

describe("GetBalance",() => {

    let inMemoryStatementsRepository : InMemoryStatementsRepository
    let inMemoryUsersRepository : InMemoryUsersRepository
    let getBalanceUseCase : GetBalanceUseCase

    beforeEach(() => {
        inMemoryStatementsRepository = new InMemoryStatementsRepository(); 
        inMemoryUsersRepository = new InMemoryUsersRepository();
        getBalanceUseCase = new GetBalanceUseCase(
            inMemoryStatementsRepository, 
            inMemoryUsersRepository);
    });

    it("should be able to get the balance", async()=> {
        const user = await inMemoryUsersRepository.create({
            name: "Daniel morais",
            email: "daniel@bumlai.com.br",
            password: "123456"
        });

        const statement1 = await inMemoryStatementsRepository.create({
            description: "DEPOSITO",
            amount: 1000,
            type: OperationType.DEPOSIT,
            user_id: user.id as string
        });
        
        const statement2 = await inMemoryStatementsRepository.create({
            description: "SAQUE",
            amount: 500,
            type: OperationType.WITHDRAW,
            user_id: user.id as string
        });

        const balance = await getBalanceUseCase.execute({ user_id: user.id as string });

        if(statement2.type === OperationType.WITHDRAW) {
            var balanceCal = statement1.amount - statement2.amount;
        } else {
            var balanceCal = statement1.amount + statement2.amount;
        }

        expect(balance).toHaveProperty("balance");
        expect(balance.balance).toEqual(balanceCal);
        expect(balance.statement).toEqual(
            expect.arrayContaining([
                statement1,
                statement2]
        ))
        
        });

        it("should not be able to get a balance from a non-existing user", async () => {
            await expect(async () => {
              await getBalanceUseCase.execute({
                user_id: "ANY"
              });
            }).rejects.toBeInstanceOf(GetBalanceError)
          });
})