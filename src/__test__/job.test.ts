import supertest from 'supertest';
import { app } from '../start';

describe('job', () => {
    describe('get job route', () => {
        // describe('given job doesnot exist ', () => {
        //     it('should return a 404', async () => {
        //         await supertest(app).get('/api/job/view').expect(404);
        //     });
        // });
        describe('given product does exist', () => {
            it('should return 200 status code and return the products', async () => {
                // const product = await createProduct();
                await supertest(app).get('/api/job/view').expect(200);
            });
        });
    });
});

