/* eslint-disable */

import React from 'react'; 
import Map from './Map'; 
import getViewLayerClassName from './component-utils/getViewLayerClassName'; 

const MAP_CLASS_NAME = "two-blocks-map"; 

/*----------  Component  ----------*/

class TwoBlocksMap extends React.Component {

	shouldComponentUpdate(prevProps) {

		const { config, mapType } = this.props; 

		return (config !== prevProps.config) || (mapType !== prevProps.mapType);  // Only the 'config' and 'mapType' props ever change for the child component maps.  Only update if one of them has changed.  

	}
	
	render() {

		const { blockLevelMap, boroughLevelMap, cityLevelMap, config, onMapMounted, mapType, twoBlocksClass, visible } = this.props; 

		return (

			<div className={ getClassName(twoBlocksClass, visible) }>
				<Map 
					className={ [ "two-blocks-city-map", getViewLayerClassName(MAP_CLASS_NAME, (mapType === 'city')) ].join(' ') }
					config={ config ? config.cityLevelMap : null }
					mapInstance={ cityLevelMap }
					mapType={ 'city' }
					onRef={ onMapMounted }
					visible={ mapType === 'city' }
				/>
				<Map 
					className={ [ "two-blocks-borough-map", getViewLayerClassName(MAP_CLASS_NAME, (mapType === 'borough')) ].join(' ') }
					config={ config ? config.boroughLevelMap : null }
					mapInstance={ boroughLevelMap }
					mapType={ 'borough' }
					onRef={ onMapMounted }
					visible={ mapType === 'borough' }
				/>
				<Map 
					className={ [ "two-blocks-block-map", getViewLayerClassName(MAP_CLASS_NAME, (mapType === 'block')) ].join(' ') }
					config={ config ? config.mapLevelMap : null }
					mapInstance={ blockLevelMap }
					mapType={ 'block' }
					onRef={ onMapMounted }
					visible={ mapType === 'block' }
				/>
			</div>

		); 

	}

}

/*----------  getClassName()  ----------*/

	const getClassName = function getClassName(twoBlocksClass, visible) {

		const visibilityClass = visible ? 'visible' : 'offscreen'; 

		return [
		
			twoBlocksClass, 
			"full-dimensions", 
			visibilityClass

		].join(" "); 

	};

export default TwoBlocksMap; 
