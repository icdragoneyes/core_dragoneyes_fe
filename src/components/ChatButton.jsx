import React, { useState, useEffect } from "react";
import chatIcon from "../assets/img/chat.png";
import dwnArrow from "../assets/img/arrow.png";

const ChatButton = ({ groupUrl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://telegram.org/js/telegram-widget.js?22";
      script.setAttribute("data-telegram-discussion", `${groupUrl}`);
      script.setAttribute("data-comments-limit", "5");
      script.setAttribute("data-color", "ee5151");
      script.setAttribute("data-dark-color", "F0B138");
      const widgetContainer = document.getElementById("telegram-widget");
      widgetContainer.appendChild(script);

      const handleScroll = () => {
        const isAtBottom = widgetContainer.scrollHeight - widgetContainer.scrollTop <= widgetContainer.clientHeight + 1;
        setIsAtBottom(isAtBottom);
      };

      widgetContainer.addEventListener("scroll", handleScroll);

      return () => {
        widgetContainer.innerHTML = "";
        widgetContainer.removeEventListener("scroll", handleScroll);
      };
    }
  }, [isOpen, groupUrl]);

  const handleToBottom = () => {
    console.log("scrolled");
    const widgetContainer = document.getElementById("telegram-widget");
    widgetContainer.scrollTop = widgetContainer.scrollHeight;
    setIsAtBottom(true);
  };

  return (
    <div>
      {isOpen && (
        <>
          <div id="telegram-widget" className="absolute bottom-20 sm:right-5 right-0 sm:w-96 w-full sm:h-96 h-96 overflow-y-auto bg-white border border-gray-300 rounded-lg z-50" style={{ scrollBehavior: "smooth" }}></div>
          {!isAtBottom && (
            <button onClick={handleToBottom} className="absolute bottom-28 sm:right-12 right-5 bg-[#ee5151] p-2 rounded-full z-50">
              <img src={dwnArrow} alt="" className="w-3 h-3" />
            </button>
          )}
        </>
      )}
      <button onClick={() => setIsOpen(!isOpen)} className="fixed bottom-5 right-5 bg-[#ee5151] text-white p-4 rounded-full hover:bg-[#ee5555] transition duration-200 z-50">
        <img src={chatIcon} alt="Chat" className="w-6 h-6" />
      </button>
    </div>
  );
};

export default ChatButton;
