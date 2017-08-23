import actions from '../actions';

const type = actions.THROW_ERROR;

export default error => ({ type, error });
