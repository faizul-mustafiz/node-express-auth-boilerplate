const createApplication = require('./create-application');
const getAllApplications = require('./get-all-applications');
const getApplication = require('./get-application');
const updateApplication = require('./update-application');
const deleteApplication = require('./delete-application');
module.exports = {
  '/applications': {
    ...createApplication,
    ...getAllApplications,
  },
  '/applications/{appId}': {
    ...getApplication,
    ...updateApplication,
    ...deleteApplication,
  },
};
