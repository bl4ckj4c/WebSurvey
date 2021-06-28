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
    FormControl,
    Row,
    Spinner,
    ButtonGroup,
    Jumbotron,
    CloseButton
} from "react-bootstrap";
import {useEffect, useState} from "react";
import {Link, Redirect} from "react-router-dom";
import API from "./API";

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

async function deleteQuestion(pos, setQuestions, questions, setNumAnswers) {
    setQuestions(oldList => oldList.filter(q => q.position !== pos));
    setQuestions(oldList => oldList.map((q, index) => {
        let tmp = Object.create(q);
        tmp.position = index;
        return tmp;
    }));
    setNumAnswers(old => old - 1);
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
            .catch(() => {
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
                                        <>
                                            <Row>
                                                <Col sm="2">
                                                    <Button variant="danger"
                                                            onClick={() => setRedirect('back')}>Back</Button>
                                                </Col>
                                                <Col>
                                                    <h4>List of surveys created by you</h4>
                                                </Col>
                                                <Col sm="2"/>
                                            </Row>
                                            <br/>
                                            {surveysAdmin.map((survey, index) =>
                                                <SurveyAdminItem survey={survey} key={index}/>
                                            )}
                                        </>
                                )
                        )
                )

            }

        </Container>
    )
        ;
}

function SurveyAdminItem(props) {
    // Hover information for card style
    const [mouseEnter, setMouseEnter] = useState(false);

    return (
        <div key={props.survey.id}>
            {props.survey.numAnswer === 0 ?
                <Card bg="white"
                      border="#e5e5e5"
                      text="dark">
                    <Card.Body>
                        <Card.Title>
                            {props.survey.title}
                        </Card.Title>
                    </Card.Body>
                    <Card.Footer>
                        Number of answers: {props.survey.numAnswer}
                    </Card.Footer>
                </Card>
                :
                <Link to={"/admin/survey/" + props.survey.id}
                      style={{textDecoration: 'none'}}>
                    <Card bg="white"
                          border={mouseEnter ? "primary" : "#e5e5e5"}
                          text="dark"
                          onMouseEnter={() => setMouseEnter(true)}
                          onMouseLeave={() => setMouseEnter(false)}>
                        <Card.Body>
                            <Card.Title>
                                {props.survey.title}
                            </Card.Title>
                        </Card.Body>
                        <Card.Footer>
                            Number of answers: {props.survey.numAnswer}
                        </Card.Footer>
                    </Card>
                </Link>
            }
            <br/>
        </div>
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
    const [validMin, setValidMin] = useState('valid');
    const [max, setMax] = useState(1);
    const [validMax, setValidMax] = useState('valid');

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

    // Switch between open and close question
    useEffect(() => {
        setAllValidInputs(false);
        setTitle('');
        setValidTitle('init');
        setMandatory(false);
        setNumAnswers(1);
        setMin(0);
        setValidMin('valid');
        setMax(1);
        setValidMax('valid');
        setAnswers(['']);
    }, [openClose]);

    useEffect(() => {
        setAnswers([]);
        setAllValidInputs(false);
        setMin(0);
        setValidMin('valid');
        setMax(1);
        setValidMax('valid');
        for (let i = 0; i < numAnswers; i++)
            setAnswers(oldList => [...oldList, '']);
        for (let i = 0; i < 10; i++) {
            setCheckedMCQ[i]('init');
        }
        setValidInputs([false, false, false, false, false, false, false, false, false, false]);
    }, [numAnswers]);

    useEffect(() => {
        let check = true;
        if (validTitle === 'init' || validTitle === 'invalid')
            check = false;
        if (openClose === 'Closed') {
            check = (validMin === 'valid') && check;
            check = (validMax === 'valid') && check;
            for (let i = 0; i < answers.length; i++) {
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

    useEffect(() => {
        if (min > max || min > numAnswers || max > numAnswers) {
            setValidMin('invalid');
            setValidMax('invalid');
        } else if (min <= numAnswers && max <= numAnswers && min <= max) {
            setValidMin('valid');
            setValidMax('valid');
        }
    }, [min, max, numAnswers]);

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
                                    <InputGroup className="mb-2 mr-sm-2" key={index}>
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
                                                                 if (index === indexBis)
                                                                     return false;
                                                                 else
                                                                     return q;
                                                             }));
                                                         } else {
                                                             setCheckedMCQ[index]('valid');
                                                             setValidInputs(oldList => oldList.map((q, indexBis) => {
                                                                 if (index === indexBis)
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
                        props.setNumAnswers(old => old + 1);
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
    const [numAnswers, setNumAnswers] = useState(0);

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

    useEffect(() => {
        if (validSurveyTitle === 'valid' && numAnswers > 0)
            setValidSurvey(true);
        else
            setValidSurvey(false);
    }, [validSurveyTitle, numAnswers]);

    if (redirect) {
        props.setQuestions([]);
        return (<Redirect to="/admin"/>);
    }

    return (
        <Container className="justify-content-center align-items-center">
            <SurveyTitleField surveyTitle={surveyTitle}
                              setSurveyTitle={setSurveyTitle}
                              validSurveyTitle={validSurveyTitle}
                              setValidSurveyTitle={setValidSurveyTitle}/>
            <br/>

            {
                props.questions.map((question, index) =>
                    <div key={index}>
                        <QuestionAdmin question={question}
                                       questions={props.questions}
                                       setQuestions={props.setQuestions}
                                       setNumAnswers={setNumAnswers}
                        />
                        <br/>
                    </div>
                )
            }
            <br/>
            <Row>
                <Col sm="2"/>
                <Col sm="2">
                    <Button variant="danger" onClick={() => setRedirect(true)}>Back</Button>
                </Col>
                <Col>
                    <Button variant="dark" onClick={handleShow}>Add question</Button>
                </Col>
                <Col sm="2">
                    {validSurvey ?
                        <Button variant="success" type="button" onClick={handlerSubmitSurvey}>Create survey</Button>
                        :
                        <Button disabled variant="success" type="button">Create Survey</Button>
                    }
                </Col>
                <Col sm="2"/>
            </Row>
            <br/>
            <AddNewQuestionModal show={show}
                                 setShow={setShow}
                                 handleClose={handleClose}
                                 handleShow={handleShow}
                                 questions={props.questions}
                                 setQuestions={props.setQuestions}
                                 addQuestion={handlerAddQuestion}
                                 setNumAnswers={setNumAnswers}
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
                                      } else {
                                          props.setValidSurveyTitle('valid');
                                      }
                                  }}
                                  isInvalid={props.validSurveyTitle === 'invalid'}
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
                            <CloseButton
                                onClick={() => deleteQuestion(props.question.position, props.setQuestions, props.questions.props.setNumAnswers)}/>
                        </Col>
                    </Row>
                </Card.Header>
                <Card.Body>
                    <Card.Title>
                        {props.question.title}
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
            <Card bg="light">
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
                            <CloseButton
                                onClick={() => deleteQuestion(props.question.position, props.setQuestions, props.questions, props.setNumAnswers)}/>
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

    // Redirect to previous page
    const [redirect, setRedirect] = useState(false);

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
            .catch(() => {
                setTotalAnswers(0);
                setAnswers([]);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (loading || totalAnswers === 0)
            return;
        let tmpArray = Object.create(answers[groupsId[currentAnswer]]);
        tmpArray.sort((a, b) => {
            return a.position - b.position;
        });
        setCurrentAnswersArray(tmpArray);
    }, [currentAnswer, loading, totalAnswers]);

    if (redirect)
        return (<Redirect to="/admin/viewSurveys"/>);

    return (
        <Container className="justify-content-center align-items-center">
            {loading ?
                <Spinner animation="border" variant="primary" style={{"marginTop": "100px"}}/>
                :
                (
                    !totalAnswers ?
                        <Container className="justify-content-center align-items-center">
                            <Jumbotron style={{"marginTop": "100px"}}>
                                <h2 className="text-danger">No answers available for this survey 👻</h2>
                                <br/>
                                <p>
                                    Try again later.
                                </p>
                                <br/>
                                <Button variant="danger" onClick={() => setRedirect(true)}>Back</Button>
                            </Jumbotron>
                        </Container>
                        :
                        <>
                            <br/>
                            <Row>
                                <Col sm="2">
                                    <Button variant="danger" type="button"
                                            onClick={() => setRedirect(true)}>Back</Button>
                                </Col>
                                <Col>
                                    <h4>{answers[groupsId[currentAnswer]][0].user}</h4>
                                </Col>
                                <Col sm="2"/>
                            </Row>
                            <br/>
                            {currentAnswersArray.map((question, index) =>
                                <div key={index}>
                                    <ViewAnswersAdmin question={question}/>
                                    <br/>
                                </div>
                            )}
                        </>
                )
            }
            <br/>
            {totalAnswers !== 0 ?
                <>
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
                </>
                :
                <></>
            }
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
                <Container className="justify-content-center align-items-center">
                    <ListGroup className="list-group">
                        {answers.map((answer, index) => {
                            let checked = false;
                            if (answerIndex.find(item => item === (index + 1)))
                                checked = true;
                            return (
                                <ListGroupItem key={index} className={checked ? "bg-success" : "bg-white"}>
                                    <Row>
                                        <Col sm="1">
                                            {
                                                checked ?
                                                    <p className="text-white">{index + 1 + "."}</p>
                                                    :
                                                    <p className="text-dark">{index + 1 + "."}</p>
                                            }
                                        </Col>
                                        <Col>
                                            {
                                                checked ?
                                                    <p className="text-white">{answer}</p>
                                                    :
                                                    <p className="text-dark">{answer}</p>
                                            }
                                        </Col>
                                        <Col sm="1"/>
                                    </Row>
                                </ListGroupItem>
                            );
                        })}
                    </ListGroup>
                    <br/>
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
            <Row>
                <Col sm="2"/>
                <Col>
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
                </Col>
                <Col sm="2"/>
            </Row>
            <br/>
            <Row>
                <Col sm="2"/>
                <Col>
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
                </Col>
                <Col sm="2"/>
            </Row>

        </Container>
    );
}

export
{
    SurveysAdmin,
    QuestionsAdmin,
    ViewAnswersOneSurvey,
    AdminButtons
}