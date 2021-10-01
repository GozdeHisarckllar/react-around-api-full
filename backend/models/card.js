const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    validate: {
      validator(v) {
        return /https?:\/{2}(?:w{3}\.)?[a-z0-9\-\.]+(?:\.com\b)(?:\/[a-zA-Z0-9\-\._~:?\/%#[\]@!$&'()*\+,;=]*)?/.test(v);
      },
      message: (props) => `${props.value} is not a valid link!`,
    },
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
