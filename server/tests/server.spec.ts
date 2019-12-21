import api from '../src/api'
import app from '../src/app'

describe('Api', () => {
  it('should return an Api', () => {
    expect(api).toBeDefined()
  })
})

describe('App', () => {
  it('should return an App', () => {
    expect(app).toBeDefined()
  })
})
