require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async () => {
      execSync('npm run setup-db');
  
      await client.connect();
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
    }, 10000);
  
    afterAll(done => {
      return client.end(done);
    });

    test('GET/ returns todos', async() => {

      const expectation = [
        {
          'id': 1,
          'todo': 'wash the dishes',
          'completed': false,
          'user_id': 1
        },
        {
          'id': 2,
          'todo': 'do the laundry',
          'completed': false,
          'user_id': 1
        },
        {
          'id': 3,
          'todo': 'clean the car',
          'completed': false,
          'user_id': 1
        },
        {
          'id': 4,
          'todo': 'water the garden',
          'completed': false,
          'user_id': 1
        },
        {
          'id': 5,
          'todo': 'mow the lawn',
          'completed': false,
          'user_id': 1
        },
        {
          'id': 6,
          'todo': 'clean the bathroom',
          'completed': false,
          'user_id': 1
        }
      ];

      const data = await fakeRequest(app)
        .get('/api/todos')
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('POST/ returns newly created todo task', async() => {

      const newlyCreatedTodoTask = 
        {
          'todo': 'clean the gutters',
          'completed': false,
        };

      const data = await fakeRequest(app)
        .post('/api/todos')
        .send(newlyCreatedTodoTask)
        .set('Authorization', token)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body.todo).toEqual(newlyCreatedTodoTask.todo);
      expect(data.body.completed).toEqual(newlyCreatedTodoTask.completed);
    });

    

  });
});
