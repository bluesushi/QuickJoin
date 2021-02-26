/**
 * @jest-environment node
 */

const fs = require('fs')
const { app } = require('../../../app.js')
const request = require('supertest')
let agent
let loginPage

/*
beforeAll((done) => {
    server = app.listen(4000, (err) => {
      if (err) 
      	return done(err)

       done()
    })
})

afterAll(() => {
	return new Promise((resolve) => {
		server && server.close(resolve)
	})
	// why can we use a promise here but not in beforeAll ?
	// return server && server.close(done);
})
*/
beforeEach(() => {
	agent = request.agent(app)
})

describe('test user login and logout', () => {
	test('It should load login page', () => {
		return agent
			.get('/login')
			.expect('Content-Type', 'text/html; charset=utf-8')
			.expect(200)
	})
	
	// test('It should not login because ')

	test('It should login user', () => {
		return agent
			.post('/userlogin')
			.send({ email: 'kaanturhans@gmail.com', password: 'blueskies' })
			.redirects(1)
			.expect(200)
	})

	test('Confirm we are logged in', () => {
		return agent
			.get('/')
			
	})

	test('It should logout user', (done) => {
		return agent
			.get('/usersignout')
			.redirects(1)
			.expect('Content-Type', 'text/html; charset=utf-8')
			.expect(200, done)
	})
})
