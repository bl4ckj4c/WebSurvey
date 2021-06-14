import {Card, Form, ListGroup, ListGroupItem, Button, Container} from "react-bootstrap";
import {useState} from "react";
import {Link} from "react-router-dom";

function swapQuestions(id, dir, questions, setQuestions) {
    const clonedQ = Object.assign({}, questions);

    const currQIndex = questions.findIndex(x => x.id === id);
    const currQ = questions[currQIndex];
    let otherQIndex = 0;
    let tmp = null;

    // Move the current question up by one position
    if (dir === "up") {
        // The question is already at the top
        if (currQ.pos === 1)
            return;
        // Swap the questions
        otherQIndex = questions.findIndex(x => x.pos === currQ.pos-1);
        tmp = clonedQ[currQIndex];
        clonedQ[currQIndex] = clonedQ[otherQIndex];
        clonedQ[otherQIndex] = tmp;
        //setQuestions(clonedQ);
    }
    // Move the current question down by one position
    else if (dir === "down") {
        // The question is already at the bottom
        if (currQ.pos === questions.length)
            return;
        // Swap the questions
        otherQIndex = questions.findIndex(x => x.pos === currQ.pos+1);
        tmp = clonedQ[currQIndex];
        clonedQ[currQIndex] = clonedQ[otherQIndex];
        clonedQ[otherQIndex] = tmp;
        //setQuestions(clonedQ);
    }
}

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

function handleSubmit(event) {
    console.log('submit')
}

function Questions(props) {
    const [validInput, setValidInput] = useState(false);

    return (
        <Container className="justify-content-center align-items-center">
            <br/>
            <UserNameField setValid={setValidInput}/>
            <br/>
            {props.questions.map((question, index) =>
                <>
                    <Question key={question.id}
                              question={question}
                              questions={props.questions}
                              setQuestions={props.setQuestions}
                              setValid={setValidInput}/>
                    <br/>
                </>
            )}
            <br/>
            {validInput ?
                <Button variant="dark" type="submit" onClick={handleSubmit}>Submit</Button>
                :
                <Button disabled variant="dark" type="submit" onClick={handleSubmit}>Submit</Button>
            }
            <br/>
        </Container>
    );
}

function Question(props) {
    // Check the validity on the number of answers for closed questions
    const [validMCQ, setValidMCQ] = useState('init');
    const [numberMCQChecked, setNumberMCQChecked] = useState(0);

    // Check the validity on the answers for open questions
    const [validOpenAnswer, setValidOpenAnswer] = useState('init');
    const [openAnswer, setOpenAnswer] = useState('');
    const [checkedMCQ, setCheckedMCQ] = useState([false, false, false, false, false, false, false, false, false, false]);

    // Check if a question mandatory is filled
    const [validMandatory, setValidMandatory] = useState('init');

    if (!props.question.mandatory) {
        setValidMandatory('valid');
        props.setValid(true);
    }

    // Closed-answer question
    if (props.question.type === 'closed') {

        const answers = JSON.parse(props.question.answers);
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
                                                const newState = event.target.checked;
                                                setCheckedMCQ(oldCheckedMCQ => {
                                                    oldCheckedMCQ.map((checked, pos) => {
                                                        if(pos === index)
                                                            checked = newState;
                                                        //console.log(checked);
                                                        console.log(checkedMCQ[index]);
                                                        console.log(index);
                                                    });
                                                });
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
    const [username, setUsername] = useState('');

    return (
        <Card>
            <Card.Body>
                <Card.Title>Username</Card.Title>
            </Card.Body>
            <Form.Group controlId="openAnswer">
                <Form.Control value={username}
                              onChange={(event) => {
                                  setUsername(event.target.value);

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