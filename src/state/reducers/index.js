import { combineReducers } from 'redux';
import currencyMaintained from './currencyMaintained';
import categoryIn from './categoryIn'


const reducers = combineReducers({
    currency: currencyMaintained,
    categoryIn: categoryIn,
});

export default reducers;