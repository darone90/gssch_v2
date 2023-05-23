import app from '../app';
import supertest from 'supertest';
import { dotenvService } from '../services/dotEnvService';
import testDatabase from '../database/fortest';
import makeString from './utils/randomSigns';
import gsschDataSource from '../database/connection';
import userController from '../controllers/User.controller';
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
})

describe("add user", () => {
  it("add user", async () => {
    const user = await userController.addUser(dummyUser);
    expect(user).toHaveProperty('id', expect.stringMatching(/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/));
    expect(user).toHaveProperty('login');
    expect(user.login).toEqual(dummyUser.login);
    expect(user).toHaveProperty('hash');
    dummyUser.id = user.id;
  }) 
})

describe("login and password operations", () => {
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

  it('login with wrong data', async () => {
    const response = await request
      .post('/users')
      .send({login: 'xxxxx', password: 'xxxxxx'})
      .expect(401)
      const responseData = JSON.parse(response.text);
      expect(responseData).toHaveProperty('info');
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

  it("change password", async () => {
    const response = await request
      .patch("/users/password")
      .set("Cookie", authCookie)
      .send({...dummyUser, newValue:newDummyPassword})
      .expect(200)
      const responseData = JSON.parse(response.text);
      expect(responseData).toHaveProperty('info');
      dummyUser.password = newDummyPassword;
  })

  it("change login", async () => {
    const response = await request
      .patch("/users/login")
      .set("Cookie", authCookie)
      .send({...dummyUser, newValue:newDummyLogin})
      .expect(200)
      const responseData = JSON.parse(response.text);
      expect(responseData).toHaveProperty('info');
      dummyUser.login = newDummyLogin;
  })
})

describe("validator test", () => {
  it("wrong user login during user add", async () => {
    try{
      await userController.addUser({login: 'x', password: newDummyPassword})
    } catch(error){
      expect(error.message).toEqual("login or password is to short");
    }
    
  })

  it("wrong user password during user add", async () => {
    try {
      await userController.addUser({login: makeString(15), password:'x'});
    }catch(error) {
      expect(error.message).toEqual("login or password is to short");
    }
  })

  it("change login with wrong data", async () => {
    const response = await request
      .patch("/users/login")
      .set("Cookie", authCookie)
      .send({...dummyUser, newValue: "x"})
      .expect(400)
      const responseData = JSON.parse(response.text);
      expect(responseData).toHaveProperty('info', expect.stringContaining("validation error"))
  })

  it("change password with wrong data", async () => {
    const response = await request
      .patch("/users/password")
      .set("Cookie", authCookie)
      .send({...dummyUser, newValue: "x"})
      .expect(400)
      const responseData = JSON.parse(response.text);
      expect(responseData).toHaveProperty('info', expect.stringContaining("validation error"))
  })
})

describe('logout and authorization validation', () => {
  it("logout", async () => {
    const response = await request
      .get("/users/logout")
      .set("Cookie", authCookie)
      .expect(200)
    const responseData = JSON.parse(response.text);
    expect(responseData).toHaveProperty('info');
  })

  it("authorization middleware", async () => {
    const response = await request
      .patch("/users/password")
      .set("Cookie", "xxxxxxx")
      .send({...dummyUser, newValue: "xxxxxxxxxx"})
      .expect(401)
      const responseData = JSON.parse(response.text);
      expect(responseData).toHaveProperty('info', expect.stringContaining("unauthorized"))
  })
})

describe('get user list and user delete', () => {
  it("get list of user", async () => {
    const userList = await userController.usersList();
    expect(userList.length).toBeGreaterThan(0);
    expect(userList[0]).toHaveProperty('hash');
    expect(userList[0]).toHaveProperty('id');
    expect(userList[0]).toHaveProperty('login');
  })

  it("delete user", async () => {
    const deletedId = await userController.deleteUser(newDummyLogin);
    expect(deletedId).toEqual(dummyUser.id)
  })
})

afterAll(async () => {
  await testDatabase.dropDatabase();
  await testDatabase.destroy();
  await gsschDataSource.destroy();
})


