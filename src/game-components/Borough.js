import { boroughNames } from '../constants/constants';

export default class Borough {

	/**
	 *
	 * Sometimes the feature is known, but not the 
	 * borough name.  Sometimes the borough name is 
	 * known, but not the feature.  Handle both cases.
	 *
	 */
	
	constructor(indicator) {

		this._validateIndicator(indicator);

		this._feature = this._setFeatureFromIndicator(indicator);
		this._id = this._setIDFromIndicator(indicator);

	}

	_getIDFromFeature() {

		let id = null;

		if (this.getFeature().properties) {

			id = this.getFeature().properties.boro_name;

		} else if (this.getFeature().getProperty) {

			id = this.getFeature().getProperty('boro_name');

		}

		return id;		

	}

	_checkIfValidBorough(str) {

		return boroughNames.some(name => str === name);

	}

	_setFeatureFromIndicator(indicator) {

		return ('object' === typeof indicator ? indicator : null);

	}

	_setIDFromIndicator(indicator) {

		return ('string' === typeof indicator) ? indicator : this._getIDFromFeature();

	}

	_validateID(id) {

		if (!(this._checkIfValidBorough(id))) {

			throw new Error("Invalid borough name.");

		}

	}

	_validateIndicator(indicator) {

		if (!(indicator) || (('string' !== typeof indicator) && ('object' !== typeof indicator))) {

			throw new Error("Invalid indicator.");
			
		}

		if ('string' === typeof indicator) {

			this._validateID(indicator);

		}

	}

	/*----------  Public API  ----------*/
	
	getFeature() {

		return this._feature;

	}

	getID() {

		return this._id;

	}

	getName() {

		return ('Bronx' === this.getID()) ? "The " + this.getID() : this.getID();

	}

	setFeature(feature) {

		this._feature = feature;

	}

}
