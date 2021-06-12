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
    const response = await fetch(BASE_URL + "/survey/"+id);
    const questionsJson = response.json();
    if (response.ok) {
        return questionsJson;
    } else {
        // An object with the error coming from the server
        throw questionsJson;
    }
}


const API = {getAllSurveys, getAllQuestionsFromSurveyId};
export default API;