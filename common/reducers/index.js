import {combineReducers} from 'redux';
import {
  ADD_USER,LOG_OUT,REQUEST_PROPERTY,RECEIVE_PROPERTY,RECEIVE_BUNDLES,REQUEST_BUNDLES,
  REQUEST_USER,RECEIVE_USER
} from '../actions/actions';

function user(state={
    isRequesting: false,
    userName: "",
    addedUser: ""
},action){
    switch(action.type){
        case ADD_USER:
            return Object.assign({}, state, {
                addedUser: action.userName
            });
        case LOG_OUT:
            return state;
        case REQUEST_USER:
            return Object.assign({}, state, {
                isRequesting: true
            });
        case RECEIVE_USER:
            return Object.assign({}, state, action.user);
        default:
            return state;
    }
}
function propertys(state = {
    isRequesting: false,
    items: []
}, action){
    switch(action.type){
        case REQUEST_PROPERTY:
            return Object.assign({}, state, {
                isRequesting: true
            })
        case RECEIVE_PROPERTY:
            return Object.assign({}, state, {
                isRequesting: false,
                items: action.propertys,
                lastUpdated: action.receivedAt
            })
        default:
            return state;
    }
}

function bundles(state={
    isRequesting: false,
    bundlelists: []
},action){
    switch(action.type){
        case REQUEST_BUNDLES:
            return Object.assign({}, state, {
                isRequesting: true
            })
        case RECEIVE_BUNDLES:
            return Object.assign({}, state, {
                isRequesting: false,
                bundlelists: action.bundles,
                lastUpdated: action.receivedAt
            })
        default:
            return state; 

    }
}


const rootReducer = combineReducers({
    user,
    propertys,
    bundles
})

export default rootReducer;