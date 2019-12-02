const mongose = require("mongoose");
const validator = require("validator");
const bscrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("../models/task");

const userSchema = new mongose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 7,
      validate(value) {
        if (value.length < 6) {
          throw new Error("The password mu be grater than 6 caracters");
        }

        if (value.toLowerCase().includes("password")) {
          throw new Error("Please choose another passwrod");
        }
      }
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is invalid");
        }
      }
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error("Age must be a positive number");
        }
      }
    },
    tokens: [
      {
        token: {
          type: String,
          require: true
        }
      }
    ],
    avatar: {
      type: Buffer
    }
  },
  {
    timestamps: true
  }
);

userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "owner"
});

userSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;
  
  return userObject;
};

userSchema.methods.generateAutoToken = async function() {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, 'thisismynewcourse');

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

userSchema.statics.findByCredentials = async (email, passoword) => {
  const user = await User.findOne({ email });

  if (user === null) {
    throw new Error("Unable do login");
  }

  const isMatch = await bscrypt.compare(passoword, user.password);

  if (!isMatch) {
    throw new Error("Unable to login");
  }

  return user;
};

//hash de passoword before saving user
userSchema.pre("save", async function(next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bscrypt.hash(user.password, 8);
  }

  next();
});

//delete user tasks when user is removed
userSchema.pre("remove", async function(next) {
  const user = this;
  await Task.deleteMany({ owner: user._id });
});

const User = mongose.model("User", userSchema);

module.exports = User;
