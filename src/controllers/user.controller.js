var bcrypt = require('bcryptjs');
var User = require('../models/user.schema');

const userService = require('../services/user.service');

/**
 * Get all users
 */
function getUsers(req, res) {
  var limit = req.query.limit || 0;
  limit = Number(limit);

  var from = req.query.from || 0;
  from = Number(from);

  userService
    .getUsers(from, limit)
    .then((data) => {
      return res.status(200).json({
        status: 'Ok',
        data
      });
    })
    .catch((error) => {
      return res.status(500).json({
        status: 'error',
        message: 'Server error',
        errors: error
      });
    });
}

/**
 * Get user
 */
function getUser(req, res) {
  var id = req.params.id;

  userService
    .getUser(id)
    .then((data) => {
      return res.status(200).json({
        status: 'ok',
        data
      });
    })
    .catch((error) => {
      return res.status(error.code).json({
        status: 'error',
        errors: error.message
      });
    });
}

/**
 * Create user
 */
function create(req, res) {
  var body = req.body;

  var user = new User({
    name: body.name,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    photo: body.photo,
    role: body.role
  });

  user.save((error, user) => {
    if (error) {
      return res.status(400).json({
        status: 'error',
        message: 'Create user error',
        errors: error
      });
    }

    user.password = undefined;

    res.status(201).json({
      status: 'Ok',
      user: user,
      auth: req.authUser
    });
  });
}

/**
 * Update user
 */
function update(req, res) {
  // get id
  var id = req.params.id;
  // get body request
  var body = req.body;

  // find user
  User.findById(id, (error, user) => {
    // errors
    if (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Server error',
        errors: error
      });
    }

    // if void user
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
        errors: error
      });
    }

    // user god
    user.name = body.name;
    user.email = body.email;
    user.role = body.role;

    user.save((error, user) => {
      // errors
      if (error) {
        return res.status(400).json({
          status: 'error',
          message: 'Update user error',
          errors: { message: 'Update user error' }
        });
      }

      user.password = '';

      // all god
      return res.status(200).json({
        status: 'ok',
        user: user
      });
    });
  });
}

/**
 * Delete user
 */
function remove(req, res) {
  // get id
  var id = req.params.id;

  // Detele user
  User.findByIdAndRemove(id, (error, user) => {
    // errors
    if (error) {
      return res.status(500).json({
        status: 'error',
        message: 'Delete user error',
        errors: error
      });
    }

    // user not found
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
        errors: { message: 'User not found' }
      });
    }

    return res.status(200).json({
      status: 'ok',
      user: user
    });
  });
}

module.exports = {
  getUser,
  getUsers,
  create,
  update,
  remove
};
