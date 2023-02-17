const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const userSchema = new Schema(
  {
    email: {
      type: String,
      index: true,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      index: true,
    },
    avatar: {
      type: String,
    },
    mobile: {
      type: String,
    },
    dob: {
      type: Date,
    },
    organization: {
      type: String,
    },
    isLoggedIn: {
      type: Boolean,
    },
    isVerified: {
      type: Boolean,
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    versionKey: '_version',
  },
);

// generating a hash
userSchema.statics.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

// checking if password is valid
userSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

// check if a email exists in the db
userSchema.statics.emailExist = function (email) {
  return this.findOne({ email });
};

// virtual function for getting full name from name
// userSchema.virtual('fullName').get(function () {
//   return `${this.name.first_name} ${this.name.last_name}`;
// });

// delete these object keys before returning the db document to consumer
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.isLoggedIn;
  delete obj.isVerified;
  return obj;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
