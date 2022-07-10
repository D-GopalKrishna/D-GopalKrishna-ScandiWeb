

const reducer = (state='$', action) => {
    switch (action.type) {
        case 'currencyMaintained':
            return action.payload
        default:
            return state;
    }
}


export default reducer;