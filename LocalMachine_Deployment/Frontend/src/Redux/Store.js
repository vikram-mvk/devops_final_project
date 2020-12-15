import {createStore,combineReducers,applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk'
import reducer from './Reducers';
import {loadState,saveState} from './persistStore'

const persistedStore = loadState();

 export const store = createStore(reducer,persistedStore,applyMiddleware(thunkMiddleware))

store.subscribe(() =>{ 
    console.log(`updated state`, store.getState())
    saveState(store.getState());
})


