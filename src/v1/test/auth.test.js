/**
 * * During the test we are going to use test environment config
 * * as mongo will use auth_test db and redis will use db index 15
 * @example redis://redis:6379/15
 * * these dbs are assigned for our test environment
 */
process.env.NODE_ENV = 'test';

const { baseRoute } = require('../configs/app.config');
const User = require('../models/user.model');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../index');
const should = chai.should();

chai.use(chaiHttp);

const newUser = {
  email: 'test@gmail.com',
  password: '123456',
};
let verifyToken = '';
let verifyCode = '';
let forgotPassToken = '';
let forgotPassCode = '';
let accessToken = '';
let refreshToken = '';

resetAllTestVariables = () => {
  verifyToken = '';
  verifyCode = '';
  forgotPassToken = '';
  forgotPassCode = '';
  accessToken = '';
  refreshToken = '';
};

describe('Auth controller tests', () => {
  before((done) => {
    User.deleteMany({}, () => {
      done();
    });
  });

  after((done) => {
    resetAllTestVariables();
    done();
  });

  describe('[POST] /auth/sign-up |Sign-Up Process Test', () => {
    it('it should initiate sign-up process using route: [POST] /auth/sign-up', (done) => {
      chai
        .request(server)
        .post(`${baseRoute}/auth/sign-up`)
        .send(newUser)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('message');
          res.body.should.have.property('result');
          res.body.result.should.be.a('object');
          res.body.result.should.have.property('token');
          res.body.result.should.have.property('code');
          verifyToken = res.body.result.token;
          verifyCode = res.body.result.code;
          done();
        });
    });

    it('it should compete sign-up process by verifying using route: [POST] /auth/verify', (done) => {
      chai
        .request(server)
        .post(`${baseRoute}/auth/verify`)
        .set('Authorization', `Bearer ${verifyToken}`)
        .send({ code: verifyCode })
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('message');
          res.body.should.have.property('result');
          res.body.result.should.be.a('object');
          res.body.result.should.have.property('email').eql(newUser.email);
          res.body.result.should.have.property('_id');
          res.body.result.should.have.property('accessToken');
          res.body.result.should.have.property('refreshToken');
          accessToken = res.body.result.accessToken;
          refreshToken = res.body.result.refreshToken;
          done();
        });
    });
  });

  describe('[POST] /auth/sign-in |Sign-in Process Test', () => {
    it('it should initiate sign-in process using route: [POST] /auth/sign-in ', (done) => {
      chai
        .request(server)
        .post(`${baseRoute}/auth/sign-in`)
        .send(newUser)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('message');
          res.body.should.have.property('result');
          res.body.result.should.be.a('object');
          res.body.result.should.have.property('token');
          res.body.result.should.have.property('code');
          verifyToken = res.body.result.token;
          verifyCode = res.body.result.code;
          done();
        });
    });

    it('it should compete sign-in process by verifying using route: [POST] /auth/verify', (done) => {
      chai
        .request(server)
        .post(`${baseRoute}/auth/verify`)
        .set('Authorization', `Bearer ${verifyToken}`)
        .send({ code: verifyCode })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('message');
          res.body.should.have.property('result');
          res.body.result.should.be.a('object');
          res.body.result.should.have.property('accessToken');
          res.body.result.should.have.property('refreshToken');
          accessToken = res.body.result.accessToken;
          refreshToken = res.body.result.refreshToken;
          done();
        });
    });
  });

  describe('[POST] /auth/forgot-password |Forgot-Password Process Test', () => {
    it('it should initiate forgot-password process', (done) => {
      chai
        .request(server)
        .post(`${baseRoute}/auth/forgot-password`)
        .send({ email: newUser.email })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('message');
          res.body.should.have.property('result');
          res.body.result.should.be.a('object');
          res.body.result.should.have.property('token');
          res.body.result.should.have.property('code');
          forgotPassToken = res.body.result.token;
          forgotPassCode = res.body.result.code;
          done();
        });
    });
  });

  describe('[POST] /auth/change-password |Change-Password Process Test', () => {
    it('it should complete change-password process', (done) => {
      chai
        .request(server)
        .post(`${baseRoute}/auth/change-password`)
        .set('Authorization', `Bearer ${forgotPassToken}`)
        .send({ code: forgotPassCode, new_password: '12346578' })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('message');
          res.body.should.have.property('result');
          res.body.result.should.be.a('object');
          done();
        });
    });
  });

  describe('[POST] /auth/refresh |Refresh [tokens] Process Test', () => {
    it('it should complete refresh both access and refresh token process', (done) => {
      chai
        .request(server)
        .post(`${baseRoute}/auth/refresh`)
        .set('Authorization', `Bearer ${refreshToken}`)
        .send({})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('message');
          res.body.should.have.property('result');
          res.body.result.should.be.a('object');
          res.body.result.should.have.property('accessToken');
          res.body.result.should.have.property('refreshToken');
          accessToken = res.body.result.accessToken;
          refreshToken = res.body.result.refreshToken;
          done();
        });
    });
  });

  describe('[POST] /auth/revoke-at |Revoke-Access-Token Process Test', () => {
    it('it should complete access token revoke process', (done) => {
      chai
        .request(server)
        .post(`${baseRoute}/auth/revoke-at`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('message');
          res.body.should.have.property('result');
          res.body.result.should.be.a('object');
          done();
        });
    });
  });

  describe('[POST] /auth/revoke-rt |Revoke-Refresh-Token Process Test', () => {
    it('it should complete access token revoke process', (done) => {
      chai
        .request(server)
        .post(`${baseRoute}/auth/revoke-rt`)
        .set('Authorization', `Bearer ${refreshToken}`)
        .send({})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('message');
          res.body.should.have.property('result');
          res.body.result.should.be.a('object');
          done();
        });
    });
  });
});
