let paused, telegram;
const button = document.getElementById('button1');

const handleState = state => {
	if(paused){
		button.innerHTML = 'Run';
	}else{
		button.innerHTML = 'Stop';			
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

button.onclick = toggleState;
