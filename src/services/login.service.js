var jwt = require('jsonwebtoken');
var User = require('../models/user.schema');
var bcript = require('bcryptjs');
var SECRET_KEY = require('../config/config').secretKey;
var CLIENT_ID = require('../config/config').CLIENT_ID;

// Google
var { OAuth2Client } = require('google-auth-library');
var client = new OAuth2Client(CLIENT_ID);

function loginWithEmail(body) {
  return new Promise((resolve, reject) => {
    User.findOne({ email: body.email }, (error, user) => {
      if (error) {
        reject({ code: 500, error });
      } else if (!user) {
        reject({ code: 400, message: 'Bad credentials - email' });
      } else if (!bcript.compareSync(body.password, user.password)) {
        reject({ code: 400, message: 'Bad credentials - password' });
      } else {
        // all god
        user.password = undefined;

        // generate jwt
        var token = jwt.sign({ user: user }, SECRET_KEY, {
          expiresIn: 31536000
        });

        resolve({ id: user._id, user, token });
      }
    });
  });
}

async function loginWithGoogle(gToken) {
  var ticket = await client.verifyIdToken({
    idToken: gToken,
    audience: CLIENT_ID
  });

  var payload = ticket.getPayload();

  return {
    name: payload.name,
    email: payload.email,
    photo: payload.picture,
    google: true
  };
}

module.exports = {
  loginWithEmail,
  loginWithGoogle
};
