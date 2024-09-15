const mongoose = require('mongoose');

const passkeySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: true
  },
  credentialId: {
    type: String,
    // required: true,
    // unique: true
  },
  credentialPublicKey: {
    type: Buffer,
    // required: true
  },
  deviceType: {
    type: String,
    enum: ['singleDevice', 'multiDevice'],
    // required: true
  },
  backedUp: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Passkey = mongoose.model('Passkey', passkeySchema);

module.exports = Passkey;