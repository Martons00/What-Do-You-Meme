import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Collapse, Button, Row } from 'react-bootstrap';
import { useState } from 'react';
import './CSS/Homepage.css';

const texts = {
  title: "Game Rules - What do you meme?",
  objectiveTitle: "Game Objective",
  objectiveDescription: "The goal of the game is to guess the most suitable caption for a meme among seven proposed options. The game is played over several rounds, and a complete game consists of 3 rounds.",
  gameplayTitle: "Gameplay",
  roundInitial: "Initial Round:",
  roundInitialDescription: "In each round, you will receive a random meme image and seven possible captions in random order. Among these seven captions, two are the best fit for the meme image.",
  captionSelection: "Caption Selection:",
  captionSelectionDescription: "You must select the caption that best fits the meme within 30 seconds.",
  scoring: "Scoring:",
  scoringDescription1: "If you select one of the two most appropriate captions within 30 seconds, you earn 5 points.",
  scoringDescription2: "If you select one of the other captions or time runs out, you earn 0 points.",
  feedback: "End of Round Feedback:",
  feedbackDescription1: "If you earn 5 points, you will see a message indicating the end of the round.",
  feedbackDescription2: "If you earn 0 points, you will see a message informing you of the score and showing the two captions that were the best fit for that meme.",
  gameEndTitle: "End of Game",
  gameEndDescription1: "After 3 rounds, the game ends and your total game score is displayed.",
  gameEndDescription2: "You will see a summary that includes only the correctly matched memes and their selected captions.",
  historyTitle: "History and User Profile",
  historyDescription1: "All your games and rounds will be recorded and visible on your user profile page.",
  historyDescription2: "The history will show all meme images, the score obtained (0 or 5) per round, and the total game score.",
  historyDescription3: "Memes already shown will not be repeated in subsequent rounds of the same game.",
  closingMessage: "Have fun and try to guess the right captions to score the maximum points!",
  buttonText: "Start a New Game",
  buttonHistoryText: "Go to History",
  rulesText: "Rules",
};


export const HomePageLogged = () => {
  const navigate = useNavigate();

  const handlePlayButtonClick = () => {
    navigate('/game/round/1');
  };

  const [isOpen, setIsOpen] = useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <div style={{ textAlign: 'left' }} className="homepage">
      <h2>{texts.title}</h2>
      <section>
        <h3>{texts.objectiveTitle}</h3>
        <p>{texts.objectiveDescription}</p>
      </section>
      <section>
        <h3>{texts.rulesText}</h3>
        <Row>
          <button onClick={toggle} className="rule-button">
            <Row className="align-items-center">
              <i className={`bi ${isOpen ? 'bi-chevron-up' : 'bi-chevron-down'}`} style={{ width: "10%" }} />
              <strong className="ml-2 mb-0" style={{ width: "90%", textAlign: "left" }}>{isOpen ? 'Hide' : 'Show the Rules'}</strong>
            </Row>
          </button>
        </Row>
        <Collapse in={isOpen}>
          <div className='rules'>

            <h3>{texts.gameplayTitle}</h3>
            <ol>
              <li>
                <strong>{texts.roundInitial}</strong>
                <p>{texts.roundInitialDescription}</p>
              </li>
              <li>
                <strong>{texts.captionSelection}</strong>
                <p>{texts.captionSelectionDescription}</p>
              </li>
              <li>
                <strong>{texts.scoring}</strong>
                <p>{texts.scoringDescription1}</p>
                <p>{texts.scoringDescription2}</p>
              </li>
              <li>
                <strong>{texts.feedback}</strong>
                <p>{texts.feedbackDescription1}</p>
                <p>{texts.feedbackDescription2}</p>
              </li>
            </ol>
            <section>
              <h3>{texts.gameEndTitle}</h3>
              <p>{texts.gameEndDescription1}</p>
              <p>{texts.gameEndDescription2}</p>
            </section>
          </div>
        </Collapse>
      </section>
      <section>
        <p>{texts.closingMessage}</p>
        <Button className="rounded-button" onClick={handlePlayButtonClick}>
          {texts.buttonText}
        </Button>
      </section>
    </div>
  );
};





export const ProfileDescription = () => {
  const navigate = useNavigate();

  const handlePlayButtonClick = () => {
    navigate('/history');
  };

  return (
    <div style={{ textAlign: 'left' }} className="homepage">
      <section>
        <h3>{texts.historyTitle}</h3>
        <p>{texts.historyDescription1}</p>
        <p>{texts.historyDescription2}</p>
        <p>{texts.historyDescription3}</p>
      </section>
      <p>{texts.closingMessage}</p>
      <button className="rounded-button" onClick={handlePlayButtonClick}>{texts.buttonHistoryText}</button>
    </div>
  );
};



