import request from 'supertest'
import { app } from './app'

describe('Test', () => {
  it('Testing route get', async () => {
    const response = await request(app).get('/')

    expect(response.body).toEqual({ alive: true })
    expect(response.status).toBe(200)
  })
})
