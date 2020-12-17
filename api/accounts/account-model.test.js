const Account = require("./account-model.js")
const db = require('../../data/dbConfig.js')

const Account1 = { name: "account 1", budget: 1000 }
const Account2 = { name: "account 2", budget: 2000 }
const Account3 = { name: "account 3", budget: 3000 }

beforeAll(async () => {
    await db.migrate.rollback()
    await db.migrate.latest()
})

beforeEach(async () => {
    await db('accounts').truncate()
})
afterAll(async () => {
    await db.destroy()
})
describe('account model', () => {
    it('getAll works', async () => {
        const result = await Account.getAll()
        expect(result).toHaveLength(0)
    })
    it('getAll gets all accounts', async () => {
        await db("accounts").insert(Account1)
        const result = await Account.getAll()
        expect(result).toHaveLength(1)
        expect(result[0]).toMatchObject(Account1)
    })
})