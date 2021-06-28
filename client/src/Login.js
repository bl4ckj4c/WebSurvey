import {Button, Container, Form, Row, Col, Alert, Jumbotron} from "react-bootstrap";
import {Redirect} from "react-router-dom";
import {useEffect, useState} from "react";

function Login(props) {
    const [username, setUsername] = useState('');
    const [validUsername, setValidUsername] = useState('init');
    const [password, setPassword] = useState('');
    const [validPassword, setValidPassword] = useState('init');

    // Redirect to the admin page
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        if (props.loggedIn)
            setRedirect(true);
    }, [props.loggedIn]);

    return (
        <Container className="justify-content-center align-items-center">
            {
                redirect ?
                    <Redirect to="/admin"/>
                    :
                    <Row style={{"marginTop": "100px"}}>
                        <Col/>
                        <Col md={6} xs={12}>
                            <h2>Log In</h2>
                            <br/>
                            <Form>
                                <Form.Group className="mb-3" controlId="formUsername">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control type="text"
                                                  placeholder="Username"
                                                  value={username}
                                                  onChange={(event) => {
                                                      setUsername(event.target.value);
                                                      if (event.target.value === '')
                                                          setValidUsername('invalid');
                                                      else
                                                          setValidUsername('valid');
                                                  }}
                                                  isInvalid={validUsername === 'invalid'}
                                                  isValid={validUsername === 'valid'}/>
                                    <Form.Control.Feedback type='invalid'>
                                        Please insert a valid username
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password"
                                                  placeholder="Password"
                                                  value={password}
                                                  onChange={(event) => {
                                                      setPassword(event.target.value);
                                                      if (event.target.value === '')
                                                          setValidPassword('invalid');
                                                      else if (event.target.value.length < 8)
                                                          setValidPassword('short');
                                                      else
                                                          setValidPassword('valid');
                                                  }}
                                                  isInvalid={validPassword === 'invalid' || validPassword === 'short'}
                                                  isValid={validPassword === 'valid'}/>
                                    <Form.Control.Feedback type='invalid'>
                                        {validPassword === 'invalid' ?
                                            "Please insert the password"
                                            :
                                            "Please insert a password with at least 8 characters"
                                        }
                                    </Form.Control.Feedback>
                                </Form.Group>
                                {props.error ?
                                    <>
                                        <br/>
                                        <Alert variant="danger">
                                            Log In Failed<br/>
                                            Try again
                                        </Alert>
                                    </>
                                    :
                                    <></>
                                }
                                {
                                    (validUsername === 'valid' && validPassword === 'valid') ?
                                        <Button variant="primary" type="button"
                                                onClick={() => props.login({username, password})}>
                                            Log In
                                        </Button>
                                        :
                                        <Button variant="primary" type="button" disabled>
                                            Log In
                                        </Button>
                                }
                            </Form>
                        </Col>
                        <Col/>
                    </Row>
            }
        </Container>
    );
}

function UnauthorizedUserMessage(props) {
    const [redirect, setRedirect] = useState(false);

    return (
        redirect ?
            <Redirect to="/"/>
            :
            <Container className="justify-content-center align-items-center">
                <Jumbotron style={{"marginTop": "100px"}}>
                    <h2 className="text-danger">Unauthorized User</h2>
                    <br/>
                    <h4>
                        You shall not pass! 🧙
                    </h4>
                    <p>
                        If you are an admin please log in from the home page.
                    </p>
                    <br/>
                    <Button variant="danger" onClick={() => setRedirect(true)}>Go Home</Button>
                </Jumbotron>
            </Container>
    );
}

export {Login, UnauthorizedUserMessage};