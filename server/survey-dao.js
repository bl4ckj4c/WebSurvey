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
                if (rows.mid <= 0)
                    resolve(1);
                else
                    resolve(parseInt(rows.mid) + 1);
            }
        });
    });
}

exports.submitAnswer = (groupId, surveyId, questionId, type, answer, user) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO answers(groupId, surveyId, questionId, type, answer, user) VALUES(?, ?, ?, ?, ?, ?)";
        db.run(sql, [groupId, surveyId, questionId, type, answer, user], (err) => {
            if (err)
                reject(err);
            resolve(true);
        });
    });
}

exports.createSurvey = (title, questions, owner) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO surveys(title, owner) VALUES(?, ?)";
        db.get(sql, [title, owner], (err) => {
            if (err)
                reject(err);
            const sql2 = "SELECT MAX(id) AS mid FROM surveys WHERE owner = ?";
            db.get(sql2, [owner], (err, row) => {
                if (err)
                    reject(err);
                resolve(row.mid);
            });
        });
    });
}

exports.addQuestionsToSurvey = (surveyId, question) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO questions(surveyId, type, title, answers, min, max, mandatory, position) VALUES(?, ?, ?, ? , ?, ?, ?, ?)";
        db.run(sql, [surveyId,
                question.type,
                question.title,
                JSON.stringify(question.answers),
                question.min,
                question.max,
                question.mandatory,
                question.position],
            (err) => {
                if (err)
                    reject(err);
                resolve(true);
            });
    });
}

exports.getAllSurveysByAdminId = (owner) => {
    return new Promise((resolve, reject) => {
        /*const sql = "SELECT S.id, S.title, COUNT (DISTINCT A.groupId) AS numAnswer " +
            "FROM surveys S, answers A " +
            "WHERE S.id = A.surveyId AND owner = ? " +
            "GROUP BY S.id, S.title";*/
        const sql = "SELECT S.id, S.title, COUNT (DISTINCT A.groupId) AS numAnswer " +
            "FROM surveys S LEFT JOIN answers A ON S.id = A.surveyId " +
            "WHERE owner = ? " +
            "GROUP BY S.id, S.title";
        db.all(sql, [owner], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                const surveys = rows.map(r => ({id: r.id, title: r.title, numAnswer: r.numAnswer}));
                resolve(surveys);
            }
        });
    });
}

exports.getAllAnswersFromSurveyId = (surveyId, adminId) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT A.groupId, A.type, A.answer, A.user, Q.position, Q.title, Q.answers " +
            "FROM surveys S, answers A, questions Q " +
            "WHERE S.id = A.surveyId AND A.questionId = Q.id AND S.id = ? AND S.owner = ?";
        db.all(sql, [surveyId, adminId], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                // Group by each groupId using JS reduce
                let answers = rows.reduce((r, answer) => {
                    r[answer.groupId] = r[answer.groupId] || [];
                    r[answer.groupId].push(answer);
                    return r;
                }, Object.create(null));
                resolve(answers);
            }
        });
    });
}
