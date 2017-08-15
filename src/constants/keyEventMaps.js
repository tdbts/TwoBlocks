const arrowKeyHoverMap = {
	"Bronx": {
		"ArrowDown": ["Manhattan", "Queens"], 
		"ArrowLeft": ["Manhattan"], 
		"ArrowRight": ["Queens"]
	}, 
	"Manhattan": {
		"ArrowUp": ["Bronx"], 
		"ArrowRight": ["Queens", "Brooklyn"], 
		"ArrowDown": ["Brooklyn", "Staten Island"] 
	}, 
	"Queens": {
		"ArrowUp": ["Bronx"], 
		"ArrowLeft": ["Manhattan"], 
		"ArrowDown": ["Brooklyn"]
	}, 
	"Brooklyn": {
		"ArrowUp": ["Queens", "Manhattan"], 
		"ArrowLeft": ["Manhattan"], 
		"ArrowRight": ["Queens"], 
		"ArrowDown": ["Staten Island"]
	}, 
	"Staten Island": {
		"ArrowRight": ["Brooklyn"], 
		"ArrowUp": ["Brooklyn", "Manhattan"]
	}
}; 

const firstArrowKeyPressBoroughMap = {
	"ArrowUp": ["Bronx"], 
	"ArrowLeft": ["Manhattan"], 
	"ArrowRight": ["Brooklyn", "Queens"], 
	"ArrowDown": ["Staten Island", "Brooklyn"]
}; 

const keyEventMaps = {
	arrowKeyHoverMap, 
	firstArrowKeyPressBoroughMap
}; 

export default keyEventMaps; 
