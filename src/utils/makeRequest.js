/* global ActiveXObject, XMLHttpRequest */

const makeRequest = function makeRequest(url) {

	return new Promise((resolve, reject) => {

		let xhr = null; 

		if (XMLHttpRequest) {

			xhr = new XMLHttpRequest(); 

		} else {

			const activeXVersions = [
				"MSXML2.XmlHttp.5.0", 
				"MSXML2.XmlHttp.4.0",
				"MSXML2.XmlHttp.3.0", 
				"MSXML2.XmlHttp.2.0",
				"Microsoft.XmlHttp"
			];

			for (let i = 0, len = activeXVersions.length; i < len; i++) {

				try {

					xhr = new ActiveXObject(activeXVersions[i]); 
					
					break; 

				} catch (ignore) {}  // eslint-disable-line no-unused-vars, no-empty 

			}

		}

		const ensureReadiness = function ensureReadiness(xhr) {
		
			return () => {

				if (xhr.readyState < 4) return; 

				if (xhr.status !== 200) return; 

				if (xhr.status >= 400) {

					reject(xhr); 

					return; 

				}

				if (xhr.readyState === 4) {

					resolve(xhr); 

					return; 

				}

			}; 
		
		}; 

		xhr.onreadystatechange = ensureReadiness(xhr); 

		/*----------  Make Request  ----------*/
		
		xhr.open('GET', url, true); 
		xhr.send(''); 

	}); 

}; 

export default makeRequest; 
