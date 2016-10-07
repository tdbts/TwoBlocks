self.addEventListener('message', function (e) {
	
	self.postMessage("Heard dis:" + e.data); 

}); 
