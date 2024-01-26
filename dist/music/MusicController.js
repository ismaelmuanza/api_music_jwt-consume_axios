"use strict";

var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var JwtSecret = 'hh@%12jkjbjhkl209!.,()jhh2dnbvcerty';
var DB = {
  musics: [{
    id: 1,
    title: 'Oko Mbawe',
    year: 2022,
    singer: 'Ladislau Muanza'
  }, {
    id: 2,
    title: 'Other Day',
    year: 2021,
    singer: 'Sadder Colors'
  }, {
    id: 3,
    title: 'Lágrimas',
    year: 2020,
    singer: 'NClack'
  }],
  users: [{
    id: 1,
    name: 'Bruno Alcides',
    email: 'bruno@gmail.com',
    password: '1234'
  }, {
    id: 2,
    name: 'ismael Muanza',
    email: 'ismaelmuanza@gmail.com',
    password: '12345'
  }, {
    id: 3,
    name: 'Aminadiel',
    email: 'aminadiel@gmail.com',
    password: '123456'
  }]
};

// middleware
function auth(req, res, next) {
  var authToken = req.headers['authorization'];
  if (authToken != undefined) {
    var bearer = authToken.split(' ');
    var token = bearer[1];
    jwt.verify(token, JwtSecret, function (err, data) {
      if (err) {
        res.sendStatus(500);
      } else {
        req.userLogged = {
          id: data.id,
          name: data.name,
          email: data.email
        };
        req.token = token;
        res.status(200);
        next();
      }
    });
  } else {
    res.sendStatus(401);
  }
}

// auth
router.post('/auth', function (req, res) {
  var _req$body = req.body,
    email = _req$body.email,
    password = _req$body.password;
  if (email.length < 11 || password.length < 4) {
    res.sendStatus(400);
  } else {
    var user = DB.users.find(function (user) {
      return user.email == email;
    });
    if (user != undefined) {
      if (user.password == password) {
        jwt.sign({
          id: user.id,
          name: user.name,
          email: user.email
        }, JwtSecret, {
          expiresIn: '1h'
        }, function (err, token) {
          if (err) {
            res.sendStatus(500);
          } else {
            res.json({
              token: token
            });
          }
        });
      } else {
        res.sendStatus(401);
      }
    } else {
      res.sendStatus(404);
    }
  }
});

// musics
router.get('/musics', auth, function (req, res) {
  res.status(200);
  res.json(DB.musics);
});

// music
router.get('/music/:id', auth, function (req, res) {
  var id = req.params.id;
  if (isNaN(id)) {
    res.sendStatus(400);
  } else {
    id = parseInt(id);
    var music = DB.musics.find(function (music) {
      return music.id == id;
    });
    if (music != undefined) {
      res.status(200);
      res.json(music);
    } else {
      res.sendStatus(404);
    }
  }
});

// music - add
router.post('/music', function (req, res) {
  var _req$body2 = req.body,
    id = _req$body2.id,
    title = _req$body2.title,
    year = _req$body2.year,
    singer = _req$body2.singer;
  if (isNaN(id) || isNaN(year) || title.length < 2 || singer.length < 2) {
    res.sendStatus(400);
  } else {
    var music = {
      id: id,
      title: title,
      year: year,
      singer: singer
    };
    var item = DB.musics.find(function (music) {
      return music.id == id;
    });
    if (item == undefined) {
      DB.musics.push(music);
      res.sendStatus(201);
    } else {
      music.id += 1;
      res.json({
        err: 'Music alreay exist!'
      });
    }
  }
});

// delete
router["delete"]('/music/:id', function (req, res) {
  var id = req.params.id;
  if (isNaN(id)) {
    res.sendStatus(400);
  } else {
    id = parseInt(id);
    var index = DB.musics.findIndex(function (music) {
      return music.id == id;
    });
    if (index < 0) {
      res.sendStatus(404);
    } else {
      DB.musics.splice(index, 1);
      res.sendStatus(200);
    }
  }
});

// edit
router.put('/music/:id', function (req, res) {
  var _req$body3 = req.body,
    title = _req$body3.title,
    year = _req$body3.year,
    singer = _req$body3.singer;
  var id = req.params.id;
  if (isNaN(id)) {
    res.sendStatus(400);
  } else {
    var music = DB.musics.find(function (music) {
      return music.id == id;
    });
    if (music != undefined) {
      if (title != undefined) {
        music.title = title;
      }
      if (year != undefined) {
        music.year = year;
      }
      if (singer != undefined) {
        music.singer = singer;
      }
      res.sendStatus(201);
    } else {
      res.sendStatus(404);
    }
  }
});

// export router
module.exports = router;