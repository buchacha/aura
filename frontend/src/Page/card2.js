import React, { Component, useEffect, useState, useRef } from 'react';
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import Home from './home.js';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { easeQuadInOut } from 'd3-ease';
import AnimatedProgressProvider from "./AnimatedProgressProvider";
import 'react-circular-progressbar/dist/styles.css';
import GradientSVG from '../Component/GradientSVG';
import "../Component/common.css"

import { Link, useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom';
import * as amplitude from "@amplitude/analytics-browser";


function GetSign(birthDate) {
    birthDate = new Date(birthDate.split("/").reverse().join("-"));
    var sign = "";
    const month = birthDate.getUTCMonth() + 1;
    const day = birthDate.getUTCDate();

    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;

    if (
        (formattedMonth == '03' && formattedDay >= 21) ||
        (formattedMonth === '04' && formattedDay <= 19)
    ) {
        sign = 'Овен';
    } else if (
        (formattedMonth === '04' && formattedDay >= 20) ||
        (formattedMonth === '05' && formattedDay <= 20)
    ) {
        sign = 'Телец';
    } else if (
        (formattedMonth === '05' && formattedDay >= 21) ||
        (formattedMonth === '06' && formattedDay <= 21)
    ) {
        sign = 'Близнецы';
    } else if (
        (formattedMonth === '06' && formattedDay >= 22) ||
        (formattedMonth === '07' && formattedDay <= 22)
    ) {
        sign = 'Рак';
    } else if (
        (formattedMonth === '07' && formattedDay >= 23) ||
        (formattedMonth === '08' && formattedDay <= 22)
    ) {
        sign = 'Лев';
    } else if (
        (formattedMonth === '08' && formattedDay >= 23) ||
        (formattedMonth === '09' && formattedDay <= 22)
    ) {
        sign = 'Дева';
    } else if (
        (formattedMonth === '09' && formattedDay >= 23) ||
        (formattedMonth === '10' && formattedDay <= 22)
    ) {
        sign = 'Весы';
    } else if (
        (formattedMonth === '10' && formattedDay >= 23) ||
        (formattedMonth === '11' && formattedDay <= 21)
    ) {
        sign = 'Скорпион';
    } else if (
        (formattedMonth === '11' && formattedDay >= 22) ||
        (formattedMonth === '12' && formattedDay <= 21)
    ) {
        sign = 'Стрелец';
    } else if (
        (formattedMonth === '12' && formattedDay >= 22) ||
        (formattedMonth === '01' && formattedDay <= 19)
    ) {
        sign = 'Козерог';
    } else if (
        (formattedMonth === '01' && formattedDay >= 20) ||
        (formattedMonth === '02' && formattedDay <= 18)
    ) {
        sign = 'Водолей';
    } else if (
        (formattedMonth === '02' && formattedDay >= 19) ||
        (formattedMonth === '03' && formattedDay <= 20)
    ) {
        sign = 'Рыбы';
    }

    return sign;
}


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

const Form_post = ({ data }) => {
    const idCSS = "custom-gradient";

    const dateObj = new Date();
    const month = dateObj.getUTCMonth() + 1;
    const day = dateObj.getUTCDate();
    const year = dateObj.getUTCFullYear();

    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDay = day < 10 ? `0${day}` : day;

    const newdate = `${formattedDay}/${formattedMonth}/${year}`;

    const interests = [
        { name: 'Природа', value: 'Природа', photo: 'flower_icon2.svg' },
        { name: 'Спорт', value: 'Спорт', photo: 'basketball_icon2.svg' },
        { name: 'Путешествие', value: 'Путешествие', photo: 'travel_icon2.svg' },
        { name: 'Книги', value: 'Книги', photo: 'book_icon2.svg' },
        { name: 'Питомцы', value: 'Питомцы', photo: 'cat_icon2.svg' },
        { name: 'Готовка', value: 'Готовка', photo: 'pizza_icon2.svg' },
    ];

    const socials = [
        { name: 'social_media_vk', value: 'ВКонтакте', icon: 'vk_icon.svg' },
        { name: 'social_media_tg', value: 'Телеграм', icon: 'telegram_icon.svg' },
        { name: 'social_media_wa', value: 'WhatsApp', icon: 'whatsapp_icon.svg' },
        { name: 'social_media_ok', value: 'Одноклассники', icon: 'classmates_icon.svg' },
        { name: 'social_media_ig', value: 'Instagram', icon: 'instagram_icon.svg' },
    ];

    const [isClicked, setIsClicked] = useState(false);
    const [visible, setVisible] = useState(true);

    const handleButtonClick = () => {
        setIsClicked(true);
        setVisible((prev) => !prev);
    }

    const [validated, setValidated] = useState(false);

    const location = useLocation();

    const navigate = useNavigate();

    React.useEffect(() => {
        if (
            !location.state ||
            !location.state.currentProfile
        ) {
            navigate('/card');
        }
        amplitude.track('Detail Opened')
    }, []);

    const item = location.state.currentProfile

    const item2 = location.state.precent

    const [isClickedAudio, setIsClickedAudio] = useState(false);
    const [visibleAudio, setVisibleAudio] = useState(true);

    const [isMatch, setIsMatch] = useState(false);
    const [matchUser, setmatchUser] = useState();

    const handleButtonClickPlay = () => {
        setIsClickedAudio(true);
        setVisibleAudio((prev) => !prev);
        start();
        amplitude.track({
              event_type: "Detail Audio Listened",
              event_properties: {
                partner_id: item.user,
              },
            })
    }

    const handleButtonClickPause = () => {
        setIsClickedAudio(false);
        setVisibleAudio(true);
        pause();
    }

    const [playing, setPlaying] = useState(false);

    const audioRef = useRef();

    const start = () => {
    setPlaying(true);
    audioRef.current.play();
    audioRef.current.addEventListener("ended", () => {
      audioRef.current.currentTime = 0;
      handleButtonClickPause();
      setVisible(true); // Обновите состояние visible
      setPlaying(false); // Установите состояние воспроизведения в false
    });
    }

    const pause = () => {
    setPlaying(false);
    setVisible(true); // Показать элемент при приостановке воспроизведения
    audioRef.current.pause();
    }

    const like_list = useRef(data.authenticated_user.likes_user_list);

    const match_user_list = useRef(data.authenticated_user.match_user_list);

    const updateMatchList = () => {
        match_user_list.current = [...match_user_list.current, item.user];
    };

    const updateRemoveMatchList = () => {
        const index = match_user_list.current.indexOf(item.user);
        if (index > -1) {
            match_user_list.current.splice(index, 1);
        }
    };

    const updateLikeList = () => {
        like_list.current = [...like_list.current, item.user];
    };

    const updateRemoveLikeList = () => {
        const index = like_list.current.indexOf(item.user);
        if (index > -1) {
            like_list.current.splice(index, 1);
        }
    };

    const shouldRender = visible && item.likes_user_list && item.likes_user_list.includes(data.authenticated_user.user) &&
        !data.authenticated_user.likes_user_list.includes(item.user)
    const shouldRender2 = visible && item.likes_user_list && item.likes_user_list.includes(data.authenticated_user.user) &&
        data.authenticated_user.likes_user_list.includes(item.user)

    const handleLike = () => {
        if (data.authenticated_user.likes_count >= 0) {
            data.authenticated_user.likes_count -= 1;
            amplitude.track({
              event_type: "Detail Like Pressed",
              event_properties: {
                partner_id: item.user,
              },
            })
            if (data.authenticated_user.likes_count >= 0) {
                updateLikeList();
                if (((like_list.current && like_list.current.includes(item.user)) &&
                    (item.likes_user_list && item.likes_user_list.includes(data.authenticated_user.user)))) {
                    updateMatchList();
                    setmatchUser(item)
                    postDataWithMatch();
                }
                postData();
                navigate('/card2', { state: { currentProfile: item, precent: item2 } })
            }
        }
        if (data.authenticated_user.likes_count < 0) {
            navigate('/premium')
        }
    };

    const handleLikeUndo = () => {
        if (((like_list.current && like_list.current.includes(item.user)) &&
            (item.likes_user_list && item.likes_user_list.includes(data.authenticated_user.user)))) {
            deleteDataWithMatch();
        } else {
            updateRemoveLikeList();
            postData();
            navigate('/card2', { state: { currentProfile: item, precent: item2 } })
        }
        postData();
        setIsMatch(false);
        setIsClicked(false);
        navigate(-1);
    }

    const postData = () => {
        axios.post(`${process.env.REACT_APP_API_URL}/api/users/profile/`, {
            likes_count: data.authenticated_user.likes_count,
            likes_user_list: like_list.current,
            match_user_list: match_user_list.current,
        })
            .then(response => {})
            .catch(error => {
                console.error('Error while posting data:', error);
            });
    };

    const postDataWithMatch = () => {
        axios
            .post(`${process.env.REACT_APP_API_URL}/api/users/profile/`, {
                likes_count: data.authenticated_user.likes_count,
                likes_user_list: like_list.current,
                match_user_list: match_user_list.current,
            })
            .then(response => {
                setIsMatch(true);
                postDataMatch();
            })
            .catch(error => {
                console.error('Error while posting data:', error);
                setIsMatch(false);
            });
    };

    const deleteDataWithMatch = () => {
        axios
            .post(`${process.env.REACT_APP_API_URL}/api/users/profile/`, {
                likes_count: data.authenticated_user.likes_count,
                likes_user_list: like_list.current,
                match_user_list: match_user_list.current,
            })
            .then(response => {
                setIsMatch(false);
                deleteDataMatch();
            })
            .catch(error => {
                console.error('Error while posting data:', error);
                setIsMatch(false);
            });
    };

    const postDataMatch = () => {
        axios.post(`${process.env.REACT_APP_API_URL}/api/users/add_match/`, {
            match_user_list: match_user_list.current,
        })
            .then(response => {
                if (isMatch) {
                    navigate('/card2', { state: { currentProfile: item, precent: item2 } })
                }
            })
            .catch(error => {
                console.error('Error while posting data:', error);
            });
    };

    const deleteDataMatch = () => {
        axios.post(`${process.env.REACT_APP_API_URL}/api/users/remove_match/`, {
            match_user_list: match_user_list.current,
        })
            .then(response => {
                updateRemoveMatchList();
                updateRemoveLikeList();
                postData();
                if (!isMatch) {
                    navigate('/card2', { state: { currentProfile: item, precent: item2 } })
                }
            })
            .catch(error => {
                console.error('Error while posting data:', error);
            });
    };

    const urlImg = "/match_bg.svg"

    const imgSyle = {
        backgroundImage: 'url(' + urlImg + ')',
    }

    const [showNotice, setShowNotice] = useState(false);

    useEffect(() => {
        if (item.likes_user_list && item.likes_user_list.includes(data.authenticated_user.user)) {
            setShowNotice(true);

            const timerId = setTimeout(() => {
                setShowNotice(false);
            }, 3000);

            return () => clearTimeout(timerId);
        }
    }, [item.likes_user_list, data.authenticated_user.user]);


    return (
        <div>
            {!isMatch ? (
                <div>
                    {item && (
                        <div className="align-items-center justify-content-center">
                            {item.likes_user_list && item.likes_user_list.includes(data.authenticated_user.user) &&
                                !data.authenticated_user.likes_user_list.includes(item.user) && (
                                    <div>
                                        {showNotice && (
                                            <div className="matchNotice d-flex">
                                                <span className="cardAvatar">
                                                    {item && item.photo && <img src={item.photo} alt="avatar" ></img>}
                                                </span>
                                                {item.sex === "Муж." ? (
                                                    <h2>{item.name} поставил вам лайк!</h2>
                                                ) : (
                                                    <h2>{item.name} поставила вам лайк!</h2>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            <div className="mainCardBodyFull">
                                <div className="mainCardFrameFull">
                                    <Button onClick={() => navigate(-1)} className='arrowCard' variant='custom'>
                                        <img className="mainSVG" src={"arrow-left.svg"} alt="options" />
                                    </Button>
                                    <img src={item.photo} alt="avatar" ></img>
                                    <div className='progressBarCustom d-flex justify-content-end'>
                                        <GradientSVG />
                                        <AnimatedProgressProvider
                                            valueStart={0}
                                            valueEnd={item2}
                                            duration={3}
                                            easingFunction={easeQuadInOut}
                                        >
                                            {value => {
                                                const roundedValue = Math.round(value);
                                                return (
                                                    <CircularProgressbar
                                                        value={value}
                                                        strokeWidth={12}
                                                        text={`${roundedValue}%`}
                                                        styles={{
                                                            root: {
                                                                width: "14vh",
                                                                textShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)"
                                                            },
                                                            path: {
                                                                stroke: `url(#${idCSS})`, height: "100%",
                                                                transform: 'rotate(0.5turn)',
                                                                transformOrigin: 'center center'
                                                            },
                                                            text: {
                                                                fill: '#F8F8F8',
                                                                fontFamily: 'Montserrat',
                                                                fontSize: '5vh',
                                                                fontStyle: 'normal',
                                                                fontWeight: '700',
                                                                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
                                                            }
                                                        }}
                                                    />
                                                );
                                            }}
                                        </AnimatedProgressProvider>
                                    </div>
                                    <div className="mainCardFrameBottomFull" />
                                    <h1 className="mainCardFrameBottomTitile">{item.name}, {calculateAge(item.age, newdate)}</h1>
                                    <h2 className="mainCardFrameBottomH1">{item.city}, {item.country}</h2>
                                    <h2 className="mainCardFrameBottomH2">{GetSign(item.age)}</h2>
                                </div>
                                <div className="d-flex justify-content-around transform  align-items-center">
                                    <Link to="/card" onClick={() => {
                                        amplitude.track({
                                          event_type: "Detail Discard Pressed",
                                          event_properties: {
                                            partner_id: item.user,
                                          },
                                        })
                                    }}>
                                        <Button className="mainCardButton" variant='custom'>
                                            <img className="mainSVG" src={"no_button.svg"} alt="options" />
                                        </Button>
                                    </Link>
                                    {visibleAudio && (
                                        <Button className="mainCardButton" variant='custom' onClick={handleButtonClickPlay}>
                                            <img className="mainSVG" src={"play_button.svg"} alt="options" />
                                        </Button>
                                    )}
                                    {isClickedAudio && (
                                        <div>
                                            <Button className="mainCardButton" variant='custom' onClick={handleButtonClickPause}>
                                                <img className="mainSVG" src={"pause_button.svg"} alt="options" />
                                            </Button>
                                            <div className="introFull">
                                                <h1 className="mainCardFrameBottomTitile">Интро</h1>
                                                <img className="mainSVG voice_shadow" src={"voice_wave_shadow.svg"} alt="options" />
                                                <img className="mainSVG voice" src={"voice_wave.svg"} alt="options" />
                                            </div>
                                        </div>
                                    )}
                                    {item && item.user && like_list.current.includes(item.user) && (
                                        <Button className="mainCardButton" variant='custom' onClick={handleLikeUndo}>
                                            <img className="mainSVG" src={"pressed_like_button.svg"} alt="options" id="pressed_like_button" />
                                        </Button>
                                    )}
                                    {item && item.user && !like_list.current.includes(item.user) && (
                                        <Button className="mainCardButton" variant='custom' onClick={handleLike}>
                                            <img className="mainSVG" src={"like_button.svg"} alt="options" id="like_button" />
                                        </Button>
                                    )}
                                </div>
                                <div className='bodyCustom'>
                                    <h4 className="CustomTitle">Интересы</h4>
                                    <div>
                                        {interests.map((interest, index) => {
                                            if (item.interests_array.includes(interest.value))
                                                return (
                                                    <div key={index} className='p-1 interestButton border-0 bg-transparent'>
                                                        <img src={interest.photo} alt="sign" className="interestIcon" />
                                                    </div>
                                                );
                                        })}
                                    </div>
                                    {((!shouldRender && !shouldRender2) || (shouldRender && !shouldRender2)) && !isClicked && (
                                        <div className='cardBottom'>
                                            <h3 className="mainText">Для начала общения нужен <br /> взаимный мэтч</h3>
                                            <Link reloadDocument to={'/card'}>
                                                <Button className='mainButton justify-content-center' variant='custom'>
                                                    <div className="buttonText">Продолжить поиск</div>
                                                </Button>
                                            </Link>
                                        </div>
                                    )}
                                    {shouldRender2 && (
                                        <Button className="mainButton" onClick={handleButtonClick}>
                                            <div className="buttonText">Начать общение</div>
                                        </Button>
                                    )}
                                    {isClicked && (
                                        <div>
                                            <br />
                                            <h4 className="CustomTitle">Контакты</h4>
                                            <h3 className="mainText">Поздравляем! Вы образовали мэтч с этим партнером.
                                                Он ждет вашего сообщения в одной из своих социальных сетей!</h3>
                                            {socials.map((social, index) => {
                                                if (social.name == "social_media_vk" && item.social_media_vk != "")
                                                    return (
                                                        <a href={"https://vk.com/" + item.social_media_vk.slice(1)}>
                                                            <div className='contactForm d-flex'>
                                                                <h1 className='contactTitle'>{social.value}</h1>
                                                                <img src={social.icon} alt="sign" className="interestIcon" />
                                                            </div>
                                                        </a>
                                                    );
                                                else if (social.name == "social_media_tg" && item.social_media_tg != "")
                                                    return (
                                                        <a href={"https://t.me/" + item.social_media_tg.slice(1)}>
                                                            <div className='contactForm d-flex'>
                                                                <h1 className='contactTitle'>{social.value}</h1>
                                                                <img src={social.icon} alt="sign" className="interestIcon" />
                                                            </div>
                                                        </a>
                                                    );
                                                else if (social.name == "social_media_wa" && item.social_media_wa != "")
                                                    return (
                                                        <a href={"https://wa.me/" + item.social_media_wa.slice(1)}>
                                                            <div className='contactForm d-flex'>
                                                                <h1 className='contactTitle'>{social.value}</h1>
                                                                <img src={social.icon} alt="sign" className="interestIcon" />
                                                            </div>
                                                        </a>
                                                    );
                                                else if (social.name == "social_media_ok" && item.social_media_ok != "")
                                                    return (
                                                        <a href={"https://ok.ru/profile/" + item.social_media_ok.slice(1)}>
                                                            <div className='contactForm d-flex'>
                                                                <h1 className='contactTitle'>{social.value}</h1>
                                                                <img src={social.icon} alt="sign" className="interestIcon" />
                                                            </div>
                                                        </a>
                                                    );
                                                else if (social.name == "social_media_ig" && item.social_media_ig != "")
                                                    return (
                                                        <a href={"https://instagram.com/" + item.social_media_ig.slice(1)}>
                                                            <div className='contactForm d-flex'>
                                                                <h1 className='contactTitle'>{social.value}</h1>
                                                                <img src={social.icon} alt="sign" className="interestIcon" />
                                                            </div>
                                                        </a>
                                                    );
                                            })
                                            }
                                        </div>
                                    )}
                                    <audio ref={audioRef} src={item.audio_5} />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <div className='p-3 premiumPage align-items-center justify-content-center' style={imgSyle}>
                        <div className='matchBody d-flex justify-content-center'>
                            <h1 className='matchText'>Мэтч!</h1>
                            <div className='leftMatch'>
                                <img src={item.photo} alt="Avatar_1" />
                            </div>
                            <div className='rightMatch'>
                                {data && data.authenticated_user.photo && <img src={data.authenticated_user.photo} alt="Avatar_2" ></img>}
                            </div>
                        </div>
                        <Link reloadDocument to={'/card2'} state={{ currentProfile: item, precent: item2 }}>
                            <Button className='mainButton justify-content-center' variant='custom'>
                                <div className="buttonText">Начать общение</div>
                            </Button>
                        </Link>
                        <br />
                        <Link reloadDocument to={'/card'}>
                            <Button className='trialButton justify-content-center' variant='custom'>
                                <div className="buttonText">Продолжить поиск</div>
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

function DataComponent(props) {
    const [data, setData] = useState({ profiles: [], authenticated_user: null });

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
                    authenticated_user: response.data.authenticated_user,
                });
                setIsLoading(false);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    return (
        <>
            {isLoading ? (
                <Home />
            ) : (
                <Form_post data={data} />
            )}
        </>
    );

};

export default DataComponent;