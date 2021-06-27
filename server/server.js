'use strict';

const express = require('express');
const {body, param, validationResult, sanitizeBody, sanitizeParam} = require('express-validator');
const morgan = require('morgan'); // logging middleware
const session = require('express-session'); // session middleware
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login

const surveyDao = require("./survey-dao");
const userDao = require("./user-dao");

/*** Set up Passport ***/
// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
    function (username, password, done) {
        userDao.getUser(username, password).then((user) => {
            if (!user)
                return done(null, false, {message: 'Incorrect username and/or password.'});
            return done(null, user);
        })
    }
));

// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
    userDao.getUserById(id)
        .then(user => {
            done(null, user); // this will be available in req.user
        }).catch(err => {
        done(err, null);
    });
});

// init express
const app = new express();
const port = 3001;

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
    //return next();
    if (req.isAuthenticated())
        return next();

    return res.status(401).json({error: 'Not authenticated'});
}

// set up the session
app.use(session({
    // by default, Passport uses a MemoryStore to keep track of the sessions
    secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
    resave: true,
    saveUninitialized: true
}));

// tell passport to use session cookies
app.use(passport.initialize());
app.use(passport.session());

// activate the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

/* Surveys APIs */

app.get('/api/surveys', (req, res) => {
    surveyDao.getAllSurveys()
        .then(surveys => res.json(surveys))
        .catch(() => res.status(500).end());
})

app.get('/api/survey/:id',
    param('id')
        // Check if the id parameter is not null
        .exists({checkNull: true})
        .bail()
        // Check if the id parameter is not empty
        .notEmpty()
        .bail()
        // Check if the id parameter is a number
        .custom((value, req) => {
            let regex = new RegExp(/^[1-9]([0-9]*)?$/);
            return regex.test(value);
        }),
    (req, res) => {
        const result = validationResult(req);
        // Validation error
        if (!result.isEmpty())
            res.status(400).json({
                info: "The server cannot process the request",
                error: result.array()[0].msg,
                valueReceived: result.array()[0].value
            });
        else
            surveyDao.getAllQuestionsFromSurveyId(req.params.id)
                .then(questions => res.json(questions))
                .catch(() => res.status(500).end());
    })

app.get('/api/groupId', (req, res) => {
    surveyDao.getGroupId()
        .then(id => res.json(id))
        .catch(() => res.status(500).end());
})

app.post('/api/submit',
    body('groupId')
        // Check if the groupId parameter is not null
        .exists({checkNull: true})
        .bail()
        // Check if the groupId parameter is not empty
        .notEmpty()
        .bail()
        // Check if the groupId parameter is a number
        .custom((value, req) => {
            let regex = new RegExp(/^0|([1-9]([0-9]*)?)$/);
            return regex.test(value);
        }),
    body('surveyId')
        // Check if the surveyId parameter is not null
        .exists({checkNull: true})
        .bail()
        // Check if the surveyId parameter is not empty
        .notEmpty()
        .bail()
        // Check if the surveyId parameter is a number
        .custom((value, req) => {
            let regex = new RegExp(/^[1-9]([0-9]*)?$/);
            return regex.test(value);
        }),
    body('questionId')
        // Check if the questionId parameter is not null
        .exists({checkNull: true})
        .bail()
        // Check if the questionId parameter is not empty
        .notEmpty()
        .bail()
        // Check if the questionId parameter is a number
        .custom((value, req) => {
            let regex = new RegExp(/^[1-9]([0-9]*)?$/);
            return regex.test(value);
        }),
    body('type')
        // Check if the type parameter is not null
        .exists({checkNull: true})
        .bail()
        // Check if the type parameter is not empty
        .notEmpty()
        .bail()
        // Check if the type parameter is a number
        .custom((value, req) => {
            let regex = new RegExp(/^(open|closed)$/);
            return regex.test(value);
        }),
    body('user')
        // Check if the user parameter is not null
        .exists({checkNull: true})
        .bail()
        // Check if the user parameter is not empty
        .notEmpty(),
    (req, res) => {
        const result = validationResult(req);
        // Validation error
        if (!result.isEmpty()) {
            let jsonArray = [];
            for (let item of result.array())
                jsonArray.push({
                    param: item.param,
                    error: item.msg,
                    valueReceived: item.value
                })
            res.status(400).json({
                info: "The server cannot process the request",
                errors: jsonArray
            });
        }
        // Check min/max constraints for closed question or mandatory for open question
        else {
            let check = true;
            let fields = req.body;
            let regex;

            // Closed answer
            if (fields.type === 'closed') {
                regex = new RegExp(/^[1-9]([0-9]*)?$/);
                check = check && regex.test(fields.min);
                check = check && regex.test(fields.max);
                check = check && regex.test(fields.numAnswers);

                if (check) {
                    let min = parseInt(fields.min);
                    let max = parseInt(fields.max);
                    let numAnswers = parseInt(fields.numAnswers);
                    if (min < 0 ||
                        max < 0 ||
                        min > numAnswers ||
                        max > numAnswers ||
                        min > max)
                        check = false;
                }
            }
            // Open answer
            else if (fields.type === 'closed') {
                regex = new RegExp(/^[0-1]$/);
                check = check && regex.test(fields.mandatory);
                if (check) {
                    let mandatory = parseInt(fields.mandatory);
                }
            }

            if (check)
                surveyDao.submitAnswer(fields.groupId, fields.surveyId, fields.questionId, fields.type, fields.answer, fields.user)
                    .then(() => res.status(201).end())
                    .catch(() => res.status(500).end());
            else
                res.status(400).end();
        }
    })

app.post('/api/createSurvey',
    isLoggedIn,
    async (req, res) => {
        let responseCode = 201;

        let title = req.body.title;
        let questions = req.body.questions;
        let owner = req.body.owner;
        // Create the new survey and get the auto-generated id back
        let surveyId = await surveyDao.createSurvey(title, questions, owner);
        // Add one question at a time into the database for the corresponding survey
        questions.forEach(question => surveyDao.addQuestionsToSurvey(surveyId, question).catch(() => responseCode = 500));

        res.status(responseCode).end();
    })

app.get('/api/surveys/admin/:id',
    isLoggedIn,
    param('id')
        // Check if the id parameter is not null
        .exists({checkNull: true})
        .bail()
        // Check if the id parameter is not empty
        .notEmpty()
        .bail()
        // Check if the id parameter is a number
        .custom((value, req) => {
            let regex = new RegExp(/^[1-9]([0-9]*)?$/);
            return regex.test(value);
        }),
    (req, res) => {
        const result = validationResult(req);
        // Validation error
        if (!result.isEmpty())
            res.status(400).json({
                info: "The server cannot process the request",
                error: result.array()[0].msg,
                valueReceived: result.array()[0].value
            });
        else
            surveyDao.getAllSurveysByAdminId(req.params.id)
                .then(surveys => res.json(surveys))
                .catch(() => res.status(500).end());
    })

app.get('/api/survey/:surveyId/admin/:adminId',
    isLoggedIn,
    param('surveyId')
        // Check if the surveyId parameter is not null
        .exists({checkNull: true})
        .bail()
        // Check if the surveyId parameter is not empty
        .notEmpty()
        .bail()
        // Check if the surveyId parameter is a number
        .custom((value, req) => {
            let regex = new RegExp(/^[1-9]([0-9]*)?$/);
            return regex.test(value);
        }),
    param('adminId')
        // Check if the adminId parameter is not null
        .exists({checkNull: true})
        .bail()
        // Check if the adminId parameter is not empty
        .notEmpty()
        .bail()
        // Check if the adminId parameter is a number
        .custom((value, req) => {
            let regex = new RegExp(/^[1-9]([0-9]*)?$/);
            return regex.test(value);
        }),
    (req, res) => {
        const result = validationResult(req);
        // Validation error
        if (!result.isEmpty()) {
            let jsonArray = [];
            for (let item of result.array())
                jsonArray.push({
                    param: item.param,
                    error: item.msg,
                    valueReceived: item.value
                })
            res.status(400).json({
                info: "The server cannot process the request",
                errors: jsonArray
            });
        } else
            surveyDao.getAllAnswersFromSurveyId(req.params.surveyId, req.params.adminId)
                .then(surveys => res.json(surveys))
                .catch(() => res.status(500).end());
    })


/* Users APIs */

// POST /sessions
// login
app.post('/api/sessions', function (req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if (err)
            return next(err);
        if (!user) {
            // display wrong login messages
            return res.status(401).json(info);
        }
        // success, perform the login
        req.login(user, (err) => {
            if (err)
                return next(err);

            // req.user contains the authenticated user, we send all the user info back
            // this is coming from userDao.getUser()
            return res.json(req.user);
        });
    })(req, res, next);
});

// DELETE /sessions/current
// logout
app.delete('/api/sessions/current', (req, res) => {
    req.logout();
    res.end();
});

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json(req.user);
    } else
        res.status(401).json({error: 'Unauthenticated user!'});
});