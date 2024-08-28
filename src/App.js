import * as React from "react";
import axios from "axios";
import Maximized from "../src/components/chat/Maximized";
import Minimized from "../src/components/chat/Minimized";
import { ThemeProvider, FixedWrapper, defaultTheme } from "@livechat/ui-kit";
import { isMobile, isAndroid, isIOS, isWindows } from 'react-device-detect';

const AWS = window.AWS;

/*AWS.config.region = 'ap-southeast-1';
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: 'ap-southeast-1:c47b18c5-d242-4350-981c-35024c1badd6',
});*/

// AWS.config.region = 'us-east-1';
// AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//   IdentityPoolId: 'us-east-1:5e406517-f2fa-4ea3-a014-38f4f113140b',
// });

// let lexRunTime = new AWS.LexRuntime();
// let lexUserId = 'mediumBot' + Date.now();

const deviceType = isMobile ? 'Mobile' : 'Desktop';
let deviceOS = '';
if (isMobile && isAndroid) {
  deviceOS = 'Android';
} else if (isMobile && isIOS) {
  deviceOS = 'IOS';
} else {
  deviceOS = '';
}

class App extends React.Component {
  state = {
    theme: "defaultTheme",
    messages: [],
    chatResponse: [],
  };

  theme = {
    ...defaultTheme,
    vars: {
      "primary-color": "#F5821F",
      "secondary-color": "#F4F0EC",
    },
    TitleBar: {
      css: {
        width: "auto",
        background: "#ffffff",
        borderRadius: "20px",
        color: "#333",
        font: "normal normal bold 24px/28px Arial",
        fontSize: "24px",
        padding: "15px 20px 0 15px",
        alignItems: "baseline",
      },
    },
    MessageGroup: {
      css: {
        marginBottom: "0",
        paddingLeft: "11px",
        paddingRight: "0.5em",
      },
    },
    Bubble: {
      css: {
        background: "#555858",
        border: "1px solid #555858",
        opacity: "1",
        marginBottom: "4px",
        display: "inline-block",
      },
    },
    Message: {
      css: {
        marginBottom: "0.5em",
        marginRight: "0",
      },
    },
    MessageText: {
      css: {
        font: "normal normal normal 14px/17px Arial",
        padding: "0",
      },
    },
    Avatar: {
      css: {
        width: "40px !important",
        height: "45px !important",
        minWidth: "unset",
      },
    },
    TextInput: {
      css: {
        margin: "8px 0",
        font: "normal normal normal 16px/18px Arial",
        letterSpacing: "0",
        color: "#333333",
        opacity: "0.5",
      },
    },
    TextComposer: {
      css: {
        borderRadius: "50px",
        margin: "0",
        border: "0.5px solid #000",
        opacity: "1",
        padding: "7px",
      },
      SendIcon: {
        css: {
          width: "18px",
          height: "16px",
        },
      },
    },
  };

  handleNewUserMessage = (newMessage, ownMessage) => {
    const { messages } = this.state;
    if (this.state.messages.length === 0) {
      this.setState({
        messages: [
          ...this.state.messages,
          { message: newMessage.text, isOwn: ownMessage },
        ],
      });
    }
    if (messages.length > 0) {
      this.setState({
        messages: [
          ...this.state.messages,
          { message: newMessage.text, isOwn: ownMessage },
          { message: "", isOwn: ownMessage },
        ],
      });
      this.fetchData(newMessage.value);
    }
  };

  handleClose = () => {
    this.setState({ messages: [] });
  };

  // sendToLex = (message) => {
  //   let params = {
  //     botAlias: 'CB_sampleBotAlias',
  //     botName: 'CB_sampleBot',
  //     inputText: message,
  //     userId: lexUserId,
  //   }
  //   lexRunTime.postText(params, (err, data) => {
  //     if(err){
  //         console.log(err);
  //     }
  //     if(data){
  //       if(data.responseCard && data.responseCard.version)
  //         console.log(data);

  //       let mesg = {message: data.message, isOwn:false};
  //       if(data.responseCard && data.responseCard.version){
  //         mesg.responseCard = data.responseCard;
  //       }
  //       const oldMessages = [...this.state.messages];
  //       oldMessages.splice(-1, 1);
  //       this.setState({messages:[...oldMessages, mesg]});
  //     }
  //   })
  // }

  filterAnswer = (result, response) => {
    console.log(result);
    if (result) {
      let outputString = result.replace(/\n/g, " <br/>");
      // Define the regular expression to match the pattern
      var regex = /(<br\s*\/?>\s*)(\d+\.\s(?:.{0,97}?:))/gs;

      // Apply bold tag to numbers followed by dot adjacent after <br/> tag
      outputString = outputString.replace(regex, function (match, p1, p2) {
        // Check if the captured string after the number with a dot is longer than 100 characters
        // If it is, do not apply bold. This is a safeguard, though the regex already limits the capture.
        if (p2.length > 70) {
          return match;
        }
        // Return the line break as is, and wrap the number, dot, and following text up to the colon in <b> tags
        return p1 + "<b>" + p2 + "</b>";
      });

      // let mssgObject = {};
      // mssgObject.id = uuidv4();
      // mssgObject.question = questionPromptTemp;
      var urlRegex = /(?:<|\()?((https?:\/\/[^\s<>\)]+))(?:>|\))?/g;

      // Function to replace the matched URL and surrounding characters
      function replaceURLsAndSurroundings(match, url) {
        return `<a href="${url}" style="color: blue; text-decoration: underline;" target="_blank">${url}</a>`;
      }

      // Replace URLs in the text, handling surrounding characters
      var formattedText = outputString.replace(
        urlRegex,
        replaceURLsAndSurroundings
      );

      // Find the index of "<br/>References:" in the paragraph content
      var startIndex = formattedText.indexOf("<br/>References:");

      // If "<br/>References:" is found
      if (startIndex !== -1) {
        // Extract the content starting from "<br/>References:"
        var referencesContent = formattedText.substring(startIndex);

        // Replace the "<br/>References:" with an empty string to remove it
        referencesContent = referencesContent.replace("<br/>References:", "");

        // Split the references content by "<br/>* " to create an array of references
        var referencesArray = referencesContent.split("<br/>* ");

        // Remove the first empty string element created by the split
        referencesArray.shift();

        // Create a new list element to hold the references
        var listElement = document.createElement("ul");

        // Loop through each reference and create a list item for it
        referencesArray.forEach(function (reference) {
          // Create a list item element
          var listItem = document.createElement("li");

          // Set the inner HTML of the list item to the reference content
          listItem.innerHTML = reference;

          // Append the list item to the list element
          listElement.appendChild(listItem);
        });

        // Replace the original paragraph content with the formatted list
        formattedText =
          formattedText.substring(0, startIndex) + listElement.outerHTML;
      }
      let mssgObject = {};
      mssgObject.answer = formattedText;
      // mssgObject.id = response.data.result.id;
      mssgObject.viewed = 1000;
      this.setState({
        chatResponse: [...this.state.chatResponse, mssgObject],
      });
      // console.log("formattedText", formattedText);
      return {
        formattedText: formattedText,
        // id: response.data.result.id,
      };
    }
  };

  fetchData = async (inputMessage) => {
    let mesg = {};
    try {
      const response = await axios.post(
        "https://prach-mortgage.onrender.com/api/get-answer",
        {
          question: inputMessage
        },
        {
        headers: {  
            "Content-Type": "application/json",
          },
        }
      );
      let result = response.data.answer;
      let sources = response.data.citation.map(c=>c.source)
      console.log(sources)
      if (result) {
        const { messages } = this.state;
        mesg = {
          message: this.filterAnswer(result, response).formattedText,
          sources: sources,
          isOwn: false,
          messageDate: new Date(),
          id: this.filterAnswer(result, response).id,
        };

        const oldMessages = [...messages];
        if (
          oldMessages.length > 0 &&
          oldMessages[oldMessages.length - 1].message === ""
        ) {
          oldMessages.splice(-1, 1);
        }
        const newMessages = oldMessages;
        if (Object.keys(mesg).length !== 0) {
          newMessages.push(mesg);
        }
        setTimeout(() => {
          this.setState(
            { messages: newMessages, isEncryptionNeeded: false },
            () => {
              // focusInChatbot();
            }
          );
        }, 100);
      }
    } catch (error) {
      // Handle error
      console.error(error);
    }
  };

  addMessages = (data) => {
    this.setState({
      messages: [
        ...this.state.messages,
        { message: data.inputTranscript, isOwn: true },
        { message: data.message, isOwn: false },
      ],
    });
  };

  render() {
    return (
      <ThemeProvider theme={this.theme}>
        <div style={{}}>
          <FixedWrapper.Root>
            <FixedWrapper.Maximized
             className={`main-wrapper ${deviceOS === 'IOS' ? 'device-iphone' : ''}`}

            >
              <Maximized
                messages={this.state.messages}
                chatResponse={this.state.chatResponse}
                handleMessage={this.handleNewUserMessage}
                addMessages={this.addMessages}
                handleClose={this.handleClose}
                {...this.props}
              />
            </FixedWrapper.Maximized>
            <FixedWrapper.Minimized className="main-wrapper-minimize">
              <Minimized {...this.props} />
            </FixedWrapper.Minimized>
          </FixedWrapper.Root>
        </div>
      </ThemeProvider>
    );
  }
}

export default App;
