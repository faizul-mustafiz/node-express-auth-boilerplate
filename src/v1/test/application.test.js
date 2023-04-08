/**
 * * import baseRoute, Application model and test static data
 */
const { baseRoute } = require('../configs/app.config');
const Application = require('../models/application.model');
const { deleteTestDataFromRedis } = require('../helpers/redis.helper');
const {
  testApplicationCreateObj,
  testApplicationUpdateObj,
} = require('./common');
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
let xAppId = '';
let xApiKey = '';
let xApiSecret = '';
let xApiMinVersion = '';
/**
 * * all global variable reset method
 */
resetAllTestVariables = () => {
  xAppId = '';
  xApiKey = '';
  xApiSecret = '';
  xApiMinVersion = '';
};
/**
 * * application controller endpoint test cases
 */
describe('Application controller test', () => {
  /**
   * @before will run at the start of the test cases
   * * here we delete all the old data from auth_test_db
   * * applications collection
   */
  before((done) => {
    Application.deleteMany({}, () => {
      done();
    });
  });
  /**
   * @after will run after the last test cases of the file
   * * here we reset all the global variables used for the entire test file
   * * also we do not need to perform any delete operation here
   * * as application delete test case does that for us
   */
  after((done) => {
    resetAllTestVariables();
    deleteTestDataFromRedis();
    done();
  });
  /**
   * * perform application creation process as entire application test file use
   * * the created application to get edit and delete
   */
  describe('[POST] /applications | Application creation test', () => {
    it('it should create-one-application in applications collection', (done) => {
      chai
        .request(server)
        .post(`${baseRoute}/applications`)
        .send(testApplicationCreateObj)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('message');
          res.body.should.have.property('result');
          res.body.result.should.be.a('object');
          res.body.result.should.have.property('_id');
          res.body.result.should.have.property('appId');
          res.body.result.should.have
            .property('appName')
            .eql(testApplicationCreateObj.appName);
          res.body.result.should.have.property('apiKey');
          res.body.result.should.have.property('apiSecret');
          res.body.result.should.have.property('appMinVersion');
          res.body.result.should.have
            .property('origin')
            .eql(testApplicationCreateObj.origin);
          res.body.result.should.have.property('status');
          res.body.result.should.have.property('created_at');
          res.body.result.should.have.property('updated_at');
          xAppId = res.body.result.appId;
          xApiKey = res.body.result.apiKey;
          xApiSecret = res.body.result.apiSecret;
          xApiMinVersion = res.body.result.appMinVersion;
          done();
        });
    });
  });
  /**
   * * get-all-application process test cases.
   */
  describe('[GET] /applications |Get All Applications Process Test', () => {
    it('it should get-all-applications form applications collection', (done) => {
      chai
        .request(server)
        .get(`${baseRoute}/applications`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('message');
          res.body.should.have.property('result');
          res.body.result.should.be.a('array');
          res.body.result[0].should.have.property('_id');
          res.body.result[0].should.have.property('appId').eql(xAppId);
          res.body.result[0].should.have.property('apiKey').eql(xApiKey);
          res.body.result[0].should.have.property('apiSecret').eql(xApiSecret);
          res.body.result[0].should.have
            .property('appMinVersion')
            .eql(xApiMinVersion);
          res.body.result[0].should.have.property('appName');
          res.body.result[0].should.have.property('origin');
          res.body.result[0].should.have.property('status');
          res.body.result[0].should.have.property('created_at');
          res.body.result[0].should.have.property('created_at');
          done();
        });
    });
  });
  /**
   * * get-one-application process test cases
   */
  describe('[GET] /applications/{appId} |Get One Application Process Test', () => {
    it('it should get-one-application form applications collection', (done) => {
      chai
        .request(server)
        .get(`${baseRoute}/applications/${xAppId}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('message');
          res.body.should.have.property('result');
          res.body.result.should.be.a('object');
          res.body.result.should.have.property('_id');
          res.body.result.should.have.property('appId').eql(xAppId);
          res.body.result.should.have.property('apiKey').eql(xApiKey);
          res.body.result.should.have.property('apiSecret').eql(xApiSecret);
          res.body.result.should.have
            .property('appMinVersion')
            .eql(xApiMinVersion);
          res.body.result.should.have.property('appName');
          res.body.result.should.have.property('origin');
          res.body.result.should.have.property('status');
          res.body.result.should.have.property('created_at');
          res.body.result.should.have.property('created_at');
          done();
        });
    });
  });
  /**
   * * update-one-application process test cases. here we will use updatable
   * * keys of application object (appName, origin, appUser and status).
   * * all the other keys are generated and can not be updated.
   */
  describe('[POST] /applications/{appId} |Update One Application Process Test', () => {
    it('it should update-one-application form applications collection', (done) => {
      chai
        .request(server)
        .post(`${baseRoute}/applications/${xAppId}`)
        .send(testApplicationUpdateObj)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('message');
          res.body.should.have.property('result');
          res.body.result.should.be.a('object');
          res.body.result.should.have.property('_id');
          res.body.result.should.have.property('appId').eql(xAppId);
          res.body.result.should.have.property('apiKey').eql(xApiKey);
          res.body.result.should.have.property('apiSecret').eql(xApiSecret);
          res.body.result.should.have
            .property('appMinVersion')
            .eql(xApiMinVersion);
          res.body.result.should.have
            .property('appName')
            .eql(testApplicationUpdateObj.appName);
          res.body.result.should.have
            .property('origin')
            .eql(testApplicationUpdateObj.origin);
          res.body.result.should.have
            .property('status')
            .eql(testApplicationUpdateObj.status);
          res.body.result.should.have
            .property('appUser')
            .eql(testApplicationUpdateObj.appUser);
          res.body.result.should.have.property('created_at');
          res.body.result.should.have.property('created_at');
          done();
        });
    });
  });
  /**
   * * delete-one-application process test cases
   */
  describe('[DELETE] /applications/{appId} |Delete One Application Process Test', () => {
    it('it should delete-one-application form applications collection', (done) => {
      chai
        .request(server)
        .delete(`${baseRoute}/applications/${xAppId}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('success').eql(true);
          res.body.should.have.property('message');
          res.body.should.have.property('result');
          res.body.result.should.be.a('object');
          res.body.result.should.have.property('_id');
          res.body.result.should.have.property('appId').eql(xAppId);
          res.body.result.should.have.property('apiKey').eql(xApiKey);
          res.body.result.should.have.property('apiSecret').eql(xApiSecret);
          res.body.result.should.have
            .property('appMinVersion')
            .eql(xApiMinVersion);
          res.body.result.should.have
            .property('appName')
            .eql(testApplicationUpdateObj.appName);
          res.body.result.should.have
            .property('origin')
            .eql(testApplicationUpdateObj.origin);
          res.body.result.should.have
            .property('status')
            .eql(testApplicationUpdateObj.status);
          res.body.result.should.have
            .property('appUser')
            .eql(testApplicationUpdateObj.appUser);
          res.body.result.should.have.property('created_at');
          res.body.result.should.have.property('created_at');
          done();
        });
    });
  });
});
