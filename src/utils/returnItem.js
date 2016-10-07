function returnItem(item) {
	return function () {
		return item; 
	};
}

export default returnItem;
