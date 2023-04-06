const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const applicationSchema = new Schema(
  {
    appId: {
      type: String,
      index: true,
      required: true,
    },
    appName: {
      type: String,
      required: true,
    },
    apiKey: {
      type: String,
      required: true,
    },
    apiSecret: {
      type: String,
      required: true,
    },
    appMinVersion: {
      type: String,
      required: true,
    },
    appUser: {
      type: String,
    },
    origin: {
      type: String,
    },
    status: {
      type: String,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: '_version',
  },
);

applicationSchema.statics.appNameExists = function (appName) {
  return this.findOne({ appName });
};

applicationSchema.statics.appIdExists = function (appId) {
  return this.findOne({ appId });
};

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;
