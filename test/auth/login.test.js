/**
 * @jest-environment node
 */

const { app } = require('../../app.js')
const request = require('supertest')
let server, agent

beforeEach((done) => {
    server = app.listen(4000, (err) => {
      if (err) return done(err);

       agent = request.agent(server); // since the application is already listening, it should use the allocated port
       done()
    })
})

afterEach((done) => {
	return server && server.close(done);
})

describe('Test getting login page', () => {
	test('It should load login page', () => {
		return agent
			.get('/login')
			.expect(200)
	})
})