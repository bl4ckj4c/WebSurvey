# Exam #1: "Survey"
## Student: s281949 Marino Jacopo 

## React Client Application Routes

- Route `/`: Initial page, just two buttons to enter as a user or to login as an administrator
- Route `/user`: Initial page for the user
- Route `/admin`: Initial page for the administrator
  
- Route `/something/:param`: page content and purpose, param specification
- ...

## API Server

- GET `/api/surveys`
  - request parameters: nothing
  - response body content: JSON of all surveys available
- GET `/api/surveys/admin/:id`
  - request parameters: id of the admin
  - response body content: JSON of all surveys created by the admin with the id passed as parameter

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

-  Table `admin` - contains id username hash name
-  Table `answer` - contains id surveyId type title answer
-  Table `questions` - contains id surveyId type title answers min max flag
-  Table `surveys` - contains id title owner

## Main React Components

- `Survey` (in `Survey.js`): single survey components
- `Question` (in `Survey.js`): single question components, it handles both closed-answer and open-ended questions (the type can be chosen with the props `type`)
  

- `ListOfSomething` (in `List.js`): component purpose and main functionality
- `GreatButton` (in `GreatButton.js`): component purpose and main functionality
- ...

(only _main_ components, minor ones may be skipped)

## Screenshot

![Screenshot](./img/screenshot.jpg)

## Users Credentials

- username, password (plus any other requested info)
- username, password (plus any other requested info)
