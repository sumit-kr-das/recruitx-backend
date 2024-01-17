import request from 'supertest';
import { app } from '../start';

describe('POST /users', () => {
    describe('given a username and password', () => {
        // should save the username and passowrd in the database
        // db should response with a json object contaning the user id
        // should response with a 200 status code
        test('should response with a 200 status code', async () => {
            const response = await request(app).post("/users").send({
                username: "username",
                password: "password"
            })
            expect(response.statusCode).toBe(200);
        });
        // should specify json in the content type header
        test("should specify in the content type header", async() => {
            const response = await request(app).post("/users").send ({
                username: "username",
                password: "password"
            })
            expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
        })
    });

    describe('when a username and password is missing', () => {
        // should response with a status code of 400
    });
});
