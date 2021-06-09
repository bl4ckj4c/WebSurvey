import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom';
import {useState} from "react";
import {Button, Row, Col, InputGroup, ListGroup, Container} from "react-bootstrap";
import {UserAdmin} from "./Login";
import {Question} from "./Question";

function App() {
    // At the beginning, no user is logged in
    const [loggedIn, setLoggedIn] = useState(false);
    // User or admin?
    const [userAdmin, setUserAdmin] = useState('');


    return (
        <Router>
            <div className="App">
                <Switch>
                    {//<Route path="/" render={() => <UserAdmin setUserAdmin={setUserAdmin}/>}/>
                    }
                    {//<Route path="/user" render={() => </>}/>
                    //<Route path="/admin" render={() => </>}/>
                    }
                    <Route path="/user" render={() =>
                        <Row className="justify-content-center align-items-center">
                        <Question title="Test Closed"
                                  question={'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.'}
                                  type="closed"
                                  answers={['prova', 'prova2', 'prova3']}
                        />

                        <Question title="Test Open"
                                  question={'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.'}
                                  type="open"
                        />
                        </Row>}/>
                </Switch>
            </div>
        </Router>
    );
}

export default App;
