const arrowKeyHoverMap = {
	"Bronx": {
		"ArrowDown": ["Manhattan", "Queens"], 
		"ArrowLeft": ["Manhattan"], 
		"ArrowRight": ["Queens"]
	}, 
	"Manhattan": {
		"ArrowUp": ["Bronx"], 
		"ArrowRight": ["Queens"], 
		"ArrowDown": ["Brooklyn"] 
	}, 
	"Queens": {
		"ArrowUp": ["Bronx"], 
		"ArrowLeft": ["Manhattan"], 
		"ArrowDown": ["Brooklyn"]
	}, 
	"Brooklyn": {
		"ArrowUp": ["Queens"], 
		"ArrowLeft": ["Manhattan"], 
		"ArrowRight": ["Queens"], 
		"ArrowDown": ["Staten Island"]
	}, 
	"Staten Island": {
		"ArrowRight": ["Brooklyn"], 
		"ArrowUp": ["Brooklyn"]
	}
}; 

const firstArrowKeyPressBoroughMap = {
	"ArrowUp": ["Bronx"], 
	"ArrowLeft": ["Manhattan"], 
	"ArrowRight": ["Queens"], 
	"ArrowDown": ["Brooklyn", "Staten Island"]
}; 

const keyEventMaps = {
	arrowKeyHoverMap, 
	firstArrowKeyPressBoroughMap
}; 

export default keyEventMaps; 
