import React, { useState, useEffect, useRef } from "react";
import happy from "../../images/icons-happy.png";
import logo from "../../images/logo.svg";
import agentIcon from "../../images/logo-without-name.svg";
import plus from "../../images/plus-icon.png";
import { FaWindowMinimize } from "react-icons/fa6";
import moment from "moment";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import {
  Avatar,
  TitleBar,
  TextInput,
  MessageList,
  Message,
  MessageText,
  AgentBar,
  Title,
  Subtitle,
  MessageGroup,
  MessageButtons,
  MessageButton,
  MessageTitle,
  MessageMedia,
  TextComposer,
  Row,
  Fill,
  Fit,
  IconButton,
  SendButton,
  EmojiIcon,
  CloseIcon,
  SendIcon,
  Column,
  RateGoodIcon,
  RateBadIcon,
  Bubble,
  QuickReplies,
  AddIcon,
} from "@livechat/ui-kit";
import { FaRegCircleStop } from "react-icons/fa6";
import { RiVoiceprintLine } from "react-icons/ri";

// import EmojiPicker from 'emoji-picker-react';
import Spinner from "../spinner/Spinner";
import AnswerComponent from "./AnswerComponent";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

// import logo from '../../logo.png';

let textRef = React.createRef();

const Maximized = ({
  minimize,
  messages,
  handleMessage,
  addMessages,
  chatResponse,
  handleClose,
}) => {
  const [emojiPickerShown, setEmojiPickerShown] = useState(false);
  let currentReplies = useRef([]);
  const [message, setMessage] = useState("");

  const [audioStatus, setAudioStatus] = useState("");

  useEffect(() => {
    // const div = document.getElementById('messageGroup');
    // console.log(div);
    // if(div){
    //     div.lastChild.lastElementChild.scrollIntoView({behavior: 'smooth'});
    // }
    // const div = document.getElementsByClassName('quick-replies');
    // if(div.length > 0){
    //     div[div.length-1].scrollIntoView({behavior: 'smooth'});
    // }
    //  const messageGroup = document.getElementById('messageGroup');
    // if(messageGroup) {
    //     messageGroup.lastChild.lastElementChild.scrollIntoView({behavior: 'smooth'});
    // }
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      handleMessage(
        {
          text: `<b>Welcome to the Amazing World of Pranic Healing!</b>
                  <p>I'm your ChatBot, here to guide you and provide any information you need about Pranic Healing. Whether you're curious about the basics, seeking deeper insights, or have specific questions, I'm here to assist you every step of the way.</p>`,
          value: `Welcome to the Amazing World of Pranic Healing!
                  I'm your ChatBot, here to guide you and provide any information you need about Pranic Healing. Whether you're curious about the basics, seeking deeper insights, or have specific questions, I'm here to assist you every step of the way.`,
        },
        false
      );
    }
  }, []);

  //   const handleChange = (e) => {
  //     if (e) {
  //       setMessage(e.target.value);
  //     }
  //   };

  const showEmojiPicker = () => {
    setEmojiPickerShown(!emojiPickerShown);
  };

  const quickReplySelected = (optionText) => {
    const { text, value } = currentReplies.current.filter(
      (reply) => reply.text === optionText
    )[0];
    if (value.toLowerCase().startsWith("http")) {
      window.open(value);
    } else {
      handleMessage({ text, value }, true);
    }
  };

  // let config, conversation;

  // const AWS = window.AWS;

  // const onAudioButtonClick = () => {
  //     /*AWS.config.region = 'ap-southeast-1';
  //     AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  //         IdentityPoolId: 'ap-southeast-1:c47b18c5-d242-4350-981c-35024c1badd6',
  //     });*/

  //     AWS.config.region = 'us-east-1';
  //         AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  //         IdentityPoolId: 'us-east-1:5e406517-f2fa-4ea3-a014-38f4f113140b',
  //     });

  //     config = {
  //         lexConfig: {botName: 'CB_sampleBot', botAlias: 'CB_sampleBotAlias'},
  //     };

  //     conversation = new window.LexAudio.conversation(config, function (state) {
  //         setAudioStatus(state + '...');
  //     }, function (data) {
  //         addMessages(data);
  //     }, function (error) {
  //         setAudioStatus(error.message);
  //     }, function (timeDomain, bufferLength){

  //     });
  //     conversation.advanceConversation();
  // };

  // const onEmojiClick = (event, emojiObject) => {
  //     setMessage(prev => prev + 'travel');
  //     setEmojiPickerShown(!emojiPickerShown);
  // }

  const showQuickReplies = (responseCard) => {
    let options = [];
    if (responseCard.genericAttachments[0].buttons) {
      currentReplies.current = [
        ...currentReplies.current,
        ...responseCard.genericAttachments[0].buttons,
      ];
      responseCard.genericAttachments[0].buttons.map((button) =>
        options.push(button.text)
      );
      return (
        <QuickReplies
          className="quick-replies"
          replies={[...options]}
          onSelect={quickReplySelected}
          style={{ display: "grid", justifyContent: "left", textAlign: "left" }}
        />
      );
    } else {
      return null;
    }
  };

  const handleKeyDown = (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      const messageText = event.target.value;
      if (messageText !== "") {
        handleMessage({ text: messageText, value: messageText }, true);
        setMessage("");
      }
      return false;
    }
  };

  const handleSendButtonClick = () => {
    if (message !== "") {
      handleMessage({ text: message, value: message }, true);
      setMessage("");
    }
  };

  const bubbleOwnStyle = {
    background: "#ffffff",
    color: "#000",
    border: "0.5px solid #555858",
    borderRadius: "13px 13px 13px 4px",
    padding: "10px 13px 9px 10px !important",
  };

  const bubbleBotStyle = {
    background: "#555858",
    border: "1px solid #555858",
    opacity: "1",
    marginBottom: "4px",
    display: "inline-block",
    borderRadius: "13px 13px 4px 13px",
    color: "#ffffff",
    padding: "10px 12px 9px 15px !important",
  };

  const bubbleOwnContainer = {
    width: "100%",
    display: "flex",
    textAlign: "right",
    alignItems: "flex-end",
    justifyContent: "flex-end",
  };
  const bubbleBotContainer = {
    width: "100%",
    display: "flex",
    textAlign: "left",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  };

  const getAnswerObj = (id) =>
    chatResponse.length > 0 && chatResponse.find((item) => item.id === id);

  const [isDisabled, setIsDisabled] = useState(true);
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    if (message) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [message]);

  useEffect(() => {
    if (transcript !== lastTranscript) {
      setInterimTranscript(transcript.replace(lastTranscript, ""));
    }
  }, [transcript]);

  useEffect(() => {
    if (!listening) {
      setMessage((prev) => prev + interimTranscript);
      setLastTranscript(transcript);
      setInterimTranscript("");
    }
  }, [listening]);

  const [lastTranscript, setLastTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");

  const handleChange = (e) => {
    setInterimTranscript("");
    SpeechRecognition.stopListening();
    setMessage(e.target.value);
  };

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null;
  }

  return (
    <div className="main-container">
      <TitleBar
        style={{ padding: "10px 12px 0 12px" }}
        leftIcons={[<div></div>]}
        rightIcons={[
          <div
            style={{
              display: "inline-flex",
            }}
          >
            <IconButton
              key="minimize"
              onClick={() => {
                if ("parentIFrame" in window) {
                  window.parentIFrame.getPageInfo((obj) => {
                    window.parentIFrame.size(105, 140);
                  });
                }
                minimize();
              }}
              style={{
                display: "flex",
                alignItems: "flex-start",
                padding: "0",
                paddingRight: "15px",
              }}
            >
              <FaWindowMinimize color={"#2b4c87"} />
              {/* <i
                    class='material-icons'
                    style={{
                    color: 'rgb(102 28 105 / 0.70)',
                    }}
                >
                </i> */}
            </IconButton>
            <IconButton
              key="close"
              onClick={() => {
                handleClose();
                if ("parentIFrame" in window) {
                  window.parentIFrame.getPageInfo((obj) => {
                    window.parentIFrame.size(105, 140);
                  });
                }
                minimize();
              }}
              style={{
                padding: "0",
              }}
            >
              <CloseIcon
                className="svg-custom"
                color="#2b4c87"
                style={{
                  width: "20px",
                  height: "20px",
                }}
              />
            </IconButton>
          </div>,
        ]}
      />

      <div
        style={{
          background: "#ffffff",
          textAlign: "center",
          marginBottom: "5px",
        }}
      >
        <img src="/pranic-healing-logo.png" alt="logo" width="140" height="85" />
      </div>

      <div
        style={{
          textAlign: "center",
          font: "normal normal normal 12px/15px Arial",
          letterSpacing: "0",
          color: "#000000",
          opacity: "1",
        }}
      >
        <span>{moment().format("ddd, HH:mm A")}</span>
      </div>
      <div
        id="messageList"
        style={{
          flexGrow: 1,
          minHeight: 0,
          height: "100%",
        }}
      >
        <MessageList
          active
          containScrollInSubtree
          style={{
            background: "#fff",
            padding: "0",
          }}
        >
          {messages.length > 0 && (
            <MessageGroup
              id="messageGroup"
              onlyFirstWithMeta
              style={{ paddingLeft: "7px", marginTop: "10px" }}
            >
              {messages.map((message) =>
                message.message !== "" ? (
                  <Message isOwn={message.isOwn} className="message-container">
                    <div
                      style={{
                        marginRight: "0.3em",
                      }}
                    >
                      {!message.isOwn && (
                        <div>
                          <img
                            src="/logo-square.png"
                            alt="logo"
                            width="25"
                            height="35"
                          />
                        </div>
                      )}
                    </div>
                    <div
                      style={
                        message.isOwn ? bubbleOwnContainer : bubbleBotContainer
                      }
                    >
                      <Bubble
                        isOwn={message.isOwn}
                        style={message.isOwn ? bubbleBotStyle : bubbleOwnStyle}
                      >
                        <MessageText>
                          {message.isOwn ? (
                            message.message
                          ) : (
                            <>
                              {message.id ? (
                                <AnswerComponent
                                  answer={message.message}
                                  obj={getAnswerObj(message.id)}
                                />
                              ) : (
                                <>
                                <Markdown rehypePlugins={[rehypeRaw]}>
                                  {message.message}
                                  
                                </Markdown>
                                
                                {!!message.sources && message.sources.length > 0 && (<>
                                  {message.sources.map((source,index) => (
                                    <span key={index}>{source}</span>
                                    
                                  ))}
                                  </>)}</>
                              )}
                            </>
                          )}
                        </MessageText>
                      </Bubble>
                      {/* {message.responseCard && showQuickReplies(message.responseCard)} */}
                    </div>
                  </Message>
                ) : (
                  <Spinner />
                )
              )}
            </MessageGroup>
          )}
        </MessageList>
      </div>
      <div style={{ flexShrink: 0, padding: "5px 12px 10px 12px" }}>
        <TextComposer>
          <Row align="center">
            {/* <IconButton>
                    <div
                    style={{
                        width: '30px',
                        height: '30px',
                        background: '#661C69',
                        borderRadius: '50%',
                        display: 'table-cell',
                        verticalAlign: 'middle',
                        textAlign: 'center',
                    }}
                    >
                    <img
                        src={plus}
                        alt='plus'
                        style={{
                        marginTop: '3px',
                        }}
                    />
                    </div>
                </IconButton> */}
            <Fill
              style={{
                alignSelf: "flex-end",
                marginTop: "2px",
                marginLeft: "10px",
              }}
            >
              <textarea
                rows="3"
                onKeyDown={handleKeyDown}
                className="text-area"
                placeholder="Looking for answers? Ask here..."
                // value={message}
                value={message + interimTranscript}
                id="messageText"
                name="messageText"
                onChange={handleChange}
              />
            </Fill>
            <IconButton
              style={{
                padding: "0.8em 0.2em",
                zIndex: "1",
                marginTop: "3px",
              }}
            >
              {/* <img alt='happy' src={happy} width='16' height='16' onClick= {showEmojiPicker} /> */}
            </IconButton>
            {/* <IconButton fit>
                        <EmojiIcon color="#F5821F" onClick= {showEmojiPicker} />
                    </IconButton> */}
            {listening ? (
              <IconButton
                className="min-w-max bg-transparent p-0"
                onClick={SpeechRecognition.stopListening}
              >
                <FaRegCircleStop size="25px" color="black" />
              </IconButton>
            ) : (
              <IconButton
                className="min-w-max bg-transparent p-1 pb-2"
                onClick={() =>
                  SpeechRecognition.startListening({ continuous: true })
                }
              >
                <RiVoiceprintLine size="25px" color="black" />
              </IconButton>
            )}
            <IconButton
              fit
              disabled={isDisabled}
              style={!message ? { cursor: "none", opacity: "0.5" } : {}}
            >
              <SendIcon
                color="#2b4c87"
                style={{
                  width: "18px",
                  height: "16px",
                }}
                onClick={handleSendButtonClick}
              />
            </IconButton>
            {/* <IconButton color="#F5821F" onClick= {onAudioButtonClick}>
                        <i className="material-icons" style={{color:"#F5821F"}}>mic_none</i>
                    </IconButton>
                    */}
          </Row>
          {/* <Row>
                    <p style={{margin:'auto', color:'#661C69', fontWeight:700}}><span>{audioStatus}</span></p>
                </Row>
                {emojiPickerShown && 
                    <Row align="center">
                        <EmojiPicker onEmojiClick={onEmojiClick} />
                    </Row>
                } */}
        </TextComposer>
      </div>
    </div>
  );
};

export default Maximized;
