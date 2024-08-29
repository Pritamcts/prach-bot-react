import * as React from 'react'
import { isMobile, isIOS } from 'react-device-detect';
import { IconButton, ChatIcon } from '@livechat/ui-kit'
import widgetIcon from '../../images/chatIcon.png'

const Minimized = ({ maximize }) => {

	const getDeviceType = () => {
		const ua = navigator.userAgent;
		if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
		  return 'tablet';
		}
		if (
		  /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
			ua
		  )
		) {
		  return 'mobile';
		}
		return 'desktop';
	  };
	  const chatIconClicked = () => {
		if (typeof window !== 'undefined') {
		  if (window.parentIFrame) {
			window.parentIFrame.getPageInfo((obj) => {
			  const winHeight = (obj.windowHeight * 99) / 100;
			  if (getDeviceType() === 'mobile') {
				window.parentIFrame.size(winHeight, obj.windowWidth);
			  } else {
				window.parentIFrame.size(winHeight, 470);
			  }
			  if (!isMobile && !isIOS) {
				document
				  .getElementsByClassName('main-wrapper')[0]
				  .setAttribute('style', 'width: 95vw !important; height: 94vh !important;');
				document.getElementsByClassName('main-wrapper')[0].style.width = '95vw !important';
				document
				  .getElementsByClassName('main-container')[0]
				  .setAttribute('style', 'width: 95vw !important; height: 94vh !important;');
				document.getElementsByClassName('main-container')[0].style.width = '95vw !important';
				document.getElementsByClassName('main-wrapper')[0].style.height = '95vh !important';
				document.getElementsByClassName('main-container')[0].style.height = '95vh !important';
			  }
			});
		  }
		}
		maximize();
	  };
	return (

	<div
		onClick={chatIconClicked}
		style={{
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			width: '30px',
			height: '30px',
			// background: '#F5821F',
			// color: '#fff',
			borderRadius: '50%',
			cursor: 'pointer',
		}}
	>
		<IconButton style={{background: '#0092bd', borderRadius: '50%', border: '2px solid #80c466'}}>
			{/* <ChatIcon /> */}
			<img src={widgetIcon} alt="chatbot" width='60' height='60' tabIndex="0" />
		</IconButton>
	</div>
	)
}

export default Minimized