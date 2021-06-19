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
            if (err) {
                reject(err);
            } else {
                const surveys = rows.map(r => ({id: r.id, title: r.title}));
                resolve(surveys);
            }
        });
    });
}

exports.getAllQuestionsFromSurveyId = (id) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM surveys S, questions Q WHERE S.id = Q.surveyId AND S.id = ?";
        db.all(sql, [id], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const questions = rows.map(r => ({
                    id: r.id,
                    type: r.type,
                    title: r.title,
                    answers: r.answers,
                    min: r.min,
                    max: r.max,
                    mandatory: r.mandatory,
                    position: r.position
                }));
                resolve(questions);
            }
        });
    });
}

exports.getGroupId = () => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT MAX(groupId) AS mid FROM answers";
        db.get(sql, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                if(rows.mid <= 0)
                    resolve(1);
                else
                    resolve(rows.mid+1);
            }
        });
    });
}

exports.submitAnswer = (groupId, surveyId, questionId, type, answer, user) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO answers(groupId, surveyId, questionId, type, answer, user) VALUES(?, ?, ?, ?, ? ,?)";
        db.run(sql, [groupId, surveyId, questionId, type, answer, user], (err) => {
            if(err)
                reject(err);
            resolve(true);
        });
    });
}
