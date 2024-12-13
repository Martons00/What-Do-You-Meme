import { useEffect, useState } from 'react';
import { Container, Toast, ToastBody } from 'react-bootstrap/';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css'
import Header from './components/Header.jsx'
import UserAPI from './API/userAPI.mjs'
import { LoginForm, RegisterForm } from './components/Auth.jsx'
import FeedbackContext from "./contexts/FeedbackContext.js";
import { RoundNotLoggedLayout } from './components/RoundNotLoggedLayout.jsx';
import { MenuLayout } from './components/MenuLayout.jsx';
import { HomePageNotLogged } from './components/HomepageNotLogged.jsx';
import { HistoryLayout, GameRecapDetail } from './components/HistoryLayout.jsx';
import { GameLayout } from './components/GameLayout.jsx';
import NotFound from './components/NotFound.jsx';

function App() {
    const [feedback, setFeedback] = useState('');
    const footerText = "What Do You Meme? - Single Player Edition Raffaele Martone, 2024";

    const setFeedbackFromError = (err) => {
        let message = '';
        if (err.message) message = err.message;
        else message = "Unknown Error";
        setFeedback(message);
    };

    const [user, setUser] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        UserAPI.getUserInfo()
            .then(user => {
                setLoggedIn(true);
                setUser(user);
            }).catch(e => {
                if (loggedIn)
                    setFeedbackFromError(e);
                setLoggedIn(false); setUser(null);
            });
    }, []);

    const handleRegister = async (credentials) => {
        const user = await UserAPI.register(credentials);
        handleLogin(credentials);
    };

    const handleLogin = async (credentials) => {
        const user = await UserAPI.logIn(credentials);
        console.log(user);
        setUser(user); setLoggedIn(true);
        setFeedback("Welcome, " + user.username);
    };

    const handleLogout = async () => {
        await UserAPI.logOut();
        setLoggedIn(false); setUser(null);
    };


    return (
        <FeedbackContext.Provider value={{ setFeedback, setFeedbackFromError }}>
            <div className="min-vh-100 d-flex flex-column">
                <Header logout={handleLogout} user={user} loggedIn={loggedIn} />
                <Container fluid className="flex-grow-1 d-flex flex-column container-app">
                    <Routes>
                        <Route
                            path="/" element={
                                loggedIn ?
                                    <MenuLayout
                                        user={user}
                                        loggedIn={loggedIn} />
                                    : <HomePageNotLogged />
                            }>
                        </Route>
                        <Route path="/gameNotLogged" element={
                            <RoundNotLoggedLayout setFeedback={setFeedback} />
                        } />
                        <Route path="/login" element={
                            loggedIn ? <Navigate replace to='/' />
                                : <LoginForm login={handleLogin} />
                        } />
                        <Route path="/register" element={
                            <RegisterForm register={handleRegister} />
                        } />
                        <Route path="/history" element={
                            loggedIn ?
                                <HistoryLayout
                                    user={user} setFeedback={setFeedback} /> :
                                <Navigate replace to='/' />
                        } />
                        <Route path="/game/round/:numberRound" element={
                            loggedIn ?
                                <GameLayout
                                    user={user}
                                    setFeedback={setFeedback}
                                /> :
                                <Navigate replace to='/' />
                        } />
                        <Route path="/history/game/:game_id" element={
                            loggedIn ?
                                <GameRecapDetail
                                    setFeedback={setFeedback}
                                /> :
                                <Navigate replace to='/' />
                        } />
                        <Route path="/*" element={<NotFound />}> </Route>
                    </Routes>
                    <Toast
                        show={feedback !== ''}
                        autohide
                        onClose={() => setFeedback('')}
                        delay={4000}
                        position="top"
                        className="position-fixed end-0 m-3"
                    >
                        <ToastBody>
                            {feedback}
                        </ToastBody>
                    </Toast>
                </Container>
                <footer className="footer text-center">{footerText}</footer>
            </div>
        </FeedbackContext.Provider>
    );
}

export default App;