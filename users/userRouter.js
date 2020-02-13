const express = require('express');

const Users = require('./userDb');
const Posts = require('../posts/postDb');

const router = express.Router();


// get ussers by user id
router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

// get all users
router.get('/', (req, res) => {
  Users.get(req.query)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(500).json({message: "cant retreive users "})
    })
});

//get posts by user id
router.get('/:id/posts', validateUserId, (req, res) => {
  const id = req.params.id;
  Users.getUserPosts(id)
    .then(post => {res.status(200).json(post)})
    .catch(err => {res.status(500).json({message: "cant retreive users posts"})})
});

// add new post
router.post('/:id/posts', validatePost, (req, res) => {
     const posting = req.body;
     Posts.insert(posting)
        .then(post => {res.status(200).json(post)})
        .catch(err => {res.status(500).json({message: "cant post"})})
});

// add new user
router.post("/", (req, res) => {
  const userInfo = req.body;

  userInfo['name']?
  Users.insert(userInfo)
      .then(user => {res.status(201).json(user)})
      .catch(error => {res.status(500).json({ errorMessage: 'cant create user'})})
  : res.status(404).json({ errorMessage: 'provide name and bio.' })

});

// edit user by id
router.put('/:id', (req, res) => {
  const id = req.params.id;
  const name = req.body.name;
    Users.update(id, {name})
      .then(user => res.status(200).json(user))
      .catch(err => {res.status(500).json({message: 'Error updating user information'})})
});

// delete user
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  Users.remove(id)
    .then((deleted) => {res.status(204).json({message: "User was removed successfully"})})
    .catch(err => {res.status(500).json({message: "Error removing user"})});
});





//custom middleware

// validateUserId
function validateUserId(req, res, next) {
  const id = req.params.id;
  Users.getById(id)
          .then(user => {
      if(user){
        req.user = user;
        next();
      }else {
        res.status(400).json({ message: "invalid user id" })
      }
    })
  .catch(error => {res.status(418).json({Teapot: "I'm a Teapot, also no."})})
}

// validateUser
function validateUser(req, res, next) {
  const name = req.body.name;
  !name ?
    res.status(400).json({message: "missing user data"})
  : res.status(400).json({ message: "missing required name field" })
  .catch(error => {res.status(418).json({Teapot: "I'm a Teapot, also no."})})
  next();
}

// validatePost
function validatePost(req, res, next) {
  const {id: user_id} = req.params;
  const {text} = req.body;
  if(!req.body){
    res.status(400).json({message: "Post requires a body"})
  }
  if(!text){
    res.status(400).json({message: "Post requires text"})
  }
  next();
}

module.exports = router;