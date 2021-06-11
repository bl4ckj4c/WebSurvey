const BASE_URL = '/api';

async function getAllSurveys() {
    // call: GET /api/surveys
    const response = await fetch(BASE_URL + "/surveys")
    const surveysJson = response.json();
    if (response.ok) {
        return surveysJson;
    } else {
        // An object with the error coming from the server
        throw surveysJson;
    }
}


const API = {getAllSurveys};
export default API;