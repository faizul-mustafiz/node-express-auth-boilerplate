/**
 * * import baseRoute, User model and test static data
 */
const { baseRoute } = require('../configs/app.config');
const User = require('../models/user.model');
const { testUserObj, testNewPassword } = require('./common');
/**
 * * import chai, chai-http dependencies
 * * also inject server for mocha to run tests
 * * import should aggregator from chai
 * * use chai-http with chai to perform http request
 */
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../index');
const should = chai.should();
chai.use(chaiHttp);
/**
 * * global variables needed for the entire test file
 */
let verifyToken = '';
let verifyCode = '';
let forgotPassToken = '';
let forgotPassCode = '';
let accessToken = '';
let refreshToken = '';
/**
 * * all global variable reset method
 */
resetAllTestVariables = () => {
  verifyToken = '';
  verifyCode = '';
  forgotPassToken = '';
  forgotPassCode = '';
  accessToken = '';
  refreshToken = '';
};
/**
 * * auth controller endpoint test cases
 */
describe('Auth controller tests', () => {
  /**
   * @before will run at the start of the test cases
   * * here we delete all the old data from test db user collection
   */
  before((done) => {
    User.deleteMany({}, () => {
      done();
    });
  });
  /**
   * @after will run after the last test cases of the file
   * * here we reset all the global variables user for the entire test file
   */
  after((done) => {
    resetAllTestVariables();
    done();
  });
  /**
   * * complete sign-up process test. Here this test will first request the /sign-up
   * * route and the get the verify token and code and using this token and code will
   * * compete sign-up using /verify route
   */
  describe('[POST] /auth/sign-up |Sign-Up Process Test', () => {
    it('it should initiate sign-up process using route: [POST] /auth/sign-up', (done) => {
      chai
        .request(server)
        .post(`${baseRoute}/auth/sign-up`)
        .send(testUserObj)
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
          res.body.result.should.have.property('email').eql(testUserObj.email);
          res.body.result.should.have.property('_id');
          res.body.result.should.have.property('accessToken');
          res.body.result.should.have.property('refreshToken');
          accessToken = res.body.result.accessToken;
          refreshToken = res.body.result.refreshToken;
          done();
        });
    });
  });
  /**
   * * complete sign-in process test. Here this test will first request the /sign-in
   * * route and the get the verify token and code and using this token and code will
   * * compete sign-in using /verify route
   */
  describe('[POST] /auth/sign-in |Sign-in Process Test', () => {
    it('it should initiate sign-in process using route: [POST] /auth/sign-in ', (done) => {
      chai
        .request(server)
        .post(`${baseRoute}/auth/sign-in`)
        .send(testUserObj)
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
  /**
   * * forgot-password process test.
   */
  describe('[POST] /auth/forgot-password |Forgot-Password Process Test', () => {
    it('it should initiate forgot-password process', (done) => {
      chai
        .request(server)
        .post(`${baseRoute}/auth/forgot-password`)
        .send({ email: testUserObj.email })
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
  /**
   * * change-password process test. here this test will use the forgotPasswordToken and
   * * forgotPasswordCode to perform change-password process
   */
  describe('[POST] /auth/change-password |Change-Password Process Test', () => {
    it('it should complete change-password process', (done) => {
      chai
        .request(server)
        .post(`${baseRoute}/auth/change-password`)
        .set('Authorization', `Bearer ${forgotPassToken}`)
        .send({ code: forgotPassCode, new_password: testNewPassword })
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
  /**
   * * refresh process test. here this test will use the refresh token to
   * * get new pair of accessToken and refreshToken
   */
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
  /**
   * * revoke-access-token process test. here this test will use the access token
   * * to revoke the access token
   */
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
  /**
   * * revoke-refresh-token process test. here this test will use the refresh token
   * * to revoke the access token
   */
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
