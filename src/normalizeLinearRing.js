/* global window */

const normalizeLinearRing = function normalizeLinearRing(ring) {

	for (let i = 0; i < ring[ring.length - 1].length; i++) {

		if (ring[ring.length - 1][i] !== ring[0][i]) {

			window.console.warn("First and last positions of linear ring are not equivalent.  Modifying data to make them equivalent.");
			window.console.warn("ring[ring.length - 1][i]:", ring[ring.length - 1][i]); 
			window.console.warn("ring[0][i]:", ring[0][i]);  

			ring[ring.length - 1][i] = ring[0][i]; 

		}

	}

}; 

export default normalizeLinearRing; 
