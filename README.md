# Exam #1: "Survey"
## Student: s281949 Marino Jacopo 

## React Client Application Routes

- Route `/`: Initial page for anonymous users
- Route `/survey/:id`: page for the survey with the corresponding `id`
- Route `/admin`: Initial page for the administrator
  
- Route `/something/:param`: page content and purpose, param specification
- ...

## API Server

- GET `/api/surveys`
  - request parameters: nothing
  - response body content: JSON of all surveys available
- GET `/api/survey/:id`
  - request parameters: id of the survey
  - response body content: JSON of all questions of the survey
- GET `/api/surveys/admin/:id`
  - request parameters: id of the admin
  - response body content: JSON of all surveys created by the admin with the id passed as parameter
- GET `/api/groupId`
  - request parameters: nothing
  - response body content: next groupId to be used for submitting answers all together
- POST `/api/submit`
  - request parameters: single answer given by a user
  - response body content: nothing (just the code in the header)

- POST `/api/login`
  - request parameters and request body content
  - response body content
- GET `/api/something`
  - request parameters
  - response body content
- POST `/api/something`
  - request parameters and request body content
  - response body content
- ...

## Database Tables

-  Table `admin` - contains `id` `username` `hash` `name`
-  Table `answers` - contains `id` `groupId` `surveyId` `questionId` `type` `answer` `user`
-  Table `questions` - contains `id` `surveyId` `type` `title` `answers` `min` `max` `mandatory` `position`
-  Table `surveys` - contains `id` `title` `owner`

## Main React Components

- `Surveys` (in `Survey.js`): component to generate a list of surveys (for the user side)
- `Questions` (in `Survey.js`): component to generate the list of questions of a survey
- `Question` (in `Survey.js`): single question component, it handles both closed-answer and open-ended questions (the type can be chosen with the props `type`)
- `UserNameField` (in `Survey.js`): username component, it handles the username field before actual questions
- `SurveysAdmin` (in `SurveyAdmin.js`): component to generate a list of surveys (for the user side)
- `AddNewQuestionModal` (in `SurveyAdmin.js`): component to generate a modal to create a new question
- `QuestionsAdmin` (in `SurveyAdmin.js`): component to generate the list of questions of a survey not yet published (used in the survey creation process)
- `QuestionAdmin` (in `SurveyAdmin.js`): single question component, it handles both closed-answer and open-ended questions (the type can be chosen with the props `type`); this component just shows how the question will be displayed to the users, but fields cannot be filled by the admin during the survey creation process

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- username, password (plus any other requested info)
- username, password (plus any other requested info)
