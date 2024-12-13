import { React } from "react";
import { Col, Row, Modal, Container } from "react-bootstrap";
import TimerBar from "./TimerBar";
import { useEffect, useState, } from "react";
import { useNavigate } from 'react-router-dom';
import MemeCaptionAPI from "../API/memeCaptionsAPI.mjs";
import MemeAPI from "../API/memeAPI.mjs";
import CaptionAPI from "../API/captionAPI.mjs";
import "./CSS/RoundedButton.css";
import "./CSS/RoundLayout.css";

export function RoundNotLoggedLayout(props) {
  const [isRunning, setIsRunning] = useState(false);
  const [filled, setFilled] = useState(0);
  const [captions, setCaptions] = useState([]);
  const [correctCaptions, setCorrectCaptions] = useState([]);
  const [selectedCaption, setSelectedCaption] = useState();
  const [isCorrect, setIsCorrect] = useState(false);
  const navigate = useNavigate();
  const [meme, setMeme] = useState(null);
  const setFeedback = props.setFeedback;

  useEffect(() => {
    if (!meme) {
      MemeAPI.getRandomMeme()
        .then(meme => {
          setMeme(meme);
          MemeCaptionAPI.getCaptionsByMemeId(meme.id)
            .then(captionsArray => { setCorrectCaptions(captionsArray) })
            .catch(err => {
              setFeedback(err.message);
              navigate("/");
            });
          CaptionAPI.getCaptionForMemeId(meme.id)
            .then(captionsArray => setCaptions(shuffleArray(captionsArray)))
            .catch(err => {
              setFeedback(err.message);
              navigate("/");
            });
        }
        )
        .catch(err => {
          setFeedback(err.message);
          navigate("/");
        });
    }
    setIsRunning(true);
  }, []);


  useEffect(() => {
    if (selectedCaption) {
      setIsCorrect(correctCaptions[0].text == selectedCaption.text || correctCaptions[1].text == selectedCaption.text);
    } else {
      setIsCorrect(false);
    }
  }, [selectedCaption]);


  if (!meme) {
    return <div>Loading...</div>;
  } else
    return (
      <>
        <Row className="align-items-center justify-content-center">
          <TimerBar
            durationInSeconds={30}
            filled={filled}
            setFilled={setFilled}
            isRunning={isRunning}
            setIsRunning={setIsRunning}
            style={{ width: '100%', padding: 10 }}
          />
        </Row>
        <ResultModal isRunning={isRunning} filled={filled} isCorrect={isCorrect} />
        <Row style={{ margin: "10px" }}>
          <Col xs={12} md={6} className="d-flex flex-column align-items-center">
            <div className="image-box">
              <img src={`../assets/${meme.imageUrl}`} className="image" alt="Meme image" style={{ width: '100%', height: '500px', objectFit: 'contain', borderRadius: "15px" }} />
            </div>
          </Col>
          <Col xs={12} md={6} className="d-flex flex-column align-items-center">
            <h2 className="display-3 w-100 align-items-center justify-content-center">{meme.title}</h2>
            {!isRunning && filled === 300 ? (
              captions.map((caption, index) => (
                <RoundedCaption
                  key={index}
                  caption={caption}
                  isCorrect={correctCaptions[0].text == caption.text || correctCaptions[1].text == caption.text}
                  selectedCaption={selectedCaption}
                />
              ))
            ) : (
              captions.map((caption, index) => (
                <RoundedButtonCaption
                  key={index}
                  caption={caption}
                  selectedCaption={selectedCaption}
                  setSelectedCaption={setSelectedCaption}
                  isRunning={isRunning}
                />
              )))}
          </Col>
        </Row>
      </>
    );
}


export function RoundedButtonCaption(props) {
  const [isSelected, setIsSelected] = useState(false);
  const caption = props.caption;
  const isRunning = props.isRunning;
  const selectedCaption = props.selectedCaption;
  const setSelectedCaption = props.setSelectedCaption;

  useEffect(() => {
    if (isRunning) {
      if (selectedCaption == caption) {
        setIsSelected(true);
      } else {
        setIsSelected(false);
      }
    }
  }, [selectedCaption]);


  const handleClick = () => {
    if (selectedCaption != caption || selectedCaption == null) {
      setSelectedCaption(caption);
      setIsSelected(true);
    } else {
      setSelectedCaption(null);
      setIsSelected(false);
    }
  };

  return (
    <Container md={12} className="align-items-center justify-content-center">
      <button className={`rounded-button ${isSelected ? 'selected' : ''}`} onClick={handleClick}>
        {caption.text}
      </button>
    </Container>
  );
}

export function RoundedCaption(props) {
  const caption = props.caption;
  const isCorrect = props.isCorrect;
  const selectedCaption = props.selectedCaption;
  const [isSelected, setIsSelected] = useState(selectedCaption == caption);
  return (
    <Container md={12} className="align-items-center justify-content-center">
      <button
        className={`rounded-button  ${isCorrect ? 'correct' : ''} ${isSelected ? (isCorrect ? '' : 'wrong') : ''}`}>
        {caption.text}
      </button>
    </Container>
  );
}


function ResultModal(props) {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!props.isRunning && props.filled === 300) {
      setShowModal(true);
    }
  }, [props.isRunning, props.filled]);

  const handleClose = () => {
    setShowModal(false);
    navigate("/");
  };

  return (
    <Modal show={showModal} onHide={handleClose} centered>
      <Modal.Body className={props.isCorrect ? 'result-box-correct' : 'result-box-wrong'}>
        <Col xs={12} className="d-flex flex-column align-items-center">
          <div className={props.isCorrect ? 'result-box-correct' : 'result-box-wrong'}>
            <Row className="align-items-center justify-content-center">
              <h1 className="display-3 w-100 align-items-center justify-content-center">
                {props.isCorrect ? 'You are correct!' : 'You are wrong!'}
              </h1>
            </Row>
            <Row className="align-items-center justify-content-center">
              <button className="rounded-button" style={{ width: "50%" }} onClick={() => { navigate("/") }}>Come back to Homepage</button>
            </Row>
          </div>
        </Col>
      </Modal.Body>
    </Modal>
  );
};




export function shuffleArray(array) {
  let shuffledArray = array.slice(); // Crea una copia dell'array originale
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}

export function prendiMemeCasuale(memes) {
  if (memes.length > 0) {
    const index = Math.floor(Math.random() * memes.length);
    return memes[index];
  } else {
    return null;
  }
}

export function getRandomElements(array, numElements) {
  const result = [];
  const indices = new Set();

  while (indices.size < numElements) {
    const randomIndex = Math.floor(Math.random() * array.length);
    indices.add(randomIndex);
  }

  indices.forEach(index => result.push(array[index]));
  return result;
}
