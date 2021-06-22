'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const session = require('express-session'); // session middleware
const passport = require('passport');
const passportLocal = require('passport-local');

const surveyDao = require("./survey-dao");

// init express
const app = new express();
const port = 3001;

// set-up the middlewares
app.use(morgan('dev'));
app.use(express.json());

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated())
        return next();

    return res.status(401).json({error: 'not authenticated'});
}

// initialize and configure HTTP sessions
app.use(session({
    secret: 'this and that and other',
    resave: false,
    saveUninitialized: false
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

app.get('/api/survey/:id', (req, res) => {
    //if(req.isAuthenticated())
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

app.post('/api/createSurvey', async (req, res) => {
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

app.get('/api/surveys/admin/:id', (req, res) => {
    surveyDao.getAllSurveysByAdminId(req.params.id)
        .then(surveys => res.json(surveys))
        .catch(() => res.status(500).end());
})

app.get('/api/survey/:surveyId/admin/:adminId', (req, res) => {
    surveyDao.getAllAnswersFromSurveyId(req.params.surveyId, req.params.adminId)
        .then(surveys => res.json(surveys))
        .catch(() => res.status(500).end());
})