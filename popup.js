let paused, telegram, download;
const toggler = document.getElementById('toggler');
const downloadAll = document.getElementById('downloadAll');

const handleState = state => {
	if(paused){
		toggler.innerHTML = 'Run';
	}else{
		toggler.innerHTML = 'Stop';			
	}	
}

const toggleState = event => {
	paused = !paused;
	chrome.storage.local.set({paused});
//	chrome.runtime.sendMessage({paused});
	chrome.tabs.query({active: true, currentWindow: true}, tabs => chrome.tabs.sendMessage(tabs[0].id, {paused}));
	handleState();
}


chrome.storage.local.get(state => {
	paused = state.paused;
	handleState();
});

toggler.onclick = toggleState;
downloadAll.onclick = event => chrome.tabs.query({active: true, currentWindow: true}, tabs => chrome.tabs.sendMessage(tabs[0].id, {download: true}));
