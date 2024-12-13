import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Row, Col, Button, Container } from 'react-bootstrap';
import GameAPI from '../API/gameAPI.mjs';
import RoundAPI from '../API/roundAPI.mjs';
import MemeAPI from '../API/memeAPI.mjs';
import CaptionAPI from '../API/captionAPI.mjs';

export function HistoryLayout(props) {
  const [games, setGames] = useState([]);
  const navigate = useNavigate();
  const setFeedback = props.setFeedback;

  useEffect(() => {
    GameAPI.getGamesByUserId(props.user?.username)
      .then(games => {
        setGames(games);
      })
      .catch(err => {
        setFeedback(err.message);
        navigate("/");
      });
  }, [props.user?.username]);

  return (
    <>
      <Row style={{ margin: 10 }}>
        <Col md={2} className="d-flex justify-content-center">
          <NavButton destination="/" buttonText="< Homepage" />
        </Col>
        <Col md={10} className="d-flex justify-content-center"></Col>
      </Row>
      <div style={{ textAlign: 'left', width: "100%" }} className="homepage">
        <Row>
          <h1>History</h1>
        </Row>
        <Row>
          {games.map((game, index) => (
            <Col key={index} xs={12} md={6}>
              <GameRecap game={game} />
            </Col>
          ))}
          {games.length === 0 && <p>No Games Found</p>}
        </Row>
      </div>
    </>
  );
};


export function GameRecap(props) {
  const { game } = props;
  const buttonText = "See details"; // Testo del bottone
  const navigate = useNavigate();
  const location = useLocation();
  // Dipendenza vuota perché non ci sono dipendenze specifiche in questo caso

  const handlePlayButtonClick = () => {
    navigate(location.pathname + "/game/" + game.id);
  };

  return (
    <div className='game' style={{ margin: 10 }}>
      <Row>
        <Col style={{ margin: 10 }}>
          <p>Game ID: {game.id}</p>
          <p>Game's Day: {game.end_time}</p>
          <p>Total score: {game.total_score}</p>
          <button className="rounded-button" style={{ margin: 0 }} onClick={handlePlayButtonClick}>
            {buttonText}
          </button>
        </Col>
      </Row>
    </div>
  );
};

export function GameRecapDetail(props) {
  const param = useParams();
  const gameId = param.game_id;
  const [game, setGame] = useState(null);
  const [rounds, setRounds] = useState([]);
  const navigate = useNavigate();
  const setFeedback = props.setFeedback;

  useEffect(() => {
    GameAPI.getGameById(gameId)
      .then(game => {
        setGame(game);
      })
      .catch(err => {
        setFeedback(err.message);
        navigate("/");
      });
    RoundAPI.getRoundsByGameID(gameId)
      .then(rounds => {
        setRounds(rounds);
      }).catch(err => {
        setFeedback(err.message);
        navigate("/");
      });
  }, []);

  return (
    <>
      <Row style={{ margin: 10 }}>
        <Col md={2} xs ={12} className="d-flex justify-content-center">
          <NavButton destination="/history" buttonText="< History" />
        </Col>
        <Col md={10} xs ={12} className="d-flex justify-content-center"></Col>
      </Row>
      <div style={{ textAlign: 'left', width: "100%" }} className="homepage">
        <Row><h1>Game: {gameId}</h1></Row>
        <Row className="equal-height">
          {rounds.map((round, index) => (
            <Col md={4} xs ={12} className="d-flex"><RoundRecap key={index} setFeedback={setFeedback} round={round} /></Col>
          ))}
        </Row>
        <Row><h1 style={{textAlign : "center"}}>Score: {game?.total_score}</h1></Row>
      </div>
    </>
  );
};

export function RoundRecap(props) {
  const [meme, setMeme] = useState([]);
  const [caption, setCaption] = useState();
  const round = props.round;
  const gameId = props.gameId;
  const setFeedback = props.setFeedback;
  const navigate = useNavigate();


  useEffect(() => {
    if (round) {

      CaptionAPI.getCaptionById(round.selectedCaptionId)
        .then(caption => {
          setCaption(caption);
        })
        .catch(err => {
          setFeedback(err.message);
          navigate("/");
        });
      MemeAPI.getMemeByID(round.memeId)
        .then(meme => {
          setMeme(meme);
        })
        .catch(err => {
          setFeedback(err.message);
          navigate("/");
        });
    }
  }, []);


  return (
    <>
      <Container className={round.isCorrect ? 'result-box-correct d-flex align-items-center justify-content-center' : 'result-box-wrong d-flex align-items-center justify-content-center'}>
        <Col xs={8} md={8}>
          <h2>Round {round.id}</h2>
          <p>Score: {round.score}</p>
          <p>Caption: {caption?.text}</p>
        </Col>
        <Col xs={4} md={4} className="image-box d-flex align-items-center justify-content-center">
          <img src={`../../assets/${meme?.imageUrl}`} alt="MemeImage" className='image' />
        </Col>
      </Container>
    </>
  );
}

export function NavButton(props) {
  const navigate = useNavigate();
  const destination = props.destination;
  const buttonText = props.buttonText;
  return (
    <Button variant="outline-light" onClick={() => navigate(destination)}>{buttonText}</Button>
  )
}