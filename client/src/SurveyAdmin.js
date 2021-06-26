import {
    Card,
    Form,
    ListGroup,
    ListGroupItem,
    Button,
    Container,
    Modal,
    Badge,
    Col,
    InputGroup,
    FormControl, Row, Spinner, Pagination, ButtonGroup, Jumbotron, CloseButton
} from "react-bootstrap";
import {useEffect, useState} from "react";
import {Link, Redirect} from "react-router-dom";
import API from "./API";
import {Surveys} from "./Survey";

function swapQuestions(pos, dir, questions, setQuestions) {
    let currItem = questions[pos];

    // Move the current question up by one position
    if (dir === "up") {
        let otherItem = questions[pos - 1];
        // The question is already at the top
        if (pos === 0)
            return;
        // Swap the questions
        currItem.position = pos - 1;
        otherItem.position = pos;
        setQuestions(oldList => oldList.filter(q => q.position !== pos));
        setQuestions(oldList => oldList.filter(q => q.position !== (pos - 1)));
        setQuestions(oldList => [...oldList, currItem]);
        setQuestions(oldList => [...oldList, otherItem]);
        setQuestions(oldList => oldList.sort((a, b) => {
            return a.position - b.position;
        }));
    }
    // Move the current question down by one position
    else if (dir === "down") {
        let otherItem = questions[pos + 1];
        // The question is already at the bottom
        if (pos === (questions.length - 1))
            return;
        // Swap the questions
        currItem.position = pos + 1;
        otherItem.position = pos;
        setQuestions(oldList => oldList.filter(q => q.position !== pos));
        setQuestions(oldList => oldList.filter(q => q.position !== (pos + 1)));
        setQuestions(oldList => [...oldList, currItem]);
        setQuestions(oldList => [...oldList, otherItem]);
        setQuestions(oldList => oldList.sort((a, b) => {
            return a.position - b.position;
        }));
    }
}

function deleteQuestion(pos, setQuestions, questions) {
    let size = questions.length;
    setQuestions(oldList => oldList.filter(q => q.position !== pos));
    //setQuestions(oldList => oldList.map((q, index) => q.position = index));
}

function SurveysAdmin(props) {
    // Survey of a specified admin
    const [surveysAdmin, setSurveysAdmin] = useState([]);

    // Loading state
    const [loading, setLoading] = useState(true);

    const [redirect, setRedirect] = useState('');

    useEffect(() => {
        API.getSurveyByIdForAdmin(props.admin)
            .then(r => {
                setSurveysAdmin(r);
                setLoading(false);
            })
            .catch(r => {
                setSurveysAdmin([]);
            });
    }, []);

    return (
        <Container className="justify-content-center align-items-center">
            {loading ?
                <Spinner animation="border" variant="primary" style={{"marginTop": "100px"}}/>
                :
                (redirect === 'new' ?
                        <Redirect to="/admin/newSurvey"/>
                        :
                        (
                            redirect === 'back' ?
                                <Redirect to="/admin"/>
                                :
                                (
                                    surveysAdmin.length === 0 ?
                                        <Jumbotron style={{"marginTop": "50px"}}>
                                            <h3>No survey found 😢</h3>
                                            <br/>
                                            <br/>
                                            <Button variant="dark" onClick={() => setRedirect('back')}>Go back</Button>
                                            {' '}
                                            <Button variant="success" onClick={() => setRedirect('new')}>Create a
                                                survey</Button>
                                        </Jumbotron>
                                        :
                                        surveysAdmin.map((survey, index) =>
                                            <>
                                                <Link to={"/admin/survey/" + survey.id} key={survey.id}
                                                      style={{textDecoration: 'none'}}>
                                                    <Card bg="light">
                                                        <Card.Body>
                                                            <Card.Title>
                                                                {survey.title}
                                                            </Card.Title>
                                                        </Card.Body>
                                                        <Card.Footer>
                                                            Number of answers: {survey.numAnswer}
                                                        </Card.Footer>
                                                    </Card>
                                                </Link>
                                                <br/>
                                            </>
                                        )
                                )
                        )
                )

            }
        </Container>
    );
}

function AddNewQuestionModal(props) {
    // State to create the modal depending on closed or open question
    const [openClose, setOpenClose] = useState('Open');
    // State for the mandatory option
    const [mandatory, setMandatory] = useState(false);

    // States for the validity of the title
    const [validTitle, setValidTitle] = useState('init');
    const [title, setTitle] = useState('');

    // States for closed answers
    const [answers, setAnswers] = useState([]);
    const [numAnswers, setNumAnswers] = useState(1);
    const [min, setMin] = useState(0);
    const [validMin, setValidMin] = useState('init');
    const [max, setMax] = useState(1);
    const [validMax, setValidMax] = useState('init');

    // States for valid answers
    const [checkedMCQ0, setCheckedMCQ0] = useState('init');
    const [checkedMCQ1, setCheckedMCQ1] = useState('init');
    const [checkedMCQ2, setCheckedMCQ2] = useState('init');
    const [checkedMCQ3, setCheckedMCQ3] = useState('init');
    const [checkedMCQ4, setCheckedMCQ4] = useState('init');
    const [checkedMCQ5, setCheckedMCQ5] = useState('init');
    const [checkedMCQ6, setCheckedMCQ6] = useState('init');
    const [checkedMCQ7, setCheckedMCQ7] = useState('init');
    const [checkedMCQ8, setCheckedMCQ8] = useState('init');
    const [checkedMCQ9, setCheckedMCQ9] = useState('init');
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

    // Valid inputs
    const [validInputs, setValidInputs] = useState([]);
    const [allValidInputs, setAllValidInputs] = useState(false);

    useEffect(() => {
        if (answers.length === 0)
            setAnswers(oldList => [...oldList, '']);
    }, []);

    useEffect(() => {
        setAllValidInputs(false);
    }, [openClose]);

    useEffect(() => {
        setAnswers([]);
        setAllValidInputs(false);
        setMax(1);
        for (let i = 0; i < numAnswers; i++)
            setAnswers(oldList => [...oldList, '']);
        for (let i = 0; i < 10; i++) {
            setCheckedMCQ[i]('init');
            setValidInputs(old => [...old, false]);
        }
    }, [numAnswers]);

    useEffect(() => {
        let check = true;
        check = validMin && check;
        check = validMax && check;
        if (validTitle === 'init' || validTitle === 'invalid')
            check = false;
        if (openClose === 'close') {
            for (let i = 0; i < validInputs.length; i++) {
                check = validInputs[i] && check;
                if (!check)
                    break;
            }
        }
        if (validInputs.length === 0)
            setAllValidInputs(false);
        else
            setAllValidInputs(check);
    }, [validInputs, validTitle, validMin, validMax]);

    return (
        <Modal show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>New Question</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Check
                        type="switch"
                        id="openclose-switch"
                        label={openClose}
                        onChange={(event) => {
                            if (event.target.checked)
                                setOpenClose('Closed');
                            else
                                setOpenClose('Open');
                        }}
                        checked={openClose !== 'Open'}
                    />
                    <br/>
                    <Form.Group controlId="formQuestionTitle">
                        <Form.Label>Question Title</Form.Label>
                        <Form.Control type="text"
                                      placeholder="Enter the title of the question"
                                      value={title}
                                      onChange={(event) => {
                                          setTitle(event.target.value);

                                          if (event.target.value === '') {
                                              setValidTitle('invalid');
                                          } else {
                                              setValidTitle('valid');
                                          }
                                      }}
                                      isInvalid={validTitle === 'invalid'}/>
                        <Form.Control.Feedback type='invalid'>
                            Insert the title of the question please
                        </Form.Control.Feedback>
                    </Form.Group>
                    {openClose === 'Closed' ?
                        <Form>
                            <Form.Row>
                                <Form.Group as={Col} controlId="totalAnswers">
                                    <Form.Label>Number of answers</Form.Label>
                                    <Form.Control as="select"
                                                  value={numAnswers}
                                                  onChange={(event) => setNumAnswers(parseInt(event.target.value))}>
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                        <option>6</option>
                                        <option>7</option>
                                        <option>8</option>
                                        <option>9</option>
                                        <option>10</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group as={Col} controlId="minimumAnswers">
                                    <Form.Label>Minimum answers</Form.Label>
                                    <Form.Control as="select"
                                                  value={min}
                                                  onChange={(event) => {
                                                      if (event.target.value <= numAnswers) {
                                                          setMin(parseInt(event.target.value));
                                                          setValidMin('valid');
                                                      } else {
                                                          setMin(parseInt(event.target.value));
                                                          setValidMin('invalid');
                                                      }
                                                      if (parseInt(event.target.value) > 0)
                                                          setMandatory(true);
                                                      else
                                                          setMandatory(false);
                                                  }}
                                                  isInvalid={validMin === 'invalid'}>
                                        <option>0</option>
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                        <option>6</option>
                                        <option>7</option>
                                        <option>8</option>
                                        <option>9</option>
                                        <option>10</option>
                                    </Form.Control>
                                    <Form.Control.Feedback type='invalid'>
                                        Invalid MIN value
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} controlId="maximumAnswers">
                                    <Form.Label>Maximum answers</Form.Label>
                                    <Form.Control as="select"
                                                  value={max}
                                                  onChange={(event) => {
                                                      if (event.target.value <= numAnswers) {
                                                          setMax(parseInt(event.target.value));
                                                          setValidMax('valid');
                                                      } else {
                                                          setMax(parseInt(event.target.value));
                                                          setValidMax('invalid');
                                                      }
                                                  }}
                                                  isInvalid={validMax === 'invalid'}>
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                        <option>6</option>
                                        <option>7</option>
                                        <option>8</option>
                                        <option>9</option>
                                        <option>10</option>
                                    </Form.Control>
                                    <Form.Control.Feedback type='invalid'>
                                        Invalid MAX value
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            <Container className="justify-content-center align-items-center">
                                {answers.map((a, index) =>
                                    <InputGroup className="mb-2 mr-sm-2">
                                        <InputGroup.Prepend>
                                            <InputGroup.Text><Form.Check type="checkbox"/></InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl placeholder="Answer"
                                                     value={a}
                                                     onChange={(event) => {
                                                         setAnswers(oldList => oldList.map((a, index2) =>
                                                             index2 === index ? event.target.value : a
                                                         ));

                                                         if (event.target.value === '') {
                                                             setCheckedMCQ[index]('invalid');
                                                             setValidInputs(oldList => oldList.map((q, indexBis) => {
                                                                 if (props.index === indexBis)
                                                                     return false;
                                                                 else
                                                                     return q;
                                                             }));
                                                         } else {
                                                             setCheckedMCQ[index]('valid');
                                                             setValidInputs(oldList => oldList.map((q, indexBis) => {
                                                                 if (props.index === indexBis)
                                                                     return true;
                                                                 else
                                                                     return q;
                                                             }));
                                                         }
                                                     }}
                                                     isInvalid={checkedMCQ[index] === 'invalid'}/>
                                        <Form.Control.Feedback type='invalid'>
                                            The answer cannot be empty, please fill the field
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                )}
                            </Container>
                        </Form>
                        :
                        <>
                        </>
                    }
                    <br/>
                    {openClose === 'Open' ?
                        <Form.Check
                            type="switch"
                            id="mandatory-switch"
                            label="Mandatory"
                            onChange={(event) => {
                                if (event.target.checked)
                                    setMandatory(true);
                                else
                                    setMandatory(false);
                            }}
                            checked={mandatory}
                        />
                        :
                        <></>
                    }
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={props.handleClose}>
                    Cancel
                </Button>
                {allValidInputs ?
                    <Button variant="success" onClick={() => {
                        props.addQuestion({
                            surveyId: -1,  // This is a placeholder, the actual value will be set once the survey is created
                            type: openClose,
                            title: title,
                            answers: answers,
                            min: min,
                            max: max,
                            mandatory: mandatory
                        });
                        props.setValidSurvey(true);
                    }}>
                        Add Question
                    </Button>
                    :
                    <Button variant="success" disabled>
                        Add Question
                    </Button>}
            </Modal.Footer>
        </Modal>
    );
}

function QuestionsAdmin(props) {
    const [validSurvey, setValidSurvey] = useState(false);
    const [surveyTitle, setSurveyTitle] = useState('');
    const [validSurveyTitle, setValidSurveyTitle] = useState('init');

    // State and handler for the modal
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handlerAddQuestion = (question) => {
        question.position = props.questions.length;
        if (question.type === 'Open')
            question.type = 'open';
        else if (question.type === 'Closed')
            question.type = 'closed';
        props.setQuestions((oldList) => [...oldList, question]);
        setShow(false);
    }

    // Redirect
    const [redirect, setRedirect] = useState(false);
    // Create the new survey
    const handlerSubmitSurvey = () => {
        API.createSurvey(surveyTitle, props.questions, props.owner)
            .then(() => setRedirect(true))
            .catch(() => setRedirect(true));
    }

    if (redirect) {
        props.setQuestions([]);
        return (<Redirect to="/admin"/>);
    }

    return (
        <Container className="justify-content-center align-items-center">
            <SurveyTitleField surveyTitle={surveyTitle}
                              setSurveyTitle={setSurveyTitle}
                              validSurveyTitle={validSurveyTitle}
                              setValidSurveyTitle={setValidSurveyTitle}
                              setValid={setValidSurvey}/>
            <br/>
            {props.questions.map((question, index) =>
                <>
                    <QuestionAdmin key={question.id}
                                   question={question}
                                   questions={props.questions}
                                   setQuestions={props.setQuestions}
                    />
                    <br/>
                </>
            )}
            <br/>
            <Button variant="success" onClick={handleShow}>Add question</Button>{' '}
            {validSurvey ?
                <Button variant="dark" type="submit" onClick={handlerSubmitSurvey}>Create</Button>
                :
                <Button disabled variant="dark" type="submit">Create</Button>
            }
            <br/>
            <AddNewQuestionModal show={show}
                                 setShow={setShow}
                                 handleClose={handleClose}
                                 handleShow={handleShow}
                                 questions={props.questions}
                                 setQuestions={props.setQuestions}
                                 addQuestion={handlerAddQuestion}
                                 setValidSurvey={setValidSurvey}
            />
        </Container>
    );
}

function SurveyTitleField(props) {
    return (
        <Card bg="light">
            <Card.Body>
                <Card.Title>Survey Title</Card.Title>
            </Card.Body>
            <Container className="justify-content-center align-items-center">
                <Form.Group controlId="surveyTitle">
                    <Form.Control value={props.surveyTitle}
                                  onChange={(event) => {
                                      props.setSurveyTitle(event.target.value);

                                      if (event.target.value === '') {
                                          props.setValidSurveyTitle('invalid');
                                          props.setValid(false);
                                      } else {
                                          props.setValidSurveyTitle('valid');
                                          props.setValid(true);
                                      }
                                  }}
                                  isInvalid={props.setValidSurveyTitle === 'invalid'}
                                  type="text"
                                  placeholder="Enter here the title of the survey"/>
                    <Form.Control.Feedback type='invalid'>
                        Please insert the title of the survey
                    </Form.Control.Feedback>
                </Form.Group>
            </Container>
        </Card>
    );
}

function QuestionAdmin(props) {
    // Closed-answer question
    if (props.question.type === 'closed') {

        return (
            <Card bg="light">
                <Card.Header>
                    <Button variant="danger"
                            onClick={() => deleteQuestion(props.question.position, props.setQuestions, props.questions)}
                    >
                        Delete
                    </Button>
                </Card.Header>
                <Card.Body>
                    <Card.Title>
                        {props.question.title}
                        {props.question.mandatory ?
                            <>
                                {' '}<Badge variant="danger">Mandatory</Badge>
                            </>
                            :
                            <>
                            </>
                        }
                    </Card.Title>
                    <Card.Text>{props.question.question}</Card.Text>
                </Card.Body>
                <Container className="justify-content-center align-items-center">
                    <ListGroup>
                        {props.question.answers.map((answer, index) =>
                            <ListGroupItem key={index}>
                                <Row>
                                    <Col sm="1">
                                        {index + 1 + "."}
                                    </Col>
                                    <Col>
                                        {answer}
                                    </Col>
                                    <Col sm="1"/>
                                </Row>
                            </ListGroupItem>
                        )}
                    </ListGroup>
                    <br/>
                </Container>
                <Card.Footer className="text-muted" defaultActiveKey="#up">
                    {props.question.position === 0 ?
                        <>
                            <Button variant="dark"
                                    onClick={() => swapQuestions(
                                        props.question.position,
                                        "up",
                                        props.questions,
                                        props.setQuestions
                                    )}
                                    disabled
                            >
                                Up
                            </Button>{' '}
                        </>
                        :
                        <>
                            <Button variant="dark"
                                    onClick={() => swapQuestions(
                                        props.question.position,
                                        "up",
                                        props.questions,
                                        props.setQuestions
                                    )}
                            >
                                Up
                            </Button>{' '}
                        </>
                    }
                    {props.question.position === (props.questions.length - 1) ?
                        <Button variant="dark"
                                onClick={() => swapQuestions(
                                    props.question.position,
                                    "down",
                                    props.questions,
                                    props.setQuestions
                                )}
                                disabled
                        >
                            Down
                        </Button>
                        :
                        <Button variant="dark"
                                onClick={() => swapQuestions(
                                    props.question.position,
                                    "down",
                                    props.questions,
                                    props.setQuestions
                                )}
                        >
                            Down
                        </Button>
                    }
                </Card.Footer>
            </Card>
        );
    }


// Open-ended question
    if (props.question.type === 'open') {

        return (
            <Card
                //bg="light"
                bg={props.question.mandatory ? "danger" : "light"}
            >
                <Card.Header>
                    <Row>
                        <Col sm="2"/>
                        <Col>
                            {props.question.mandatory ?
                                <h5>
                                    <Badge variant="danger">Mandatory</Badge>
                                </h5>
                                :
                                <>
                                </>
                            }
                        </Col>
                        <Col sm="2">
                            <CloseButton onClick={() => deleteQuestion(props.question.position, props.setQuestions, props.questions)}/>
                        </Col>
                    </Row>
                </Card.Header>
                <Card.Body>
                    <Card.Title>
                        {props.question.title}
                    </Card.Title>
                </Card.Body>
                <Container className="justify-content-center align-items-center">
                    <Form.Group controlId="openAnswer">
                        <Form.Control value={"Open answer text field"}
                                      type="text"
                                      disabled
                        />
                    </Form.Group>
                </Container>
                <Card.Footer className="text-muted" defaultActiveKey="#up">
                    {props.question.position === 0 ?
                        <>
                            <Button variant="dark"
                                    onClick={() => swapQuestions(
                                        props.question.position,
                                        "up",
                                        props.questions,
                                        props.setQuestions
                                    )}
                                    disabled
                            >
                                Up
                            </Button>{' '}
                        </>
                        :
                        <>
                            <Button variant="dark"
                                    onClick={() => swapQuestions(
                                        props.question.position,
                                        "up",
                                        props.questions,
                                        props.setQuestions
                                    )}
                            >
                                Up
                            </Button>{' '}
                        </>
                    }
                    {props.question.position === (props.questions.length - 1) ?
                        <Button variant="dark"
                                onClick={() => swapQuestions(
                                    props.question.position,
                                    "down",
                                    props.questions,
                                    props.setQuestions
                                )}
                                disabled
                        >
                            Down
                        </Button>
                        :
                        <Button variant="dark"
                                onClick={() => swapQuestions(
                                    props.question.position,
                                    "down",
                                    props.questions,
                                    props.setQuestions
                                )}
                        >
                            Down
                        </Button>
                    }
                </Card.Footer>
            </Card>
        );
    }
}

function ViewAnswersOneSurvey(props) {
    // Answers by one user
    const [answers, setAnswers] = useState([]);

    // Loading
    const [loading, setLoading] = useState(true);

    // Current answer shown
    const [currentAnswer, setCurrentAnswer] = useState(0);
    const [currentAnswersArray, setCurrentAnswersArray] = useState([]);
    const [totalAnswers, setTotalAnswers] = useState(0);
    // All groups of answers present
    const [groupsId, setGroupsId] = useState([]);

    useEffect(() => {
        API.getAllAnswersBySurveyId(props.surveyId, props.loggedAdmin)
            .then(r => {
                setAnswers(r);
                let counter = 0;
                for (const id in r) {
                    setGroupsId(old => [...old, id]);
                    counter++;
                }
                setTotalAnswers(counter);
                setCurrentAnswer(0);
                setLoading(false);
            })
            .catch(r => {
                setAnswers([]);
            });
    }, []);

    useEffect(() => {
        if (loading)
            return;
        let tmpArray = Object.create(answers[groupsId[currentAnswer]]);
        tmpArray.sort((a, b) => {
            return a.position - b.position;
        });
        setCurrentAnswersArray(tmpArray);
    }, [currentAnswer, loading]);

    return (
        <Container className="justify-content-center align-items-center">
            {loading ?
                <Spinner animation="border" variant="primary" style={{"marginTop": "100px"}}/>
                :
                <>
                    <br/>
                    <Card bg="light">
                        <Card.Body>
                            <Card.Title>
                                User
                            </Card.Title>
                            <Card.Text>
                                {answers[groupsId[currentAnswer]][0].user}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    <br/>
                    {currentAnswersArray.map(question =>
                        <>
                            <ViewAnswersAdmin question={question}/>
                            <br/>
                        </>
                    )}
                </>}
            <br/>
            <ButtonGroup aria-label="Pagination">
                <Button variant="primary" onClick={() => setCurrentAnswer(0)}>First</Button>
                {
                    currentAnswer === 0 ?
                        <Button variant="primary" disabled>Previous</Button>
                        :
                        <Button variant="primary" onClick={() => {
                            if (currentAnswer > 0)
                                setCurrentAnswer(old => old - 1);
                        }}>Previous</Button>
                }
            </ButtonGroup>
            {' '}
            <Button variant="light" disabled>{currentAnswer + 1} out of {totalAnswers}</Button>
            {' '}
            <ButtonGroup aria-label="Pagination">
                {
                    currentAnswer === (totalAnswers - 1) ?
                        <Button variant="primary" disabled>Next</Button>
                        :
                        <Button variant="primary" onClick={() => {
                            if (currentAnswer < (totalAnswers - 1))
                                setCurrentAnswer(old => old + 1);
                        }}>Next</Button>
                }
                <Button variant="primary" onClick={() => setCurrentAnswer(() => totalAnswers - 1)}>Last</Button>
            </ButtonGroup>
        </Container>
    );
}

function ViewAnswersAdmin(props) {
    // Closed-answer question
    if (props.question.type === 'closed') {
        let answerIndex = JSON.parse(props.question.answer);
        let answers = JSON.parse(props.question.answers);
        return (
            <Card bg="light">
                <Card.Body>
                    <Card.Title>
                        {props.question.title}
                    </Card.Title>
                </Card.Body>
                <ListGroup className="list-group-flush">
                    {answers.map((answer, index) => {
                        let checked = false;
                        if (answerIndex.find(item => item === (index + 1)))
                            checked = true;
                        return (
                            <ListGroupItem key={index}>
                                <Form.Group controlId={"answer" + index}>
                                    <Form.Check disabled checked={checked} variant='success' label={answer}/>
                                </Form.Group>
                            </ListGroupItem>
                        );
                    })}
                </ListGroup>
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
                    </Card.Title>
                    <Card.Text>
                        {props.question.answer === '' ?
                            "Empty answer"
                            :
                            props.question.answer
                        }
                    </Card.Text>
                </Card.Body>
            </Card>
        );
    }
}

function AdminButtons(props) {
    // Hover information for card style
    const [mouseEnter1, setMouseEnter1] = useState(false);
    const [mouseEnter2, setMouseEnter2] = useState(false);

    return (
        <Container className="justify-content-center align-items-center">
            <Link to="/admin/newSurvey" style={{textDecoration: 'none'}}>
                <Card bg="white"
                      border={mouseEnter1 ? "primary" : "#e5e5e5"}
                      text="dark"
                      onMouseEnter={() => setMouseEnter1(true)}
                      onMouseLeave={() => setMouseEnter1(false)}>
                    <Card.Body>
                        <Card.Title>Create a new survey</Card.Title>
                    </Card.Body>
                </Card>
            </Link>
            <br/>
            <Link to="/admin/viewSurveys" style={{textDecoration: 'none'}}>
                <Card bg="white"
                      border={mouseEnter2 ? "primary" : "#e5e5e5"}
                      text="dark"
                      onMouseEnter={() => setMouseEnter2(true)}
                      onMouseLeave={() => setMouseEnter2(false)}>
                    <Card.Body>
                        <Card.Title>See result of your surveys</Card.Title>
                    </Card.Body>
                </Card>
            </Link>
        </Container>
    );
}

export
{
    SurveysAdmin, QuestionsAdmin, ViewAnswersOneSurvey, AdminButtons
}