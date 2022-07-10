
export const currencyMaintained = (res_json_space) => {
    return (dispatch) => {
        dispatch({
            type: 'currencyMaintained',
            payload: res_json_space
        });
    }
}



export const categoryIn = (res_json_space) => {
    return (dispatch) => {
        dispatch({
            type: 'categoryIn',
            payload: res_json_space
        });
    }
}


