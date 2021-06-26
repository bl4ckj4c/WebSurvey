import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Link, Redirect, Route, Switch} from 'react-router-dom';
import {useEffect, useState} from "react";
import {Card, Container, Spinner} from "react-bootstrap";
import {Login, UnauthorizedUserMessage} from "./Login";
import {Surveys, Questions} from "./Survey";
import {SurveysAdmin, QuestionsAdmin, ViewAnswersOneSurvey, AdminButtons} from "./SurveyAdmin";
import API from './API';
import MyNavBar from "./MyNavBar";

function App() {
    // At the beginning, no user is logged in
    const [loggedIn, setLoggedIn] = useState(false);
    // Current logged admin
    const [loggedAdmin, setLoggedAdmin] = useState("Anonymous");
    const [loggedAdminId, setLoggedAdminId] = useState(-1);
    // List of all available surveys
    const [surveys, setSurveys] = useState([]);
    // Current survey selected by anonymous user
    const [currSurvey, setCurrSurvey] = useState(0);
    // List of all questions in the view survey for the user
    const [questions, setQuestions] = useState([]);
    // List of all questions in the survey for creation by admin
    const [questionsAdmin, setQuestionsAdmin] = useState([]);
    // Loading state for the home page
    const [loading, setLoading] = useState(true);
    // Loading while checking the authorization
    const [loadingAuth, setLoadingAuth] = useState(true);
    // Error in login
    const [errorLogin, setErrorLogin] = useState(false);

    const doLogIn = async (credentials) => {
        try {
            const user = await API.logIn(credentials);
            setLoggedIn(true);
            setLoggedAdmin(user.name);
            setLoggedAdminId(user.id);
            setErrorLogin(false);
        } catch (err) {
            setLoggedIn(false);
            setErrorLogin(true);
        }
    }

    const doLogOut = async () => {
        await API.logOut();
        setLoggedIn(false);
        // clean up everything
        setQuestionsAdmin([]);
        setLoggedAdmin("Anonymous");
        setLoggedAdminId(-1);
        setErrorLogin(false);
    }

    // Check if the user is already authorized
    useEffect(() => {
        const checkAuth = async () => {
            try {
                // here you have the user info, if already logged in
                let result = await API.getUserInfo();
                setLoggedAdmin(result.name);
                setLoggedAdminId(result.id);
                setLoggedIn(true);
                //console.log(result);
                setLoadingAuth(false);
            } catch (err) {
                setLoggedIn(false);
                //console.error(err.error);
                setLoadingAuth(false);
            }
        };
        checkAuth();
    }, []);

    useEffect(() => {
        API.getAllSurveys()
            .then(r => {
                setSurveys(r);
                setLoading(false);
            })
            .catch(r => {
                setSurveys([]);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (currSurvey !== 0)
            API.getAllQuestionsFromSurveyId(currSurvey)
                .then(r => {
                    // Order the questions using the position field
                    const sortedQ = r.sort((item1, item2) => {
                        return item1.position - item2.position;
                    });
                    setQuestions(sortedQ);
                })
                .catch(r => {
                    setQuestions([]);
                });
    }, [currSurvey]);

    return (
        <Router>
            <div className="App">
                <Switch>
                    <Route exact path="/" render={() =>
                        loggedIn ?
                            <Redirect to="/admin"/>
                            :
                            <>
                                <MyNavBar loggedIn={loggedIn} loggedAdmin={loggedAdmin} logout={doLogOut}/>
                                {loading ?
                                    <>
                                        <br/>
                                        <br/>
                                        <Spinner animation="border" variant="primary"/>
                                        <br/>
                                        <br/>
                                        <br/>
                                    </>
                                    :
                                    <>
                                        <br/>
                                        <Surveys surveys={surveys}/>
                                    </>
                                }
                            </>
                    }/>
                    <Route exact path="/survey/:id" render={({match}) => {
                        const id = parseInt(match.params.id, 10);
                        if (isNaN(id) || id <= 0) {
                            return (
                                loggedIn ?
                                    <Redirect to="/admin"/>
                                    :
                                    <>
                                        <MyNavBar loggedIn={loggedIn} loggedAdmin={loggedAdmin} logout={doLogOut}/>
                                        <Card>
                                            <Card.Body>
                                                <Card.Title>Error</Card.Title>
                                                <Card.Text>
                                                    The id passed is not a number or is less than 1
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </>
                            );
                        } else {
                            setCurrSurvey(id);
                            return (
                                loggedIn ?
                                    <Redirect to="/"/>
                                    :
                                    <>
                                        <MyNavBar loggedIn={loggedIn} loggedAdmin={loggedAdmin} logout={doLogOut}/>
                                        <Questions id={id} questions={questions} setQuestions={setQuestions}/>
                                    </>
                            );
                        }
                    }}/>

                    <Route exact path="/admin" render={() =>
                        loadingAuth ?
                            <Spinner animation="border" variant="primary" style={{"marginTop": "100px"}}/>
                            :
                            (
                                loggedIn ?
                                    <>
                                        <MyNavBar loggedIn={loggedIn} loggedAdmin={loggedAdmin} logout={doLogOut}/>
                                        <br/>
                                        <AdminButtons/>
                                    </>
                                    :
                                    <UnauthorizedUserMessage/>
                            )
                    }/>

                    <Route exact path="/admin/newSurvey" render={() =>
                        loadingAuth ?
                            <Spinner animation="border" variant="primary" style={{"marginTop": "100px"}}/>
                            :
                            (
                                loggedIn ?
                                    <>
                                        <MyNavBar loggedIn={loggedIn} loggedAdmin={loggedAdmin} logout={doLogOut}/>
                                        <br/>
                                        <QuestionsAdmin questions={questionsAdmin} setQuestions={setQuestionsAdmin}
                                                        owner={loggedAdminId}/>
                                    </>
                                    :
                                    <UnauthorizedUserMessage/>
                            )
                    }/>

                    <Route exact path="/admin/viewSurveys" render={() =>
                        loadingAuth ?
                            <Spinner animation="border" variant="primary" style={{"marginTop": "100px"}}/>
                            :
                            (
                                loggedIn ?
                                    <>
                                        <MyNavBar loggedIn={loggedIn} loggedAdmin={loggedAdmin} logout={doLogOut}/>
                                        <br/>
                                        <SurveysAdmin admin={loggedAdminId}/>
                                    </>
                                    :
                                    <UnauthorizedUserMessage/>
                            )
                    }/>

                    <Route exact path="/admin/survey/:surveyId" render={({match}) => {
                        const id = parseInt(match.params.surveyId, 10);
                        if (isNaN(id) || id <= 0) {
                            return (
                                loadingAuth ?
                                    <Spinner animation="border" variant="primary" style={{"marginTop": "100px"}}/>
                                    :
                                    (
                                        loggedIn ?
                                            <>
                                                <MyNavBar loggedIn={loggedIn} loggedAdmin={loggedAdmin}
                                                          logout={doLogOut}/>
                                                <Card>
                                                    <Card.Body>
                                                        <Card.Title>Error</Card.Title>
                                                        <Card.Text>
                                                            The id passed is not a number or is less than 1
                                                        </Card.Text>
                                                    </Card.Body>
                                                </Card>
                                            </>
                                            :
                                            <Redirect to="/"/>
                                    )
                            );
                        } else {
                            return (
                                loadingAuth ?
                                    <Spinner animation="border" variant="primary" style={{"marginTop": "100px"}}/>
                                    :
                                    (
                                        loggedIn ?
                                            <>
                                                <MyNavBar loggedIn={loggedIn} loggedAdmin={loggedAdmin}
                                                          logout={doLogOut}/>
                                                <ViewAnswersOneSurvey surveyId={id} loggedIn={loggedIn}
                                                                      loggedAdmin={loggedAdminId}/>
                                            </>
                                            :
                                            <Redirect to="/"/>
                                    )
                            );
                        }
                    }}/>

                    <Route exact path="/login" render={({match}) =>
                        <Login login={doLogIn} loggedIn={loggedIn} error={errorLogin} setError={setErrorLogin}/>
                    }/>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
