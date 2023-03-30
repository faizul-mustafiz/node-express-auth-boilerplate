/**
 * * import baseRoute, User model and test static data
 */
const { baseRoute } = require('../configs/app.config');
const User = require('../models/user.model');
const { testUserObj, testUserUpdateObj } = require('./common');
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
let testUserId = '';
let verifyToken = '';
let verifyCode = '';
let accessToken = '';
let refreshToken = '';
/**
 * * all global variable reset method
 */
resetAllTestVariables = () => {
  testUserId = '';
  verifyToken = '';
  verifyCode = '';
  accessToken = '';
  refreshToken = '';
};
/**
 * * user controller endpoint test cases
 */
describe('User controller tests', () => {
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
   * * also we do not need to perform any delete operation here as user delete
   * * test case does that for us
   */
  after((done) => {
    resetAllTestVariables();
    done();
  });
  /**
   * * perform sign-up process test. Here this test will first request the /sign-up
   * * route and the get the verify token and code and using this token and code will
   * * compete sign-up using /verify route. for this verify request the accessToken
   * * and refreshToken will be stored in the global variables and used for the entire
   * * test cases of user controller. we do not need to perform users creation test as
   * * sign-up process will create one user for us
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
   * * get-all-user process test cases. Here only one user will be returned
   * * and we will assign the _id of the result[0]._id to our global variable
   * * which we will use in our letter test cases.
   */
  describe('[GET] /users |Get All Users Process Test', () => {
    it('it should get-all-users form users collection', (done) => {
      chai
        .request(server)
        .get(`${baseRoute}/users`)
        .set('Authorization', `Bearer ${accessToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('message');
          res.body.should.have.property('result');
          res.body.result.should.be.a('array');
          res.body.result[0].should.have.property('_id');
          res.body.result[0].should.have
            .property('email')
            .eql(testUserObj.email);
          res.body.result[0].should.have.property('created_at');
          res.body.result[0].should.have.property('updated_at');
          testUserId = res.body.result[0]._id;
          done();
        });
    });
  });
  /**
   * * get-one-user process test cases
   */
  describe('[GET] /users/{id} |Get One User Process Test', () => {
    it('it should get-one-user form users collection', (done) => {
      chai
        .request(server)
        .get(`${baseRoute}/users/${testUserId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('message');
          res.body.should.have.property('result');
          res.body.result.should.be.a('object');
          res.body.result.should.have.property('_id').eql(testUserId);
          res.body.result.should.have.property('email').eql(testUserObj.email);
          res.body.result.should.have.property('created_at');
          res.body.result.should.have.property('updated_at');
          done();
        });
    });
  });
  /**
   * * update-one-user process test cases. here we will use the full user update object
   * * where we will also pass email password and other objects inside testUserUpdateObj
   * * this will also satisfy one condition on our code that a user can update his/her own
   * * email if that email is not already registered. if the email exists the test will fail
   */
  describe('[POST] /users/{id} |Update One User Process Test', () => {
    it('it should update-one-user form users collection', (done) => {
      chai
        .request(server)
        .post(`${baseRoute}/users/${testUserId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(testUserUpdateObj)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('message');
          res.body.should.have.property('result');
          res.body.result.should.be.a('object');
          res.body.result.should.have.property('_id').eql(testUserId);
          res.body.result.should.have
            .property('email')
            .eql(testUserUpdateObj.email);
          res.body.result.should.have.property('created_at');
          res.body.result.should.have.property('updated_at');
          done();
        });
    });
  });
  /**
   * * delete-one-user process test cases
   */
  describe('[DELETE] /users/{id} |Delete One User Process Test', () => {
    it('it should delete-one-user form users collection', (done) => {
      chai
        .request(server)
        .delete(`${baseRoute}/users/${testUserId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('message');
          res.body.should.have.property('result');
          res.body.result.should.be.a('object');
          res.body.result.should.have.property('_id').eql(testUserId);
          res.body.result.should.have
            .property('email')
            .eql(testUserUpdateObj.email);
          res.body.result.should.have.property('created_at');
          res.body.result.should.have.property('updated_at');
          done();
        });
    });
  });
});
