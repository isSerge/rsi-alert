const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = Schema({
  telegramId: {
    type: String,
    required: true
  },
  pairs: {
    type: Array,
    required: true
  },
});

userSchema.pre("save", function(next) {
  const { user } = this;

  userModel
    .find({ user })
    .exec()
    .then(docs => !docs.length ? next() : next(new Error("User exists!")))
    .catch(err => next(new Error(err)));
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
