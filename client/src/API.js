const BASE_URL = '/api';

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
        console.log(nextGroupId);
        return nextGroupId;
    } else {
        // An object with the error coming from the server
        console.log(nextGroupId);
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

async function createSurvey() {

}


const API = {getAllSurveys, getAllQuestionsFromSurveyId, getGroupId, submitSingleAnswer, createSurvey};
export default API;