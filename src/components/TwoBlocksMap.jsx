/* eslint-disable */
import React from 'react'; 
import GoogleMap from './GoogleMap'; 
import getViewLayerClassName from './component-utils/getViewLayerClassName'; 

const MAP_CLASS_NAME = "two-blocks-map"; 

/*----------  Component  ----------*/

class TwoBlocksMap extends React.Component {

	shouldComponentUpdate(prevProps) {

		const { config, mapType } = prevProps; 

		return (this.props.config !== config) || (this.props.mapType !== mapType);  // Only the 'config' and 'mapType' props ever change for the child component maps.  Only update if one of them has changed.  

	}
	
	render() {

		const { blockLevelMap, boroughLevelMap, cityLevelMap, config, onMapMounted, mapType, twoBlocksClass, view } = this.props; 

		return (

			<div className={ getClassName(twoBlocksClass, view) }>
				<GoogleMap 
					className={ getViewLayerClassName(MAP_CLASS_NAME, (mapType === 'city-level')) }
					config={ config ? config.cityLevelMap : null }
					mapInstance={ cityLevelMap }
					mapType={ 'city-level' }
					onRef={ onMapMounted }
					visible={ mapType === 'city-level' }
				/>
				<GoogleMap 
					className={ getViewLayerClassName(MAP_CLASS_NAME, (mapType === 'borough-level')) }
					config={ config ? config.boroughLevelMap : null }
					mapInstance={ boroughLevelMap }
					mapType={ 'borough-level' }
					onRef={ onMapMounted }
					visible={ mapType === 'borough-level' }
				/>
				<GoogleMap 
					className={ getViewLayerClassName(MAP_CLASS_NAME, (mapType === 'block-level')) }
					config={ config ? config.mapLevelMap : null }
					mapInstance={ blockLevelMap }
					mapType={ 'block-level' }
					onRef={ onMapMounted }
					visible={ mapType === 'block-level' }
				/>
			</div>

		); 

	}

}

/*----------  getClassName()  ----------*/

	const getClassName = function getClassName(twoBlocksClass, view) {

		const visibilityClass = 'map' === view ? 'visible' : 'offscreen'; 

		return [
		
			twoBlocksClass, 
			"full-dimensions", 
			visibilityClass

		].join(" "); 

	};

export default TwoBlocksMap; 
