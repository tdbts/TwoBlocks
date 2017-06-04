import actions from '../../actions/actions';
import createVisibilityReducer from '../reducer-utils/createVisibilityReducer';

export default createVisibilityReducer(actions.SHOW_MAP, actions.HIDE_MAP);
