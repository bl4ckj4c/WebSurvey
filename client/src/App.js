import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {useEffect, useState} from "react";
import {Card, Spinner} from "react-bootstrap";
import {UserAdmin} from "./Login";
import {Surveys, Questions} from "./Survey";
import API from './API';
import MyNavBar from "./MyNavBar";

function App() {
    // At the beginning, no user is logged in
    const [loggedIn, setLoggedIn] = useState(false);
    // Current logged admin
    const [loggedAdmin, setLoggedAdmin] = useState('');
    // List of all available surveys
    const [surveys, setSurveys] = useState([]);
    // Current survey selected by anonymous user
    const [currSurvey, setCurrSurvey] = useState(0);
    // List of all questions in the survey
    const [questions, setQuestions] = useState([]);
    // Loading state for the home page
    const [loading, setLoading] = useState(true);

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
                        <>
                            <MyNavBar loggedIn={loggedIn} loggedAdmin={loggedAdmin}/>
                            {loading ?
                                <>
                                    <Spinner animation="grow" variant="dark"/>
                                    <Spinner animation="grow" variant="dark"/>
                                    <Spinner animation="grow" variant="dark"/>
                                </>
                                :
                                <Surveys surveys={surveys}/>
                            }
                        </>
                    }/>
                    <Route exact path="/survey/:id" render={({match}) => {
                        const id = parseInt(match.params.id, 10);
                        if (isNaN(id) || id <= 0) {
                            return (
                                <>
                                    <MyNavBar loggedIn={loggedIn} loggedAdmin={loggedAdmin}/>
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
                        }
                        else {
                            setCurrSurvey(id);
                            return (
                                <>
                                    <MyNavBar loggedIn={loggedIn} loggedAdmin={loggedAdmin}/>
                                    <Questions id={id} questions={questions} setQuestions={setQuestions}/>
                                </>
                            );
                        }
                    }}/>

                    {/*
                    <Route path="/user" render={() =>
                        <Row className="justify-content-center align-items-center">
                        <Question title="Test Closed"
                                question={'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.'}
                                type="closed"
                                answers={['prova', 'prova2', 'prova3']}
                        />{' '}

                        <Question title="Test Open"
                                question={'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.'}
                                type="open"
                        />
                        </Row>}/>
                       */}
                </Switch>
            </div>
        </Router>
    );
}

export default App;
