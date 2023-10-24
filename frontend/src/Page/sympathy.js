import React, { Component, useEffect, useState, useRef } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { Link } from 'react-router-dom'

import { useLocation } from 'react-router-dom';
import Home from './home.js';
import Badge from 'react-bootstrap/Badge';

function calculateAge(birthDate, otherDate) {
    if (birthDate && otherDate) {
        birthDate = new Date(
            birthDate.split("/").reverse().join("-")
        );
        otherDate = new Date(
            otherDate.split("/").reverse().join("-")
        );

        birthDate = new Date(birthDate);
        otherDate = new Date(otherDate);

        var years = (otherDate.getFullYear() - birthDate.getFullYear());

        if (
            otherDate.getMonth() < birthDate.getMonth() ||
            (otherDate.getMonth() === birthDate.getMonth() &&
                otherDate.getDate() < birthDate.getDate())
        ) {
            years--;
        }

        return years;
    }
    return 0;
}


const SympathyPage = ({ data, user, counterRef }) => {

    const calculateMatch = (currentProfile) => {
        counterRef.current = 0

        let next = 0
        let y = 0

        try {
            currentProfile.factors_array.replace("[", "").replace("]", "").split(', ').forEach((x) => {
                y = data.authenticated_user.parameter_array.replace("[", "").replace("]", "").split(',')[next]
                if (x === y) {
                    counterRef.current += 1;
                }
                next += 1
            });
        } catch { }
        return 100 / 16 * (counterRef.current)
    }

    const navigate = useNavigate();

    const dateObj = new Date();
    const month = dateObj.getUTCMonth() + 1;
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();

    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;

    const newdate = `${formattedDay}/${formattedMonth}/${year}`;

    const match = []

    const [activeMatch, setActiveMatch] = useState(false);
    const [activeMyLike, setActiveMyLike] = useState(false);
    const [activeOtherLike, setActiveOtherLike] = useState(false);

    const handleMatchTabChange = () => {
        setActiveMatch(true);
        setActiveMyLike(false);
        setActiveOtherLike(false);
    };

    const handleMyLikeTabChange = () => {
        setActiveMyLike(true);
        setActiveMatch(false);
        setActiveOtherLike(false);
    };
    const handleOtherLikeTabChange = () => {
        setActiveOtherLike(true);
        setActiveMatch(false);
        setActiveMyLike(false);
    };

    const [matchCount, setMatchCount] = useState(0);
    const [myLikeCount, setMyLikeCount] = useState(0);
    const [otherLikeCount, setOtherLikeCount] = useState(0);

    useEffect(() => {
        const newMatch = data.authenticated_user.match_user_list.map((item) => {
            const profile = data.profiles.find((profile) => profile.user === item);
            if (profile) {
                setMatchCount(prevMatchCount => prevMatchCount + 1);
            }
        });
        const newMyLike = data.authenticated_user_like_list.map((item) => {
            const profile = data.profiles.find((profile) => profile.user === item);
            if (profile && !match.includes(profile)) {
                setMyLikeCount(prevMyLikeCount => prevMyLikeCount + 1);
            }
        });
        const newOtherLike = data.profiles.map((item) => {
            const likesUser = item.likes_user_list && item.likes_user_list.includes(data.authenticated_user_id);
            if (likesUser && !match.includes(item)) {
                setOtherLikeCount(prevOtherLikeCount => prevOtherLikeCount + 1);
            }
        });
    }, []);

    return (
        <div className="align-items-center justify-content-center">
            <div className="d-flex vertical-center-2 flex-row justify-content-start navCustom">
                <Link to={'/card'}>
                    <Button className='arrow' variant='custom' >
                        <img className="mainSVG" src={"arrow-left.svg"} alt="options" />
                    </Button>
                </Link>
                <a className="p-3 navCustomTitle">Симпатии</a>
            </div>
            <div className='bodyCustom'>
                <div className='p-3 d-flex justify-content-between'>
                    <a href="#match" className={`symphaty-nav${activeMatch ? '-activate' : ''}`} onClick={handleMatchTabChange}><p className={`symphaty-nav-p${activeMatch ? '-activate' : ''}`}>Мэтчи</p><Badge bg="secondary badge-custom">{matchCount}</Badge></a>
                    <a href="#mylike" className={`symphaty-nav${activeMyLike ? '-activate' : ''}`} onClick={handleMyLikeTabChange}><p className={`symphaty-nav-p${activeMyLike ? '-activate' : ''}`}>Лайки</p><Badge bg="secondary badge-custom">{myLikeCount}</Badge></a>
                    <a href="#otherlike" className={`symphaty-nav${activeOtherLike ? '-activate' : ''}`} onClick={handleOtherLikeTabChange}><p className={`symphaty-nav-p${activeOtherLike ? '-activate' : ''}`}>Нравлюсь</p><Badge bg="secondary badge-custom">{otherLikeCount}</Badge></a>
                </div>
                <h4 id="match" className="CustomTitle">Мэтчи</h4>
                <div className='row'>
                    {data.authenticated_user.match_user_list.map(item => {
                        const profile = data.profiles.find(profile => profile.user === item)
                        match.push(profile)
                        const match_result = calculateMatch(profile)
                        if (profile) {
                            return (
                                <div key={item} className='col-6'>
                                    <Link to='/card2' state={{ currentProfile: profile, precent: match_result }}>
                                        <div>
                                            <div className='miniCardFrame'>
                                                <img src={profile.photo} alt="avatar" ></img>
                                                <div className="miniCardFrameBottom" />
                                                <h2 className='miniCardFrameH2'>{profile.name},
                                                    {calculateAge(profile.age, newdate)}</h2>
                                                <div className='miniCardTitleFrame'>
                                                    <h2 className='miniCardTitleFrameH2'>{match_result}%</h2>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
                <br />
                <h4 id="mylike" className="CustomTitle">Лайки</h4>
                <div className='row'>
                    {data.authenticated_user_like_list.map(item => {
                        const profile = data.profiles.find(profile => profile.user === item)
                        const match_result = calculateMatch(profile)
                        if (profile && !match.includes(profile)) {
                            return (
                                <div key={item} className='col-6'>
                                    <Link to='/card2' state={{ currentProfile: profile, precent: match_result }}>
                                        <div>
                                            <div className='miniCardFrame'>
                                                <img src={profile.photo} alt="avatar" ></img>
                                                <div className="miniCardFrameBottom" />
                                                <h2 className='miniCardFrameH2'>{profile.name},
                                                    {calculateAge(profile.age, newdate)}</h2>
                                                <div className='miniCardTitleFrame'>
                                                    <h2 className='miniCardTitleFrameH2'>{match_result}%</h2>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
                <br />
                <h4 id="otherlike" className="CustomTitle">Я нравлюсь</h4>
                <div className='row'>
                    {data.profiles.map(item => {
                        const likesUser = item.likes_user_list && item.likes_user_list.includes(data.authenticated_user_id);
                        if (likesUser && !match.includes(item)) {
                            const match_result = calculateMatch(item)
                            return (
                                <div key={item.id} className='col-6'>
                                    <Link to='/card2' state={{ currentProfile: item, precent: match_result }}>
                                        <div>
                                            <div className='miniCardFrame'>
                                                <img src={item.photo} alt="avatar" ></img>
                                                <div className="miniCardFrameBottom" />
                                                <h2 className='miniCardFrameH2'>{item.name}, {calculateAge(item.age, newdate)}</h2>
                                                <div className='miniCardTitleFrame'>
                                                    <h2 className='miniCardTitleFrameH2'>{match_result}%</h2>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            );
                        }
                        return null;
                    })}
                </div>
            </div>
        </div>
    );
};

function DataComponent(props) {
    const [data, setData] = useState({ profiles: [], authenticated_user_photo: null, authenticated_user_likes_count: null, authenticated_user_like_list: [], authenticated_user_id: null, authenticated_user: null });

    if (!localStorage.hasOwnProperty('authTokens')) {
        window.open("/login", "_self");
    } else {
        const authTokens = JSON.parse(localStorage.getItem('authTokens'));
        axios.defaults.headers.common['Authorization'] = `Bearer ${authTokens.access}`;
    }

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/user/search/`)
            .then(response => {
                setData({
                    profiles: response.data.profiles,
                    authenticated_user_photo: response.data.authenticated_user_photo,
                    authenticated_user_likes_count: response.data.authenticated_user_likes_count,
                    authenticated_user_like_list: response.data.authenticated_user_like_list,
                    authenticated_user_id: response.data.authenticated_user_id,
                    authenticated_user: response.data.authenticated_user,
                });
                setIsLoading(false);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    const location = useLocation();

    const user = location.state

    const counterRef = useRef(0);

    return (
        <>
            {isLoading ? (
                <Home />
            ) : (
                <SympathyPage data={data} user={user} counterRef={counterRef} />
            )}
        </>
    );
};

export default DataComponent;
