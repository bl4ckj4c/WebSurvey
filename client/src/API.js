const BASE_URL = '/api';

// Surveys functions

async function getAllSurveys() {
    // call: GET /api/surveys
    const response = await fetch(BASE_URL + "/surveys");
    const surveysJson = response.json();
    if (response.ok) {
        return surveysJson;
    } else {
        // An object with the error coming from the server
        throw surveysJson;
    }
}

async function getAllQuestionsFromSurveyId(id) {
    // call: GET /api/survey/:id
    const response = await fetch(BASE_URL + "/survey/" + id);
    const questionsJson = response.json();
    if (response.ok) {
        return questionsJson;
    } else {
        // An object with the error coming from the server
        throw questionsJson;
    }
}

async function getGroupId() {
    // call: GET /api/groupId
    const response = await fetch(BASE_URL + "/groupId");
    const nextGroupId = response.json();
    if (response.ok) {
        return nextGroupId;
    } else {
        // An object with the error coming from the server
        throw nextGroupId;
    }
}

async function submitSingleAnswer(answer) {
    // call: POST /api/submit
    const response = await fetch(BASE_URL + "/submit", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(answer)
        }
    );
    const questionsJson = response.json();
    if (response.ok) {
        return questionsJson;
    } else {
        // An object with the error coming from the server
        throw questionsJson;
    }
}

async function createSurvey(title, questions, owner) {
    // call: POST /api/createSurvey
    const response = await fetch(BASE_URL + "/createSurvey", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                questions: questions,
                owner: owner
            })
        }
    );
    const surveyId = response.json();
    if (response.ok) {
        return surveyId;
    } else {
        // An object with the error coming from the server
        throw surveyId;
    }
}

async function getSurveyByIdForAdmin(id) {
    // call: GET /api/surveys/admin/:id
    const response = await fetch(BASE_URL + "/surveys/admin/" + id);
    const surveysJson = response.json();
    if (response.ok) {
        return surveysJson;
    } else {
        // An object with the error coming from the server
        throw surveysJson;
    }
}

async function getAllAnswersBySurveyId(surveyId, adminId) {
    // call: GET /api/survey/:surveyId/admin/:adminId
    const response = await fetch(BASE_URL + "/survey/" + surveyId + "/admin/" + adminId);
    const surveyJson = response.json();
    if (response.ok) {
        return surveyJson;
    } else {
        // An object with the error coming from the server
        throw surveyJson;
    }
}

// Login functions

async function logIn(credentials) {
    // call: POST /api/sessions
    let response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    if (response.ok) {
        const user = await response.json();
        return {name: user.name, id: user.id};
    } else {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
        } catch (err) {
            throw err;
        }
    }
}

async function logOut() {
    // call: DELETE /api/sessions/current
    await fetch('/api/sessions/current', {
        method: 'DELETE'
    });
}

async function getUserInfo() {
    // call: GET /api/sessions/current
    const response = await fetch(BASE_URL + '/sessions/current');
    const userInfo = await response.json();
    if (response.ok) {
        return userInfo;
    } else {
        throw userInfo;  // an object with the error coming from the server
    }
}


const API = {
    getAllSurveys,
    getAllQuestionsFromSurveyId,
    getGroupId,
    submitSingleAnswer,
    createSurvey,
    getSurveyByIdForAdmin,
    getAllAnswersBySurveyId,
    logIn,
    logOut,
    getUserInfo
};
export default API;