import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Collapse, Row } from 'react-bootstrap';
import { useState } from 'react';
import './CSS/Homepage.css';

export function HomePageNotLogged(props) {
  const navigate = useNavigate();

  const title = 'Welcome to "What Do You Meme? - Single Player Edition"';
  const rulesTitle = 'Game Rules';
  const whatIsTitle = 'What is "What Do You Meme?"';
  const whatIsText = '"What Do You Meme?" is a fun board game where players must match the most suitable captions to random meme images. In this single-player version, you will test your sense of humor and matching skills.';
  const gameModesTitle = 'Game Modes';
  const anonymousPlayersText = 'Anonymous Players: As a visitor, you can only play single-round games.';
  const callToActionTitle = 'What Are You Waiting For?';
  const callToActionText = 'Join the game and find out how good you are at creating hilarious memes! You can start a game right away or register to access advanced features and track your progress. Have fun!';
  const registerLoginTitle = 'Register or Log In for Advanced Features';
  const registerLoginText = 'Play complete games and view your score history by registering now. If you are already registered, log in to continue playing and improving your score!';
  const roundInitialDescription = "In each round, you will receive a random meme image and seven possible captions in random order. Among these seven captions, two are the best fit for the meme image.";
  const captionSelection = "Caption Selection:";
  const captionSelectionDescription = "You must select the caption that best fits the meme within 30 seconds.";
  const scoring = "Scoring:";
  const scoringDescription1 = "If you select one of the two most appropriate captions within 30 seconds, you earn 5 points.";
  const scoringDescription2 = "If you select one of the other captions or time runs out, you earn 0 points.";
  const feedback = "End of Round Feedback:";
  const feedbackDescription1 = "If you earn 5 points, you will see a message indicating the end of the round.";
  const feedbackDescription2 = "If you earn 0 points, you will see a message informing you of the score and showing the two captions that were the best fit for that meme.";
  
  const handleButtonClick = () => {
    navigate('/gameNotLogged');
  };


  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className="homepage" style={{ textAlign: 'left' }}>
      <h1>{title}</h1>
      <section >
        <h2>{rulesTitle}</h2>
        <div className="rule">
          <h3>{whatIsTitle}</h3>
          <p>{whatIsText}</p>
        </div>
        <div className="rule">
          <Row>
            <button onClick={toggle} className="rule-button">
              <Row className="align-items-center">
                <i className={`bi ${isOpen ? 'bi-chevron-up' : 'bi-chevron-down'}`} style={{ width: "auto" }} />
                <strong className="ml-2 mb-0" style={{ width: "auto", textAlign: "left" }}>{isOpen ? 'Hide' : 'Show the Rules'}</strong>
              </Row>
            </button>
          </Row>
          <Collapse in={isOpen}>
            <div className='rules'>
              <h3>{gameModesTitle}</h3>
              <li>
                <strong>{anonymousPlayersText}</strong>
                <p>{roundInitialDescription}</p>
              </li>
              <li>
                <strong>{captionSelection}</strong>
                <p>{captionSelectionDescription}</p>
              </li>
              <li>
                <strong>{scoring}</strong>
                <p>{scoringDescription1}</p>
                <p>{scoringDescription2}</p>
              </li>
              <li>
                <strong>{feedback}</strong>
                <p>{feedbackDescription1}</p>
                <p>{feedbackDescription2}</p>
              </li>
            </div>
          </Collapse>
        </div>
      </section>
      <section className="cta ">
        <h3>{callToActionTitle}</h3>
        <p>{callToActionText}</p>
        <div className="d-flex justify-content-center">
          <button className="rounded-button " style={{ width: "60%" }} onClick={handleButtonClick}>Try</button>
        </div>
      </section>
      <section className="register-login">
        <h3>{registerLoginTitle}</h3>
        <p>{registerLoginText}</p>
      </section>
    </div>
  );
}
