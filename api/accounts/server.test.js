const server = require("../server.js")
const request = require("supertest")
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
describe('endpoints', () => {
    describe('get', () => {
        it("works", async () => {
            const response = await request(server).get("/api/accounts")
            expect(response.status).toBe(200)
        })
        it("has empty array if no accounts", async () => {
            const response = await request(server).get("/api/accounts")
            expect(response.body).toHaveLength(0)
        })
        it("if there is an account it shows up", async () => {
            await db('accounts').insert(Account1)
            let response = await request(server).get('/api/accounts')
            expect(response.body).toHaveLength(1)
        })
    })
    describe('get by id', () => {
        it("gives account with correct id", async () => {
            await db('accounts').insert(Account2)
            let response = await request(server).get("/api/accounts/1")
            expect(response.body).toMatchObject(Account2)
        })
        it("responds with error code 404 if there is an error", async () => {
            let response = await request(server).get("/api/accounts/3")
            expect(response.status).toBe(404)
        })
    })
    describe('create works', () => {
        it('returns created account', async () => {
            let response = await request(server).post("/api/accounts").send({ name: 'account4', budget: 4000 })
            expect(response.body.name).toBe("account4")
            expect(response.body.budget).toBe(4000)
            expect(response.body.id).toBe(1)
        })
    })
    describe("delete deletes", () => {
        it('deletes a created account', async () => {
            await db('accounts').insert(Account2)
            let response = await request(server).get("/api/accounts/1")
            expect(response.body).toMatchObject(Account2)
            await request(server).delete("/api/accounts/1")
            const res = await request(server).get("/api/accounts")
            expect(res.body).toHaveLength(0)



        })
    })
})