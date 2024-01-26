const express = require('express')

const router = express.Router()

const jwt = require('jsonwebtoken')

const JwtSecret = 'hh@%12jkjbjhkl209!.,()jhh2dnbvcerty'

const DB = {
    musics: [{
            id: 1,
            title: 'Oko Mbawe',
            year: 2022,
            singer: 'Ladislau Muanza'
        },
        {
            id: 2,
            title: 'Other Day',
            year: 2021,
            singer: 'Sadder Colors'
        },
        {
            id: 3,
            title: 'Lágrimas',
            year: 2020,
            singer: 'NClack'
        }
    ],

    users: [{
            id: 1,
            name: 'Bruno Alcides',
            email: 'bruno@gmail.com',
            password: '1234'
        },

        {
            id: 2,
            name: 'ismael Muanza',
            email: 'ismaelmuanza@gmail.com',
            password: '12345'
        },

        {
            id: 3,
            name: 'Aminadiel',
            email: 'aminadiel@gmail.com',
            password: '123456'
        }
    ]
}

// middleware
function auth(req, res, next) {
    const authToken = req.headers['authorization']

    if (authToken != undefined) {
        const bearer = authToken.split(' ')
        const token = bearer[1]

        jwt.verify(token, JwtSecret, (err, data) => {
            if (err) {
                res.sendStatus(500)
            } else {

                req.userLogged = {
                    id: data.id,
                    name: data.name,
                    email: data.email
                }

                req.token = token
                res.status(200)

                next()
            }
        })
    } else {
        res.sendStatus(401)
    }
}

// auth
router.post('/auth', (req, res) => {
    const { email, password } = req.body

    if (email.length < 11 || password.length < 4) {
        res.sendStatus(400)
    } else {
        const user = DB.users.find(user => user.email == email)

        if (user != undefined) {
            if (user.password == password) {
                jwt.sign({ id: user.id, name: user.name, email: user.email }, JwtSecret, { expiresIn: '1h' }, (err, token) => {
                    if (err) {
                        res.sendStatus(500)
                    } else {
                        res.json({ token })
                    }
                })
            } else {
                res.sendStatus(401)
            }
        } else {
            res.sendStatus(404)
        }
    }
})

// musics
router.get('/musics', auth, (req, res) => {

    res.status(200)
    res.json(DB.musics)
})

// music
router.get('/music/:id', auth, (req, res) => {
    let id = req.params.id

    if (isNaN(id)) {
        res.sendStatus(400)
    } else {
        id = parseInt(id)

        const music = DB.musics.find(music => music.id == id)

        if (music != undefined) {
            res.status(200)
            res.json(music)
        } else {
            res.sendStatus(404)
        }
    }
})

// music - add
router.post('/music', (req, res) => {
    const { id, title, year, singer } = req.body

    if (isNaN(id) || isNaN(year) || title.length < 2 || singer.length < 2) {
        res.sendStatus(400)
    } else {


        const music = {
            id,
            title,
            year,
            singer
        }

        const item = DB.musics.find(music => music.id == id)

        if (item == undefined) {
            DB.musics.push(music)
            res.sendStatus(201)
        } else {
            music.id += 1
            res.json({ err: 'Music alreay exist!' })
        }

    }
})

// delete
router.delete('/music/:id', (req, res) => {
    let id = req.params.id

    if (isNaN(id)) {
        res.sendStatus(400)
    } else {
        id = parseInt(id)

        const index = DB.musics.findIndex(music => music.id == id)

        if (index < 0) {
            res.sendStatus(404)
        } else {
            DB.musics.splice(index, 1)
            res.sendStatus(200)
        }
    }
})

// edit
router.put('/music/:id', (req, res) => {
    const { title, year, singer } = req.body

    let id = req.params.id

    if (isNaN(id)) {
        res.sendStatus(400)
    } else {
        const music = DB.musics.find(music => music.id == id)

        if (music != undefined) {
            if (title != undefined) {
                music.title = title
            }

            if (year != undefined) {
                music.year = year
            }

            if (singer != undefined) {
                music.singer = singer
            }

            res.sendStatus(201)
        } else {
            res.sendStatus(404)
        }
    }
})

// export router
module.exports = router