import { workerMessages } from '../../constants/constants'; 

const getRandomLocationListener = (worker, resolve) => {

	return function onWorkerEvent(event) {

		const eventData = event.data; 

		const { message, payload } = eventData; 

		if (workerMessages.RANDOM_LOCATION_CHOSEN === message) {

			worker.removeEventListener('message', onWorkerEvent); 

			resolve(payload); 

		}

	}; 

}; 

const getRandomLocationFromWorker = function getRandomLocationFromWorker(worker, newTurn = false) {

	return new Promise(resolve => {

		const randomLocationListener = getRandomLocationListener(worker, resolve); 

		worker.addEventListener('message', randomLocationListener); 

		worker.postMessage({

			message: workerMessages.GET_RANDOM_LOCATION, 
			
			payload: {
				newTurn
			}

		}); 

	}); 

}; 

export default getRandomLocationFromWorker; 
