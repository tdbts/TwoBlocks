import actions from '../../actions/actions';
import createVisibilityReducer from '../reducer-utils/createVisibilityReducer';

export default createVisibilityReducer(actions.SHOW_PANORAMA, actions.HIDE_PANORAMA);
