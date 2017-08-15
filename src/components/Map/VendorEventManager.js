export default class MapVendorEventManager {

	constructor(mapComponent) {

		this._mapComponent = mapComponent;

		this._mapEvents = {
			CLICK: 'click',
			MOUSEOUT: 'mouseout',
			MOUSEOVER: 'mouseover'
		};

	}

	_onMapClick(borough) {

		const { selectedBorough, setSelectedBorough } = this._mapComponent.props;

		if (selectedBorough && borough && (selectedBorough.getID() === borough.getID())) return;

		setSelectedBorough(borough);

	}

	_onMapMouseout() {

		const { clearHoveredBorough, hoveredBorough } = this._mapComponent.props;

		if (!(hoveredBorough)) return;

		clearHoveredBorough();

	}

	_onMapMouseover(borough) {

		const { hoveredBorough, selectedBorough, setHoveredBorough } = this._mapComponent.props;

		if (hoveredBorough && borough && (hoveredBorough.getID() === borough.getID())) return;

		if (selectedBorough && borough && (borough.getID() === selectedBorough.getID())) return;

		setHoveredBorough(borough);

	}

	/*----------  Public API  ----------*/
	
	assignListeners() {

		if (this._mapComponent.props.isMobile) return;

		const maps = this._mapComponent.getMaps();

		const { CLICK, MOUSEOUT, MOUSEOVER } = this._mapEvents;

		maps.on(CLICK, borough => this._onMapClick(borough));
		
		maps.on(MOUSEOUT, borough => this._onMapMouseout(borough));
		
		maps.on(MOUSEOVER, borough => this._onMapMouseover(borough));

	}

}
