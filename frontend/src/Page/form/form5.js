import React, { useState, useRef, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import Home from '../../Page/home.js';

import 'reactjs-popup/dist/index.css';
import Popup from 'reactjs-popup';

import axios from 'axios';
import * as amplitude from "@amplitude/analytics-browser";

const Form_post = ({ data }) => {

    const navigate = useNavigate();

    React.useEffect(() => {
        if (
            data.authenticated_user.audio_1 &&
            data.authenticated_user.audio_2 &&
            data.authenticated_user.audio_3 &&
            data.authenticated_user.audio_4 &&
            data.authenticated_user.audio_5
        ) {
            navigate('/form6');
        }
        const identifyEvent = new amplitude.Identify();
        identifyEvent.set('status', 'authorized');
        identifyEvent.set('sex', data.authenticated_user.sex);
        identifyEvent.set('age', data.authenticated_user.age);
        identifyEvent.set('country', data.authenticated_user.country);
        identifyEvent.set('city', data.authenticated_user.city);
        amplitude.identify(identifyEvent);

        amplitude.setUserId(data.authenticated_user_email);

        amplitude.track('Onboard Audio Opened');
    }, []);

    const [validated, setValidated] = useState(false);
    const [permission, setPermission] = useState([]);
    const [recordingStatus, setRecordingStatus] = useState([]);
    const [audioChunks, setAudioChunks] = useState([...Array(5)].map(() => []));
    const [audio, setAudio] = useState([]);
    const [audioUrl, setAudioUrl] = useState([]);
    const mediaRecorder = useRef([]);
    const mimeType = "audio/webm";
    const [showPopup, setShowPopup] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(true);

    const [previousIndexRecord, setPreviousIndexRecord] = useState();
    const [previousIndexPlay, setPreviousIndexPlay] = useState();

    const handleSubmit = async (event) => {

        const form_valid = event.currentTarget;
        if (form_valid.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        setValidated(true);

        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);

        const authTokens = localStorage.getItem('authTokens');

        if (audio.length < 5) {
            setShowPopup(true)
        }
        else {
            // Append the audio files to the FormData object
            audio.forEach((audioFile, index) => {
                formData.append(`audio_${index + 1}`, audioFile);
            });

            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/profile/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${JSON.parse(authTokens).access}`
                },
                body: formData
            });
            if (response.status === 200) {
                const data = await response.json();
                navigate('/form6')
            } else {
                alert('Ошибка!!!');
            }
        }
    }

    const getMicrophonePermission = async (index) => {
        if ("MediaRecorder" in window) {
            try {
                setPermission((prevPermission) => {
                    const newPermission = [...prevPermission];
                    newPermission[index] = true;
                    return newPermission;
                });
                if (previousIndexRecord || previousIndexRecord == 0) {
                    stopRecording(previousIndexRecord);
                }
                startRecording(index);
                setPreviousIndexRecord(index);
            } catch (err) {
                alert(err.message);
            }
        } else {
            alert("The MediaRecorder API is not supported in your browser.");
        }
    };

    const convertBlobURLToAudioFile = (blobURL) => {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', blobURL, true);
            xhr.responseType = 'blob';

            xhr.onload = () => {
                if (xhr.status === 200) {
                    const blob = xhr.response;
                    const audioFile = new File([blob], 'audio.mp3', { type: 'audio/mp3' });
                    resolve(audioFile);
                } else {
                    reject(new Error('Failed to convert Blob URL to audio file.'));
                }
            };

            xhr.onerror = () => {
                reject(new Error('Failed to convert Blob URL to audio file.'));
            };

            xhr.send();
        });
    };


    const startRecording = async (index) => {
        setRecordingStatus((prevStatus) => {
            const newStatus = [...prevStatus];
            newStatus[index] = "recording";
            return newStatus;
        });
        const mimeType = "audio/webm";
        try {
            const streamData = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: false,
            });
            const media = new MediaRecorder(streamData, { type: mimeType });
            mediaRecorder.current[index] = media;
            let localAudioChunks = [];
            mediaRecorder.current[index].addEventListener("dataavailable", (event) => {
                if (typeof event.data === "undefined") return;
                if (event.data.size === 0) return;
                localAudioChunks.push(event.data);
            });
            mediaRecorder.current[index].start();
            setAudioChunks((prevChunks) => {
                const newChunks = [...prevChunks];
                newChunks[index] = localAudioChunks;
                return newChunks;
            });
        } catch (err) {
            alert(err.message);
        }
    };

    const stopRecording = (index) => {
        setRecordingStatus((prevStatus) => {
            const newStatus = [...prevStatus];
            newStatus[index] = "inactive";
            return newStatus;
        });
        if (mediaRecorder.current[index].state === 'inactive') return;
        mediaRecorder.current[index].stop();
        mediaRecorder.current[index].onstop = () => {
            const audioBlob = new Blob(audioChunks[index], { type: mimeType });
            const audioUrl = URL.createObjectURL(audioBlob);
            convertBlobURLToAudioFile(audioUrl)
                .then((audioFile) => {
                    setAudio((prevAudio) => {
                        const newAudio = [...prevAudio];
                        newAudio[index] = audioFile;
                        return newAudio;
                    });
                    setAudioChunks((prevChunks) => {
                        const newChunks = [...prevChunks];
                        newChunks[index] = [];
                        return newChunks;
                    });
                    setAudioUrl((prevURL) => {
                        const newURL = [...prevURL];
                        newURL[index] = audioUrl;
                        return newURL;
                    });
                })
                .catch((error) => {
                    console.error(error);
                });
        };
    };

    const deleteRecording = (index) => {
        setPermission((prevPermission) => {
            const newPermission = [...prevPermission];
            newPermission[index] = false;
            return newPermission;
        });
        setAudio((prevAudio) => {
            const newAudio = [...prevAudio];
            delete newAudio[index];
            return newAudio;
        });
    };

    const audioText = [
        {
            text: 'Расскажи интересный случай из своей жизни. Какие эмоции были у тебя в тот момент?',
        },
        {
            text: 'Какой был самый необычный опыт в твоей жизни? Опиши свои чувства — как положительные так и негативные.?',
        },
        {
            text: 'Каким последним достижением ты гордишься? Какие чувства у тебя были, когда получилось достичь?',
        },
        {
            text: 'Какие твои идеальные отношения? Опиши эмоции и чувства, которые будут между тобой и партнером.',
        },
        {
            text: 'А теперь поделись информацией о себе — это сообщение смогут прослушать все, кого увидит твой профиль.',
        },
    ]

    const [isClicked, setIsClicked] = useState(Array(5).fill(false));
    const [visible, setVisible] = useState(Array(5).fill(true));

    const audioSources = Array(5).fill("");
    const audioRefs = useRef(audioSources.map(() => React.createRef()));

    const handleButtonClickPlay = (index) => {
        const div = document.getElementById(index);
        div.style.background = "linear-gradient(180deg, #4A3AA2 12.50%, #A21C63 87.50%)";


        const audioElement = audioRefs.current[index];

        setIsClicked((prevIsClicked) => {
            const newIsClicked = [...prevIsClicked];
            newIsClicked[index] = true;
            return newIsClicked;
        });
        setVisible((prevVisible) => {
            const newVisible = [...prevVisible];
            newVisible[index] = false;
            return newVisible;
        })

        if (previousIndexPlay || previousIndexPlay == 0) {
            handleButtonClickPause(previousIndexPlay);
        }

        audioElement.play();
        setPreviousIndexPlay(index);

        audioElement.onended = function () {
            handleButtonClickPause(index)
        };
    };

    const handleButtonClickPause = (index) => {
        const div = document.getElementById(index);
        div.style.background = "#4A3AA2";


        const audioElement = audioRefs.current[index];

        setIsClicked((prevIsClicked) => {
            const newIsClicked = [...prevIsClicked];
            newIsClicked[index] = false;
            return newIsClicked;
        });
        setVisible((prevVisible) => {
            const newVisible = [...prevVisible];
            newVisible[index] = true;
            return newVisible;
        });

        audioElement.pause();
    };

    return (
        <div className={isPopupOpen ? 'scrolling-fixed' : 'scrolling'}>
            <Popup open={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
                {close => (
                    <div>
                        <a className="close" onClick={close}>
                            &times;
                        </a>
                        <h1>Важный шаг</h1>
                        <p>Мы подошли к самому важному шагу — запись голосовых сообщений о себе.
                            Все записи, кроме последней — конфиденциальны и надежно защищены. <br /> <br />
                            Мы используем их, чтобы проанализировать твои личностные характеристики и подобрать подходящего партнера.
                            Пожалуйста, разреши доступ к микрофону и записывай в тихом помещении.</p>
                        <img src={"popup_icon.svg"} alt="icon" />
                        <Button className='popup-button justify-content-center' variant='custom' onClick={close}>
                            <div className="buttonText">Давай начнем!</div>
                        </Button>
                    </div>
                )}
            </Popup>
            <Popup open={showPopup} onClose={() => setShowPopup(false)}>
                {close => (
                    <div>
                        <a className="close" onClick={close}>
                            &times;
                        </a>
                        <h1>Нельзя перейти дальше без записи аудио</h1>
                        <Button className='popup-button-error justify-content-center' variant='custom' onClick={close}>
                            <div className="buttonText">Хорошо</div>
                        </Button>
                    </div>
                )}
            </Popup>
            <div className="align-items-center justify-content-center">
                <div className="d-flex vertical-center-2 flex-row justify-content-between navCustom">
                    <a className="p-3 navCustomTitleActive">Запиши аудио</a>
                    <a className="p-3 navCustomTitleActive">5/6</a>
                </div>
                <Form
                    className="bodyCustom"
                    noValidate
                    validated={validated}
                    onSubmit={handleSubmit}
                >
                    <h4 className="CustomTitle">Расскажи о себе в голосовых сообщениях</h4>
                    {[...Array(5)].map((_, index) => (
                        <section key={index} className="voice-recorder">
                            <div>
                                <h3 className="mainText">{audioText[index].text}</h3>
                                <div className="audio-controls">
                                    {!permission[index] ? (
                                        <button
                                            onClick={() => getMicrophonePermission(index)}
                                            type="button"
                                            className="microButton"
                                        >
                                            <img src={"microphone_icon.svg"} alt="micro" className="interestIcon" />
                                        </button>
                                    ) : null}
                                    {recordingStatus[index] === "recording" ? (
                                        <button
                                            onClick={() => stopRecording(index)}
                                            type="button"
                                            className="microButton2"
                                        >
                                            <img src={"microphone_icon2.svg"} alt="micro" className="interestIcon" />
                                        </button>
                                    ) : null}
                                </div>
                                {audio[index] ? (
                                    <div className="audio-player">
                                        <div className="microphoneBody" id={index} />
                                        {visible[index] ? (
                                            <button onClick={() => handleButtonClickPlay(index, audioUrl[index])} type="button" className="deleteButton">
                                                <img src={"play_icon.svg"} alt="delete" className="microphoneIMG" />
                                            </button>
                                        ) : null}
                                        {isClicked[index] ? (
                                            <button onClick={() => handleButtonClickPause(index, audioUrl[index])} type="button" className="deleteButton">
                                                <img src={"pause_icon.svg"} alt="delete" className="microphoneIMG" />
                                            </button>
                                        ) : null}
                                        <img src={"audio_body.svg"} alt="delete" className="microphoneIMGBody" />
                                        <button onClick={() => deleteRecording(index)} type="button" className="deleteButton">
                                            <img src={"delete_icon.svg"} alt="delete" className="microphoneIMG" />
                                        </button>
                                        <audio ref={(input) => { audioRefs.current[index] = input }} src={audioUrl[index]} />
                                    </div>
                                ) : null}
                            </div>
                        </section>
                    ))}
                    <Button className="NextButtonCustom" type="submit">
                        <div className="NextButtonTextCustom">Далее</div>
                    </Button>
                </Form>
            </div>
        </div>
    );
}

function DataComponent() {
    const [data, setData] = useState({
        authenticated_user: null,
        authenticated_user_email: null,
    });

    if (!localStorage.hasOwnProperty('authTokens')) {
        window.open("/login", "_self");
    } else {
        const authTokens = JSON.parse(localStorage.getItem('authTokens'));
        axios.defaults.headers.common['Authorization'] = `Bearer ${authTokens.access}`;
    }

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_API_URL}/api/user/check/`)
            .then(response => {
                setData({
                    authenticated_user: response.data.authenticated_user,
                    authenticated_user_email: response.data.authenticated_user_email,
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