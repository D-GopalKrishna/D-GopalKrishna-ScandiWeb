

const reducer = (state='all', action) => {
    switch (action.type) {
        case 'categoryIn':
            return action.payload
        default:
            return state;
    }
}


export default reducer;