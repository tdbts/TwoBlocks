import actions from '../../actions/actions';
import createVisibilityReducer from '../reducer-utils/createVisibilityReducer';

export default createVisibilityReducer(actions.SHOW_MARKER, actions.HIDE_MARKER);
