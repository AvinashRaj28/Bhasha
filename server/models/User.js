//Description: this file defines the user model for out application in mongo db.
const mongoose = require("mongoose");
const bycrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      //simple email validation
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    streak: {
      current: {
        type: Number,
        default: 0,
      },
      lostActivity: { type: Date, default: null },
    },
    points: {
      type: Number,
      default: 0,
    },
  },
  {
    //automatically set timestamps for createdAt and updatedAt
    timestamps: true,
  }
);

//mongoose "pre-save" hook to hash the password before saving the user
//this function runs before the user is saved to the database
userSchema.pre("save", async function (next) {
  // We only want to hash the password if it's new or has been modified.
  if (!this.isModified("password")) {
    return next();
  }

  try {
    // Generate a "salt" for hashing
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});
// Method to compare entered password with the hashed password in the database
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
