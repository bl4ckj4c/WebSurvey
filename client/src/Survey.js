import {Card, Form, ListGroup, ListGroupItem, Button, Container, Badge, Alert, Spinner} from "react-bootstrap";
import {useEffect, useState} from "react";
import {Link, Redirect} from "react-router-dom";
import API from "./API";

function Surveys(props) {
    return (
        <Container className="justify-content-center align-items-center">
            {props.surveys.map((survey, index) => {
                    // Hover information for card style
                    const [mouseEnter, setMouseEnter] = useState(false);

                    return (
                        <div key={survey.id}>
                            <Link to={"/survey/" + survey.id} style={{textDecoration: 'none'}}>
                                <Card bg="white"
                                      border={mouseEnter ? "primary" : "#e5e5e5"}
                                      text="dark"
                                      onMouseEnter={() => setMouseEnter(true)}
                                      onMouseLeave={() => setMouseEnter(false)}>
                                    <Card.Body>
                                        <Card.Title>
                                            {survey.title}
                                        </Card.Title>
                                    </Card.Body>
                                </Card>
                            </Link>
                            <br/>
                        </div>
                    );
                }
            )}
        </Container>
    );
}

function Questions(props) {
    const [validInputs, setValidInputs] = useState([]);
    const [allInputsValid, setAllInputsValid] = useState(false);

    const [submitAnswers, setSubmitAnswers] = useState(false);

    // The username is global because is needed by each question for the submit process
    const [username, setUsername] = useState('');
    const [validUsername, setValidUsername] = useState(false);

    // GroupId used to submit answers all together
    const [groupId, setGroupId] = useState(0);

    // Loading state
    const [loading, setLoading] = useState(true);

    // Obtain the groupId used to connect together answers to a survey session
    useEffect(() => {
        API.getGroupId()
            .then((r) => {
                setGroupId(r);
                setLoading(false);
            })
            .catch(() => setGroupId(0));
    }, []);

    // Initialize the state array for valid inputs
    useEffect(() => {
        setAllInputsValid(false);
        for (let i = 0; i < props.questions.length; i++) {
            if (props.questions[i].mandatory === 1)
                setValidInputs(old => [...old, false]);
            else
                setValidInputs(old => [...old, true]);
        }
    }, [props.questions]);

    // Check if all inputs are valid
    useEffect(() => {
        let check = true;
        check = validUsername && check;
        for (let i = 0; i < validInputs.length; i++) {
            check = validInputs[i] && check;
            if (!check)
                break;
        }
        if (validInputs.length === 0)
            setAllInputsValid(false);
        else
            setAllInputsValid(check);
    }, [validInputs, validUsername]);

    return (
        <Container className="justify-content-center align-items-center">
            {loading ?
                <Spinner animation="border" variant="primary" style={{"marginTop": "100px"}}/>
                :
                <>
                    <br/>
                    <UserNameField setValidUsername={setValidUsername} username={username} setUsername={setUsername}/>
                    <br/>
                    {props.questions.map((question, index) =>
                        <>
                            <Question key={question.id}
                                      index={index}
                                      validityStates={validInputs}
                                      setValidityStates={setValidInputs}
                                      question={question}
                                      questions={props.questions}
                                      setQuestions={props.setQuestions}
                                      submitAnswers={submitAnswers}
                                      surveyId={props.id}
                                      username={username}
                                      setUsername={setUsername}
                                      groupId={groupId}
                            />
                            <br/>
                        </>
                    )}
                    <br/>
                    {allInputsValid ?
                        <Button variant="dark" type="submit" onClick={() => setSubmitAnswers(true)}>Submit</Button>
                        :
                        <Button disabled variant="dark" type="submit">Submit</Button>
                    }
                    <br/>
                </>

            }
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

    useEffect(() => {
        if (!props.submitAnswers)
            return;
        // Submit closed answer(s) to this question
        if (props.question.type === 'closed') {
            const answers = JSON.parse(props.question.answers);
            let tmpAnswers = [];
            for (let i = 0; i < answers.length; i++) {
                if (checkedMCQ[i])
                    tmpAnswers.push(i);
            }
            API.submitSingleAnswer({
                groupId: props.groupId,
                surveyId: props.surveyId,
                questionId: props.question.id,
                type: 'closed',
                answer: JSON.stringify(tmpAnswers),
                user: props.username
            })
                .then(() => setRedirect(true))
                .catch(() => setRedirect(true));
        }
        // Submit closed answer to this question
        if (props.question.type === 'open') {
            API.submitSingleAnswer({
                groupId: props.groupId,
                surveyId: props.surveyId,
                questionId: props.question.id,
                type: 'open',
                answer: openAnswer,
                user: props.username
            })
                .then(() => setRedirect(true))
                .catch(() => setRedirect(true));
        }
    }, [props.submitAnswers])

    if (redirect)
        return (<Redirect to="/"/>);

    // Closed-answer question
    if (props.question.type === 'closed') {
        const answers = JSON.parse(props.question.answers);

        return (
            <Card bg="light">
                <Card.Body>
                    <Card.Title>
                        {props.question.title}
                        {props.question.mandatory === 1 ?
                            <>
                                {' '}<Badge variant="danger">Mandatory</Badge>
                            </>
                            :
                            <>
                            </>
                        }
                    </Card.Title>
                    <Card.Text>Minimum answers: {props.question.min}</Card.Text>
                    <Card.Text>Maximum answers: {props.question.max}</Card.Text>
                </Card.Body>
                <Container className="justify-content-center align-items-center">
                    <ListGroup>
                        {answers.map((answer, index) =>
                            <ListGroupItem key={index}>
                                <Form.Group controlId={"answer" + index}>
                                    <Form.Check variant='success'
                                                label={answer}
                                                onChange={(event) => {
                                                    setCheckedMCQ[index](event.target.checked);
                                                    let currChecked = numberMCQChecked;
                                                    if (event.target.checked) {
                                                        currChecked++;
                                                        setNumberMCQChecked(old => old + 1);
                                                    } else {
                                                        currChecked--;
                                                        setNumberMCQChecked(old => old - 1);
                                                    }
                                                    if (currChecked < props.question.min || currChecked > props.question.max) {
                                                        setValidMCQ('invalid');
                                                        props.setValidityStates(oldList => oldList.map((q, index) => {
                                                            if (props.index === index)
                                                                return false;
                                                            else
                                                                return q;
                                                        }));
                                                    } else {
                                                        setValidMCQ('valid');
                                                        props.setValidityStates(oldList => oldList.map((q, index) => {
                                                            if (props.index === index)
                                                                return true;
                                                            else
                                                                return q;
                                                        }));
                                                    }
                                                }}
                                                checked={checkedMCQ[index]}/>
                                </Form.Group>
                            </ListGroupItem>
                        )}
                    </ListGroup>
                    {validMCQ === 'invalid' ?
                        <>
                            <br/>
                            <Alert variant="danger">Please respect minimum and maximum parameters</Alert>
                        </>
                        :
                        <br/>
                    }
                </Container>
            </Card>
        );
    }


    // Open-ended question
    if (props.question.type === 'open') {
        return (
            <Card bg="light">
                <Card.Body>
                    <Card.Title>
                        {props.question.title}
                        {props.question.mandatory === 1 ?
                            <>
                                {' '}<Badge variant="danger">Mandatory</Badge>
                            </>
                            :
                            <>
                            </>
                        }
                    </Card.Title>
                </Card.Body>
                <Container className="justify-content-center align-items-center">
                    <Form.Group controlId="openAnswer">
                        <Form.Control value={openAnswer}
                                      onChange={(event) => {
                                          setOpenAnswer(event.target.value);

                                          if (props.question.mandatory === 1 && event.target.value === '') {
                                              setValidOpenAnswer('invalid');
                                              props.setValidityStates(oldList => oldList.map((q, index) => {
                                                  if (props.index === index)
                                                      return false;
                                                  else
                                                      return q;
                                              }));
                                          } else {
                                              setValidOpenAnswer('valid');
                                              props.setValidityStates(oldList => oldList.map((q, index) => {
                                                  if (props.index === index)
                                                      return true;
                                                  else
                                                      return q;
                                              }));
                                          }
                                      }}
                                      isInvalid={validOpenAnswer === 'invalid'}
                                      as="textarea"
                                      rows={5}
                                      maxLength={200}
                                      placeholder="Enter here your answer"/>
                        <Form.Control.Feedback type='invalid'>
                            The answer cannot be empty, please fill the field
                        </Form.Control.Feedback>
                    </Form.Group>
                </Container>
            </Card>
        );
    }
}

function UserNameField(props) {
    const [validUsername, setValidUsername] = useState('init');

    return (
        <Card bg="light">
            <Card.Body>
                <Card.Title>Username</Card.Title>
            </Card.Body>
            <Container className="justify-content-center align-items-center">
                <Form.Group controlId="openAnswer">
                    <Form.Control value={props.username}
                                  onChange={(event) => {
                                      props.setUsername(event.target.value);

                                      if (event.target.value === '') {
                                          setValidUsername('invalid');
                                          props.setValidUsername(false);
                                      } else {
                                          setValidUsername('valid');
                                          props.setValidUsername(true);
                                      }
                                  }}
                                  isInvalid={validUsername === 'invalid'}
                                  type="text"
                                  placeholder="Enter here your name"/>
                    <Form.Control.Feedback type='invalid'>
                        Insert your username please
                    </Form.Control.Feedback>
                </Form.Group>
            </Container>
        </Card>
    );
}

export {Surveys, Questions}