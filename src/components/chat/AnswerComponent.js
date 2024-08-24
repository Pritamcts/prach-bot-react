import { useEffect, useState } from "react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";

const AnswerComponent = ({ answer, obj }) => {
  const lastWordStringIndex = answer.substring(0, obj.viewed);
  const [displayedText, setDisplayedText] = useState("");
  const checkAnchorTagInText = (text, extract) => {
    // Check if we're cutting off inside an <a> tag
    const lastOpenTag = extract.lastIndexOf("<a");
    const lastCloseTag = extract.lastIndexOf("</a>");

    // If there's an opening tag after the last closing tag, we're cutting off inside a tag
    if (lastOpenTag > lastCloseTag) {
      // Find the end of the <a> tag in the original text
      const endOfTag = text.indexOf("</a>", lastOpenTag);

      // If endOfTag is not found, something went wrong, return the initial extract
      if (endOfTag === -1) {
        return extract;
      }

      // Adjust the extract to include the full <a> tag
      extract = text.substring(0, endOfTag + 4);
    }
    return extract;
  };
  useEffect(() => {
    setDisplayedText(
      checkAnchorTagInText(
        answer,
        answer.substring(0, lastWordStringIndex.lastIndexOf(" "))
      )
    );
  }, [answer]);
  const [textLength, setTextLength] = useState(
    lastWordStringIndex.lastIndexOf(" ")
  );
  const [showMore, setShowMore] = useState(answer.length > 999);
  const handleShowMore = () => {
    const nextViewed = textLength + 1000;
    const substring = answer.substring(0, nextViewed);
    const lastSpaceIndexInString = substring.lastIndexOf(" ");

    if (answer.length - nextViewed < 100) {
      // setDisplayedText(answer.substring(0, answer.length));
      setDisplayedText(
        checkAnchorTagInText(answer, answer.substring(0, answer.length))
      );
      setShowMore(false);
      setTextLength(answer.length);
    } else {
      // setDisplayedText(answer.substring(0, lastSpaceIndexInString));
      setDisplayedText(
        checkAnchorTagInText(
          answer,
          answer.substring(0, lastSpaceIndexInString)
        )
      );
      setShowMore(displayedText.length < answer.length);
      setTextLength(lastSpaceIndexInString);
    }
  };

  return (
    <div>
      <Markdown rehypePlugins={[rehypeRaw]}>{displayedText}</Markdown>
      {showMore && (
        <>
          <button
            style={{
              fontWeight: "600",
              minHeight: "fit-content",
              height: "fit-content",
              padding: "10px",
              backgroundColor: "white",
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              border: "1px solid #DDDDDD",
              borderRadius: "10px",
              marginTop: "10px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              cursor: "pointer",
            }}
            onClick={handleShowMore}
          >
            Show More
            <span style={{ display: "flex" }}>
              <div
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  backgroundColor: "#ff659b",
                  marginRight: "2px",
                }}
              ></div>
              <div
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  backgroundColor: "#52e3ff",
                  marginRight: "2px",
                }}
              ></div>
              <div
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  backgroundColor: "#a3a3a3",
                  marginRight: "2px",
                }}
              ></div>
            </span>
          </button>
        </>
      )}
    </div>
  );
};

export default AnswerComponent;
