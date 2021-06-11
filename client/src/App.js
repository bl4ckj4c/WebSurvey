import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import {useEffect, useState} from "react";
import {CardDeck, Container, Navbar, Spinner} from "react-bootstrap";
import {UserAdmin} from "./Login";
import {Survey, Question} from "./Survey";
import API from './API';

function App() {
    // At the beginning, no user is logged in
    const [loggedIn, setLoggedIn] = useState(false);
    // User or admin?
    const [userAdmin, setUserAdmin] = useState('user');
    // List of all available surveys
    const [surveys, setSurveys] = useState([]);
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

    return (
        <Router>
            <div className="App">
                <Switch>
                    <Route path="/" render={() =>
                        <>
                            <Navbar bg="primary" variant="dark" sticky="top">
                                <Container>
                                    <Navbar.Brand href="/" col>Surveys</Navbar.Brand>
                                </Container>
                                <Container>
                                    <Navbar.Toggle/>
                                    <Navbar.Collapse className="justify-content-end">
                                        <Navbar.Text>
                                            Signed in as: <a href="login">Anonymous</a>
                                        </Navbar.Text>
                                    </Navbar.Collapse>
                                </Container>
                            </Navbar>
                            {loading ?
                                <>
                                    <Spinner animation="grow" variant="dark"/>
                                    <Spinner animation="grow" variant="dark"/>
                                    <Spinner animation="grow" variant="dark"/>
                                </>
                                :
                                <CardDeck>
                                    {surveys.map((survey, index) => <Survey title={survey.title}/>)}
                                </CardDeck>}
                        </>
                    }/>
                    {//<Route path="/user" render={() => </>}/>
                        //<Route path="/admin" render={() => </>}/>
                    }
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
