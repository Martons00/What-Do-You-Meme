import { React } from "react";
import { Col, Row } from "react-bootstrap";
import TimerBar from "./TimerBar";
import { useEffect, useState, } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import MemeCaptionAPI from "../API/memeCaptionsAPI.mjs";
import gameAPI from "../API/gameAPI.mjs";
import RoundAPI from "../API/roundAPI.mjs";
import MemeAPI from "../API/memeAPI.mjs";
import CaptionAPI from "../API/captionAPI.mjs";
import { RoundRecap, NavButton } from "./HistoryLayout.jsx";
import { RoundedButtonCaption, RoundedCaption, shuffleArray, prendiMemeCasuale, getRandomElements } from "./RoundNotLoggedLayout.jsx";
import "./CSS/RoundedButton.css";
import "./CSS/RoundLayout.css";
import Round from "../models/Round.mjs";

export function GameLayout(props) {
  const param = useParams();
  const round = param.numberRound;
  const user = props.user;
  const setFeedback = props.setFeedback;
  const [currentRound, setCurrentRound] = useState(param.numberRound);
  const [rounds, setRounds] = useState([]);
  const [isFinish, setIsFinish] = useState(false);
  const start_time = new Date().toISOString();
  const [total_score, setTotalScore] = useState(0);
  const [gameID, setGameID] = useState(null);
  const [game, setGame] = useState(null);
  const [meme, setMeme] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentRound === 4) {
      gameAPI.createGame(props.user?.username, start_time, new Date().toISOString(), total_score)
        .then(gameId => {
          setGameID(gameId);
          rounds.forEach(round => {
            RoundAPI.createRound(gameId, round.memeId, user.username, round.selectedCaptionId, round.isCorrect, round.score)
              .catch(err => {
                setFeedback(err.message);
                navigate("/");
              });
          });
        })
        .catch(err => {
          setFeedback(err.message);
          navigate("/");
        });

    }
  }, [currentRound]);

  useEffect(() => {
    if (gameID) {
      gameAPI.getGameById(gameID)
        .then(game => {
          setGame(game);
        })
        .catch(err => {
          setFeedback(err.message);
          navigate("/");
        });
    }
  }, [gameID]);

  function handleNextRound() {
    if (isFinish && round < 3) {
      const nextRound = Number(round) + 1;
      navigate("/game/round/" + nextRound);
    } else if (isFinish && round == 3) {
      setCurrentRound(4);
    }
  }

  return (
    <div style={{ textAlign: 'left', justifyContent: "center" }}>
      <h1 style={{ textAlign: 'center', justifyContent: "center" }}>Game</h1>
      <Row style={{ textAlign: 'left', justifyContent: "center" }}>
        {currentRound < 4 && <button onClick={handleNextRound} className="rounded-button" style={{ width: "50%", backgroundColor: isFinish ? "" : "gray" }}>Next</button>}
      </Row>
      {currentRound < 4 && <RoundLayout key={round} total_score={total_score} setFeedback = {setFeedback} setTotalScore={setTotalScore} setIsFinish={setIsFinish} meme={meme} captions={props.captions} rounds={rounds} setRounds={setRounds} />}
      <Row style={{ textAlign: 'left', justifyContent: "center" }}>
      </Row>
      {currentRound === 4 && game != null && <MyGameRecap game={game} setFeedback={setFeedback} />}
    </div>
  );
};



export function RoundLayout(props) {
  const rounds = props.rounds;
  const setRounds = props.setRounds;
  const setIsFinish = props.setIsFinish;
  const total_score = props.total_score;
  const setTotalScore = props.setTotalScore;
  const [meme, setMeme] = useState(null);
  const [captions, setCaptions] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [filled, setFilled] = useState(0);
  const [correctCaptions, setCorrectCaptions] = useState([]);
  const [selectedCaption, setSelectedCaption] = useState();
  const [isCorrect, setIsCorrect] = useState(false);
  const setFeedback = props.setFeedback;
  const navigate = useNavigate();



  useEffect(() => {
    if (!meme) {
      let memeID1 = null;
      let memeID2 = null;
      if (rounds.length > 0) {
        memeID1 = rounds[0].memeId;
      }
      if (rounds.length > 1) {
        memeID2 = rounds[1].memeId;
      }
      MemeAPI.getRandomMeme(memeID1, memeID2)
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
    setIsFinish(false);
    setIsRunning(true);
  }, []);

  useEffect(() => {
    if (filled === 300) {
      const score = isCorrect ? 5 : 0;
      setTotalScore(total_score + score);
      const selectCap = selectedCaption != null ? selectedCaption.id : null;
      const round = new Round(0, 0, meme.id, "Placeholder", selectCap, isCorrect, score);
      if (rounds.length === 0) {
        setRounds([round]);
      } else {
        setRounds([...rounds, round]);
      }
      setIsFinish(true);
    }
  }, [filled]);

  useEffect(() => {
    if (selectedCaption) {
      setIsCorrect(correctCaptions[0].text == selectedCaption.text || correctCaptions[1].text == selectedCaption.text);
    } else {
      setIsCorrect(false);
    }
  }, [selectedCaption]);

  if (!meme) {
    return <Row><div>Meme not ready</div></Row>;
  }
  return (
    <>
      <Row className="align-items-center justify-content-center">
        <Row className={!isRunning && filled === 300 ? "rounded-button" : ""} style={{ textAlign: "center", width: "50%", backgroundColor: (isCorrect ? "green" : "red") }}>{!isRunning && filled === 300 ? (isCorrect ? <h3>Correct</h3> : <h3>Wrong</h3>) : ""}</Row>
        <TimerBar
          durationInSeconds={30}
          filled={filled}
          setFilled={setFilled}
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          style={{ width: '100%', padding: 10 }}
        />
      </Row>
      <Row style={{ margin: "10px" }}>
        <Col xs={12} md={6} className="d-flex flex-column align-items-center">
          <div className="image-box">
            <img src={`../../assets/${meme.imageUrl}`} className="image" alt="Meme image" style={{ width: '100%', height: '500px', objectFit: 'contain', borderRadius: "15px" }} />
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

function MyGameRecap(props) {
  const game = props.game;
  const [rounds, setRounds] = useState([]);
  const navigate = useNavigate();
  const setFeedback = props.setFeedback;

  useEffect(() => {
    RoundAPI.getRoundsByGameID(game.id)
      .then(rounds => {
        setRounds(rounds);
      })
      .catch(err => {
        setFeedback(err.message);
        navigate("/");
      });
  }, []);


  return (
    <>
      <Row style={{ margin: 10 }}>
        <Col md={2} className="d-flex justify-content-center">
          <NavButton destination="/" buttonText="< Homepage" />
        </Col>
        <Col md={10} className="d-flex justify-content-center"></Col>
      </Row>
      <div style={{ textAlign: 'left', width: "100%" }} className="homepage">
        <Row><h1>Game {game.id}</h1></Row>
        <Row className="equal-height">
          {rounds.map((round, index) => (
            (round.isCorrect ? <Col md={4} className="d-flex"><RoundRecap key={index} setFeedback={setFeedback} round={round} /></Col> : "")
          ))}
        </Row>
        <Row><h1>Score: {game.total_score}</h1></Row>
      </div>
    </>
  );

};