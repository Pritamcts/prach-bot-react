export const focusInChat = () => {
    const messageGroup = document.getElementById('messageGroup');
    const messageTextarea = document.getElementById('messageText');

    const messageContainer = document.getElementById('messageContainer');
        if (messageContainer) {
          messageContainer.scrollTop =
            messageContainer.scrollHeight - messageContainer.clientHeight;
        }
    if (
      messageGroup &&
      messageGroup.lastChild.lastElementChild.querySelectorAll('.quick-replies').length > 0
    ) {
      messageGroup.lastChild.lastElementChild
        .querySelectorAll('.quick-replies')[0]
        .firstChild.focus();
    } else if (messageTextarea) {
      messageTextarea.focus();
    }
  };