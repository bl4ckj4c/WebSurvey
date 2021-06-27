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
    function(username, password, done) {
        userDao.getUser(username, password).then((user) => {
            if (!user)
                return done(null, false, { message: 'Incorrect username and/or password.' });
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
    if(req.isAuthenticated())
        return next();

    return res.status(401).json({ error: 'Not authenticated'});
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
        // Check if the id parameters is not null
        .exists({checkNull: true})
        .bail()
        // Check if the id parameters is not empty
        .notEmpty()
        .bail()
        // Check if the id parameters is a number
        .custom((value, req) => {
            let regex = new RegExp(/^[1-9]([0-9]*)?$/);
            return regex.test(value);
        }),
    (req, res) => {
    const result = validationResult(req);
    // Validation error
    if(!result.isEmpty())
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

app.post('/api/submit', (req, res) => {
    surveyDao.submitAnswer(req.body.groupId, req.body.surveyId, req.body.questionId, req.body.type, req.body.answer, req.body.user)
        .then(() => res.status(201).end())
        .catch(() => res.status(500).end());
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
    (req, res) => {
    surveyDao.getAllSurveysByAdminId(req.params.id)
        .then(surveys => res.json(surveys))
        .catch(() => res.status(500).end());
})

app.get('/api/survey/:surveyId/admin/:adminId',
    isLoggedIn,
    (req, res) => {
    surveyDao.getAllAnswersFromSurveyId(req.params.surveyId, req.params.adminId)
        .then(surveys => res.json(surveys))
        .catch(() => res.status(500).end());
})


/* Users APIs */

// POST /sessions
// login
app.post('/api/sessions', function(req, res, next) {
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
    if(req.isAuthenticated()) {
        res.status(200).json(req.user);}
    else
        res.status(401).json({error: 'Unauthenticated user!'});
});