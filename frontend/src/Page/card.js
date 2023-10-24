import React, { useEffect, useState, useRef } from 'react';
import { Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';

import { CircularProgressbar } from 'react-circular-progressbar';
import { easeQuadInOut } from 'd3-ease';
import AnimatedProgressProvider from "./AnimatedProgressProvider";
import 'react-circular-progressbar/dist/styles.css';
import GradientSVG from '../Component/GradientSVG';
import "../Component/common.css"
import Home from './home.js';

import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';


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

const ProfileList = ({ data }) => {

  const [isClicked, setIsClicked] = useState(false);
  const [isMatch, setIsMatch] = useState(false);
  const [visible, setVisible] = useState(true);

  const handleButtonClickPlay = () => {
    setIsClicked(true);
    setVisible((prev) => !prev);
    start();
  }

  const handleButtonClickPause = () => {
    setIsClicked(false);
    setVisible((prev) => !prev);
    pause();
  }

  const like_list = useRef(data.authenticated_user_like_list);

  const match_user_list = useRef(data.authenticated_user.match_user_list);

  const idCSS = "custom-gradient";

  const dateObj = new Date();
  const month = dateObj.getUTCMonth() + 1;
  const day = dateObj.getUTCDate();
  const year = dateObj.getUTCFullYear();

  const formattedMonth = month < 10 ? `0${month}` : month;
  const formattedDay = day < 10 ? `0${day}` : day;

  const newdate = `${formattedDay}/${formattedMonth}/${year}`;

  const postData = () => {
    let age_array = []
    if (data.authenticated_user_age_filter) {
      age_array = data.authenticated_user_age_filter
    } else {
      age_array = "[18," + calculateAge(data.authenticated_user_age, newdate) + "]"
    }
    axios.post(`${process.env.REACT_APP_API_URL}/api/users/profile/`, {
      likes_count: data.authenticated_user_likes_count,
      likes_user_list: like_list.current,
      age_year: calculateAge(data.authenticated_user_age, newdate),
      age_filter: age_array,
      match_user_list: match_user_list.current,
    })
      .then(response => {
        console.log('Data posted successfully:', response.data);
      })
      .catch(error => {
        console.error('Error while posting data:', error);
      });
  };

  const postDataMatch = () => {
    axios.post(`${process.env.REACT_APP_API_URL}/api/users/add_match/`, {
      match_user_list: match_user_list.current,
    })
      .then(response => {
        console.log('Data posted successfully:', response.data);
        setCurrentIndex(prevIndex => prevIndex + 1);
        postData();
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
        console.log('Data posted successfully:', response.data);
        updateRemoveMatchList();
        updateRemoveLikeList();
        setCurrentIndex(prevIndex => prevIndex + 1);
        postData();
      })
      .catch(error => {
        console.error('Error while posting data:', error);
      });
  };

  const postDataWithMatch = () => {
    let age_array = [];
    if (data.authenticated_user_age_filter) {
      age_array = data.authenticated_user_age_filter;
    } else {
      age_array = "[18," + calculateAge(data.authenticated_user_age, newdate) + "]";
    }
    axios
      .post(`${process.env.REACT_APP_API_URL}/api/users/profile/`, {
        likes_count: data.authenticated_user_likes_count,
        likes_user_list: like_list.current,
        age_year: calculateAge(data.authenticated_user_age, newdate),
        age_filter: age_array,
        match_user_list: match_user_list.current,
      })
      .then(response => {
        console.log('Data posted successfully:', response.data);
        postDataMatch();
        setIsMatch(true);
      })
      .catch(error => {
        console.error('Error while posting data:', error);
        setIsMatch(false);
      });
  };

  const deleteDataWithMatch = () => {
    let age_array = [];
    if (data.authenticated_user_age_filter) {
      age_array = data.authenticated_user_age_filter;
    } else {
      age_array = "[18," + calculateAge(data.authenticated_user_age, newdate) + "]";
    }
    axios
      .post(`${process.env.REACT_APP_API_URL}/api/users/profile/`, {
        likes_count: data.authenticated_user_likes_count,
        likes_user_list: like_list.current,
        age_year: calculateAge(data.authenticated_user_age, newdate),
        age_filter: age_array,
        match_user_list: match_user_list.current,
      })
      .then(response => {
        console.log('Data posted successfully:', response.data);
        deleteDataMatch();
        setIsMatch(false);
      })
      .catch(error => {
        console.error('Error while posting data:', error);
        setIsMatch(false);
      });
  };

  const navigate = useNavigate();


  const [currentIndex, setCurrentIndex] = useState(0);

  const counterRef = useRef(0);

  const handleNo = () => {
    setCurrentIndex(prevIndex => prevIndex + 1);
    postData();
  };

  const [matchUser, setmatchUser] = useState();

  const handleLike = () => {
    if (data.authenticated_user_likes_count >= 0) {
      setCurrentIndex(prevIndex => prevIndex + 1);
      data.authenticated_user_likes_count -= 1;
      if (data.authenticated_user_likes_count >= 0) {
        updateLikeList();
        if (((like_list.current && like_list.current.includes(data.profiles[currentIndex].user)) &&
          (data.profiles[currentIndex].likes_user_list && data.profiles[currentIndex].likes_user_list.includes(data.authenticated_user_id)))) {
          updateMatchList();
          setmatchUser(data.profiles[currentIndex])
          postDataWithMatch();
        }
        postData();
      }
    }
    if (data.authenticated_user_likes_count < 0) {
      navigate('/premium')
    }
  };

  const handleLikeUndo = () => {
    if (((like_list.current && like_list.current.includes(data.profiles[currentIndex].user)) &&
      (data.profiles[currentIndex].likes_user_list && data.profiles[currentIndex].likes_user_list.includes(data.authenticated_user_id)))) {
      deleteDataWithMatch();
    } else {
      updateRemoveLikeList();
      setCurrentIndex(prevIndex => prevIndex + 1);
    }
    postData();
    setIsMatch(false);
  }


  const [playing, setPlaying] = useState(false);

  const audioRef = useRef();

  const start = () => {
    setPlaying(true);
    audioRef.current.play();
    audioRef.current.addEventListener("ended", function () {
      audioRef.current.currentTime = 0;
      handleButtonClickPause()
    });
  }

  const pause = () => {
    setPlaying(false);
    audioRef.current.pause();
  }


  const currentProfile = data.profiles[currentIndex];

  const shouldRender = currentProfile && (!data.authenticated_user_like_list.includes(currentProfile.user) && !data.authenticated_user.match_user_list.includes(currentProfile.user))

  if (data.profiles.length >= currentIndex) {
    if (!shouldRender) {
      handleNo();
    }
  }

  const updateMatchList = () => {
    match_user_list.current = [...match_user_list.current, data.profiles[currentIndex].user];
  };

  const updateRemoveMatchList = () => {
    const index = match_user_list.current.indexOf(data.profiles[currentIndex].user);
    if (index > -1) {
      match_user_list.current.splice(index, 1);
    }
  };

  const updateLikeList = () => {
    like_list.current = [...like_list.current, data.profiles[currentIndex].user];
  };

  const updateRemoveLikeList = () => {
    const index = like_list.current.indexOf(data.profiles[currentIndex].user);
    if (index > -1) {
      like_list.current.splice(index, 1);
    }
  };

  const calculateMatch = (currentProfile) => {
    counterRef.current = 0

    let next = 0
    let y = 0

    currentProfile.factors_array.replace("[", "").replace("]", "").split(', ').forEach((x) => {
      y = data.authenticated_parameter_array.replace("[", "").replace("]", "").split(',')[next]
      if (x === y) {
        counterRef.current += 1;
      }
      next += 1
    });
    postData();
    return 100 / 16 * (counterRef.current)
  }

  const urlImg = "/match_bg.svg"

  const imgSyle = {
    backgroundImage: 'url(' + urlImg + ')',
  }

  return (
    <div>
      {!isMatch ? (
        <div className="align-items-center justify-content-center">
          <div className="d-flex navCustom justify-content-between">
            <div className="pt-1 px-3 align-items-center">
              <Link to={'/profile'}>
                <button className='buttonToPage'>
                  <span className="cardAvatar d-flex justify-content-start">
                    {data && data.authenticated_user_photo && <img src={data.authenticated_user_photo} alt="avatar" ></img>}
                  </span>
                </button>
              </Link>
            </div>
            <div className="d-flex justify-content-end">
              <Link to={'/sympathy'} state={{ user: data.authenticated_user }}>
                <div className="p-2">
                  <img className="mainSVG" src={"heart_button.svg"} alt="likes" />
                </div>
              </Link>
              <Link to={'/filter'}>
                <div className="p-2">
                  <img className="mainSVG" src={"options_button.svg"} alt="options" />
                </div>
              </Link>
            </div>
          </div>
          <div className="mainCardBody">
            <button className='buttonToPage'>
              {currentProfile && (!data.authenticated_user_like_list.includes(currentProfile.user)
                && !data.authenticated_user.match_user_list.includes(currentProfile.user)) && (
                  <div key={currentProfile.id}>
                    <Link to='/card2' state={{ currentProfile: currentProfile, precent: calculateMatch(currentProfile) }}>
                      <div className="mainCardFrame">
                        <img src={currentProfile.photo} alt="avatar" ></img>
                        <div className='likesCount'>
                          {data.authenticated_user_likes_count <= 0 ? (
                            <img
                              className="mainSVG"
                              src={"heart_button.svg"}
                              alt="likes"
                              style={{ filter: "brightness(0) invert(1) drop-shadow(0 0 15px red)" }}
                            />
                          ) : (
                            <img
                              className="mainSVG"
                              src={"heart_button.svg"}
                              alt="likes"
                            />
                          )}
                          {data.authenticated_user_likes_count <= 0 ? (
                            <h3
                              className="transform"
                              style={{ color: "red" }}
                            > {data.authenticated_user_likes_count} </h3>
                          ) : (
                            <h3
                              className="transform"
                            > {data.authenticated_user_likes_count} </h3>
                          )}
                        </div>
                        <div className='progressBarCustom d-flex justify-content-end'>
                          <GradientSVG />
                          <AnimatedProgressProvider
                            valueStart={0}
                            valueEnd={calculateMatch(currentProfile)}
                            duration={2}
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
                        {visible && (
                          <div>
                            <div className="mainCardFrameBottom" />
                            <h1 className="mainCardFrameBottomTitile">{currentProfile.name}, {calculateAge(currentProfile.age, newdate)}</h1>
                            <h2 className="mainCardFrameBottomH1">{currentProfile.city}, {currentProfile.country}</h2>
                            <h2 className="mainCardFrameBottomH2">{GetSign(currentProfile.age)}</h2>
                          </div>
                        )}
                      </div>
                    </Link>
                  </div>
                )}
              {!shouldRender && (
                <div className="mainCardFrame">
                  <img src={"photo_icon.svg"} alt="avatar" ></img>
                  <div className="mainCardFrameBottom" />
                </div>
              )}
            </button>
            {shouldRender && (
              <div className="d-flex justify-content-around button-z">
                <Button className="mainCardButton" variant='custom' onClick={handleNo}>
                  <img className="mainSVG" src={"no_button.svg"} alt="options" />
                </Button>
                {visible && (
                  <Button className="mainCardButton" variant='custom' onClick={handleButtonClickPlay}>
                    <img className="mainSVG" src={"play_button.svg"} alt="options" />
                  </Button>
                )}
                {isClicked && (
                  <div>
                    <Button className="mainCardButton" variant='custom' onClick={handleButtonClickPause}>
                      <img className="mainSVG" src={"pause_button.svg"} alt="options" />
                    </Button>
                    <div className="intro">
                      <h1 className="mainCardFrameBottomTitile">Интро</h1>
                      <img className="mainSVG voice_shadow2" src={"voice_wave_shadow.svg"} alt="options" />
                      <img className="mainSVG voice2" src={"voice_wave.svg"} alt="options" />
                    </div>
                  </div>
                )}
                {currentProfile && currentProfile.user && like_list.current.includes(currentProfile.user) && (
                  <Button className="mainCardButton" variant='custom' onClick={handleLikeUndo}>
                    <img className="mainSVG" src={"pressed_like_button.svg"} alt="options" id="pressed_like_button" />
                  </Button>
                )}
                {currentProfile && currentProfile.user && !like_list.current.includes(currentProfile.user) && (
                  <Button className="mainCardButton" variant='custom' onClick={handleLike}>
                    <img className="mainSVG" src={"like_button.svg"} alt="options" id="like_button" />
                  </Button>
                )}
                {currentProfile && currentProfile.audio_5 && <audio ref={audioRef} src={currentProfile.audio_5} />}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className='p-3 premiumPage align-items-center justify-content-center' style={imgSyle}>
            <div className='matchBody d-flex justify-content-center'>
              <h1 className='matchText'>Мэтч!</h1>
              <div className='leftMatch'>
                <img src={matchUser.photo} alt="Avatar_1" />
              </div>
              <div className='rightMatch'>
                {data && data.authenticated_user_photo && <img src={data.authenticated_user_photo} alt="Avatar_2" ></img>}
              </div>
            </div>
            <Link to={'/card2'} state={{ currentProfile: matchUser, precent: calculateMatch(matchUser) }}>
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
  const [data, setData] = useState({ profiles: [], authenticated_user_photo: null, authenticated_user_likes_count: null, authenticated_user_id: null, authenticated_parameter_array: [], authenticated_user_age: null, authenticated_user_age_filter: [], authenticated_user: null });

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
          authenticated_parameter_array: response.data.authenticated_parameter_array,
          authenticated_user_age: response.data.authenticated_user_age,
          authenticated_user_age_filter: response.data.authenticated_user_age_filter,
          authenticated_user: response.data.authenticated_user,
        });
        setIsLoading(false);
      })
      .catch(error => {
        window.open("/form", "_self")
        console.error(error);
      });
  }, []);

  return (
    <>
      {isLoading ? (
        <Home />
      ) : (
        <ProfileList data={data} />
      )}
    </>
  );

};

export default DataComponent;