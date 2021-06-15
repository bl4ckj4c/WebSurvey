import {Card, Form, ListGroup, ListGroupItem, Button, Container} from "react-bootstrap";
import {useState} from "react";
import {Link, Redirect} from "react-router-dom";
import API from "./API";

function Surveys(props) {
    return (
        <ListGroup>
            {props.surveys.map((survey, index) =>
                <Link to={"/survey/" + survey.id} key={survey.id}>
                    <ListGroup.Item action>
                        {survey.title}
                    </ListGroup.Item>
                </Link>
            )}
        </ListGroup>
    );
}

function Questions(props) {
    const [validInput, setValidInput] = useState(false);
    const [submitAnswers, setSubmitAnswers] = useState(false);

    // The username is global because is needed by each question for the submit process
    const [username, setUsername] = useState('');

    return (
        <Container className="justify-content-center align-items-center">
            <br/>
            <UserNameField setValid={setValidInput} username={username} setUsername={setUsername}/>
            <br/>
            {props.questions.map((question, index) =>
                <>
                    <Question key={question.id}
                              question={question}
                              questions={props.questions}
                              setQuestions={props.setQuestions}
                              setValid={setValidInput}
                              submitAnswers={submitAnswers}
                              surveyId={props.id}
                              username={username}
                              setUsername={setUsername}
                    />
                    <br/>
                </>
            )}
            <br/>
            {validInput ?
                <Button variant="dark" type="submit" onClick={() => setSubmitAnswers(true)}>Submit</Button>
                :
                <Button disabled variant="dark" type="submit">Submit</Button>
            }
            <br/>
        </Container>
    );
}

function Question(props) {
    // Check the validity on the number of answers for closed questions
    const [validMCQ, setValidMCQ] = useState('init');
    const [numberMCQChecked, setNumberMCQChecked] = useState(0);

    // Redirect
    const [redirect, setRedirect] = useState(false);

    // Check the validity on the answers for open questions
    const [validOpenAnswer, setValidOpenAnswer] = useState('init');
    const [openAnswer, setOpenAnswer] = useState('');
    const [checkedMCQ0, setCheckedMCQ0] = useState(false);
    const [checkedMCQ1, setCheckedMCQ1] = useState(false);
    const [checkedMCQ2, setCheckedMCQ2] = useState(false);
    const [checkedMCQ3, setCheckedMCQ3] = useState(false);
    const [checkedMCQ4, setCheckedMCQ4] = useState(false);
    const [checkedMCQ5, setCheckedMCQ5] = useState(false);
    const [checkedMCQ6, setCheckedMCQ6] = useState(false);
    const [checkedMCQ7, setCheckedMCQ7] = useState(false);
    const [checkedMCQ8, setCheckedMCQ8] = useState(false);
    const [checkedMCQ9, setCheckedMCQ9] = useState(false);
    let checkedMCQ = [
        checkedMCQ0,
        checkedMCQ1,
        checkedMCQ2,
        checkedMCQ3,
        checkedMCQ4,
        checkedMCQ5,
        checkedMCQ6,
        checkedMCQ7,
        checkedMCQ8,
        checkedMCQ9
    ];
    let setCheckedMCQ = [
        setCheckedMCQ0,
        setCheckedMCQ1,
        setCheckedMCQ2,
        setCheckedMCQ3,
        setCheckedMCQ4,
        setCheckedMCQ5,
        setCheckedMCQ6,
        setCheckedMCQ7,
        setCheckedMCQ8,
        setCheckedMCQ9
    ]

    // Check if a question mandatory is filled
    const [validMandatory, setValidMandatory] = useState('init');

    if(redirect)
        return (<Redirect to="/"/>);

    if (!props.question.mandatory) {
        setValidMandatory('valid');
        props.setValid(true);
    }

    // Closed-answer question
    if (props.question.type === 'closed') {
        const answers = JSON.parse(props.question.answers);

        // Submit the answer to this question
        if (props.submitAnswers) {
            let tmpAnswers = [];
            for(let i = 0; i < answers.length; i++) {
                if(checkedMCQ[i])
                    tmpAnswers.push(i);
            }
                API.submitSingleAnswer({
                    surveyId: props.surveyId,
                    questionId: props.question.id,
                    type: 'closed',
                    answer: JSON.stringify(tmpAnswers)
                })
                    .then(() => setRedirect(true))
                    .catch(() => setRedirect(true));
        }

        return (
            <Card bg="light">
                <Card.Body>
                    <Card.Title>{props.question.title}</Card.Title>
                    <Card.Text>{props.question.question}</Card.Text>
                </Card.Body>
                <ListGroup className="list-group-flush">
                    {answers.map((answer, index) =>
                        <ListGroupItem key={index}>
                            <Form.Group controlId={"answer" + index}>
                                <Form.Check variant='success'
                                            label={answer}
                                            onChange={(event) => {
                                                setCheckedMCQ[index](event.target.checked);
                                            }}
                                            checked={checkedMCQ[index]}/>
                            </Form.Group>
                        </ListGroupItem>
                    )}
                </ListGroup>
                <Card.Footer className="text-muted" defaultActiveKey="#up">
                    <Button variant="dark"
                            onClick={() => swapQuestions(
                                props.question.id,
                                "up",
                                props.questions,
                                props.setQuestions
                            )}
                    >
                        Up
                    </Button>{' '}
                    <Button variant="dark"
                            onClick={() => swapQuestions(
                                props.question.id,
                                "down",
                                props.questions,
                                props.setQuestions
                            )}
                    >
                        Down
                    </Button>
                </Card.Footer>
            </Card>
        );
    }


    // Open-ended question
    if (props.question.type === 'open') {
        // Submit the answer to this question
        if (props.submitAnswers) {
            API.submitSingleAnswer({
                surveyId: props.surveyId,
                questionId: props.question.id,
                type: 'open',
                answer: openAnswer
            })
                .then(() => setRedirect(true))
                .catch(() => setRedirect(true));
        }

        return (
            <Card bg="light">
                <Card.Body>
                    <Card.Title>{props.question.title}</Card.Title>
                </Card.Body>
                <Form.Group controlId="openAnswer">
                    <Form.Control value={openAnswer}
                                  onChange={(event) => {
                                      setOpenAnswer(event.target.value);

                                      if (event.target.value === '') {
                                          setValidOpenAnswer('invalid');
                                          props.setValid(false);
                                      } else {
                                          setValidOpenAnswer('valid');
                                          props.setValid(true);
                                      }
                                  }}
                                  isInvalid={validOpenAnswer === 'invalid'}
                                  as="textarea"
                                  rows={5}
                                  placeholder="Enter here your answer"/>
                    <Form.Control.Feedback type='invalid'>
                        The answer cannot be empty, please fill the field
                    </Form.Control.Feedback>
                </Form.Group>
                <Card.Footer className="text-muted" defaultActiveKey="#up">
                    <Button variant="dark"
                            onClick={() => swapQuestions(
                                props.question.id,
                                "up",
                                props.questions,
                                props.setQuestions
                            )}
                    >
                        Up
                    </Button>{' '}
                    <Button variant="dark"
                            onClick={() => swapQuestions(
                                props.question.id,
                                "down",
                                props.questions,
                                props.setQuestions
                            )}
                    >
                        Down
                    </Button>
                </Card.Footer>
            </Card>
        );
    }
}

function UserNameField(props) {
    const [validUsername, setValidUsername] = useState('init');

    return (
        <Card>
            <Card.Body>
                <Card.Title>Username</Card.Title>
            </Card.Body>
            <Form.Group controlId="openAnswer">
                <Form.Control value={props.username}
                              onChange={(event) => {
                                  props.setUsername(event.target.value);

                                  if (event.target.value === '') {
                                      setValidUsername('invalid');
                                      props.setValid(false);
                                  } else {
                                      setValidUsername('valid');
                                      props.setValid(true);
                                  }
                              }}
                              isInvalid={validUsername === 'invalid'}
                              type="text"
                              placeholder="Enter here your name"/>
                <Form.Control.Feedback type='invalid'>
                    Insert your username please
                </Form.Control.Feedback>
            </Form.Group>
        </Card>
    );
}

export {Surveys, Questions};