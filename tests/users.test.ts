import app from '../app';
import RoleSeed from '../database/seeders/Role.seed'
import supertest from 'supertest';
import { dotenvService } from '../services/dotEnvService';
import gsschDataSource from '../database/connection';
import testDatabase from '../database/fortest';
import makeString from './utils/randomSigns';
dotenvService;
const request = supertest(app);

interface DummyUser {
  login: string;
  password: string;
  id?: string;
}

jest.setTimeout(15000);

const dummyUser: DummyUser = {
  login: makeString(20),
  password: makeString(20)
}

const newDummyLogin = makeString(20);
const newDummyPassword = makeString(20);
let authCookie: string[];

beforeAll(async () => {
  await testDatabase.initialize();
  await RoleSeed();
})

describe("CRUD for user instance", () => {
  it("add user", async () => {
    const response = await request
      .post("/users/user")
      .send(dummyUser)
      .expect(201)
    const responseData = JSON.parse(response.text);
    expect(responseData).toHaveProperty('id', expect.stringMatching(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/));
    expect(responseData).toHaveProperty('info');
    dummyUser.id = responseData.id;
  })

  it("change password", async () => {
    const response = await request
      .patch("/users/password")
      .send({...dummyUser, newValue:newDummyPassword})
      .expect(200)
      const responseData = JSON.parse(response.text);
      expect(responseData).toHaveProperty('info');
      dummyUser.password = newDummyPassword;
  })

  it("change login", async () => {
    const response = await request
      .patch("/users/login")
      .send({...dummyUser, newValue:newDummyLogin})
      .expect(200)
      const responseData = JSON.parse(response.text);
      expect(responseData).toHaveProperty('info');
      dummyUser.login = newDummyLogin;
  })
  
})

describe("login and logout", () => {
  it('login', async () => {
    const response = await request
      .post('/users')
      .send(dummyUser)
      .expect(200)
      const responseData = JSON.parse(response.text);
      expect(responseData).toHaveProperty('login', expect.stringMatching(dummyUser.login));
      expect(responseData).toHaveProperty('info');
      authCookie = response.headers['set-cookie'];
  })

  it('is user logged in check', async () => {
    const response = await request
      .get("/users")
      .set("Cookie", authCookie)
      .expect(200)
    const responseData = JSON.parse(response.text);
    expect(responseData).toHaveProperty('login', expect.stringMatching(dummyUser.login));
    expect(responseData).toHaveProperty('info');
  })
  
  it("logout", async () => {
    const response = await request
      .get("/users/logout")
      .set("Cookie", authCookie)
      .expect(200)
    const responseData = JSON.parse(response.text);
    expect(responseData).toHaveProperty('info');
  })
})

describe("validator middleware test", () => {
  it("wrong user login during user add", async () => {
    const response = await request
      .post("/users/user")
      .send({login: "", password: newDummyPassword})
      .expect(400)
      const responseData = JSON.parse(response.text);
      expect(responseData).toHaveProperty('info', expect.stringContaining("validation error"))
  })

  it("wrong user password during user add", async () => {
    const response = await request
      .post("/users/user")
      .send({login: newDummyLogin, password: ""})
      .expect(400)
      const responseData = JSON.parse(response.text);
      expect(responseData).toHaveProperty('info', expect.stringContaining("validation error"))
  })

  it("change login with wrong data", async () => {
    const response = await request
      .patch("/users/login")
      .send({...dummyUser, newValue: ""})
      .expect(400)
      const responseData = JSON.parse(response.text);
      expect(responseData).toHaveProperty('info', expect.stringContaining("validation error"))
  })

  it("change password with wrong data", async () => {
    const response = await request
      .patch("/users/password")
      .send({...dummyUser, newValue: ""})
      .expect(400)
      const responseData = JSON.parse(response.text);
      expect(responseData).toHaveProperty('info', expect.stringContaining("validation error"))
  })
})

describe('get user list and user delete', () => {
  it("get list of user", async () => {
    const response = await request
      .get("/users/users")
      .expect(200)
    const responseData = JSON.parse(response.text);
    console.log(responseData);
    
    expect(responseData.length).toBeGreaterThan(0);
    expect(responseData[0]).toHaveProperty('login', expect.stringMatching(dummyUser.login));
    expect(responseData[0]).toHaveProperty('id', expect.stringMatching(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/));
  })

  it("delete user", async () => {
    const response = await request
      .delete("/users/user")
      .send({login: dummyUser.login})
      .expect(200)
    const responseData = JSON.parse(response.text);
    expect(responseData).toHaveProperty('info');
  })

  it("get list of user after delete", async () => {
    const response = await request
      .get("/users/users")
      .expect(200)
    const responseData = JSON.parse(response.text);
    expect(responseData.length).toEqual(0);
  })
})

afterAll(async () => {
  await testDatabase.dropDatabase();
  await testDatabase.destroy();
  await gsschDataSource.destroy();
})


