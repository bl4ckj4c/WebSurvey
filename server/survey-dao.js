'use strict';

/* Data Access Object (DAO) module for accessing surveys */
const sqlite = require('sqlite3');

// Open the database
const db = new sqlite.Database('surveys.db', (err) => {
    if (err) throw err;
});

exports.getAllSurveys = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT id, title FROM surveys";
        db.all(sql, [], (err, rows) => {
            if(err) {
                reject(err);
            }
            else {
                const surveys = rows.map(r => ({id: r.id, title: r.title}));
                resolve(surveys);
            }
        });
    });
}

exports.getAllSurveysById = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT id, title FROM surveys WHERE id = ?";
        db.all(sql, [id], (err, rows) => {
            if(err) {
                reject(err);
            }
            else {
                const surveys = rows.map(r => ({id: r.id, title: r.title}));
                resolve(surveys);
            }
        });
    });
}

/*
exports.getAllAnswersBySurveyId = (id) => {
    return new Promise(((resolve, reject) => {
        const sql = "SELECT A.id, title FROM surveys S, answers A WHERE S.id = A.surveyId, S.id = ?";
        db.all(sql, [id], (err, rows) => {
            if(err) {
                reject(err);
            }
            else {
                const surveys = rows.map(r => ({id: r.id, title: r.title}));
                resolve(surveys);
            }
        });
    }));
}*/
