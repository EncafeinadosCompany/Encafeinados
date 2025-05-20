export const setAuthStorage = (token: string, user: any) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
}


export const setAuthStorageGoogle = (token: string, user: any) => {
    localStorage.setItem('token', token);

    const data = {
        email: user.email,
        role: user.role.name,
    };
    localStorage.setItem('user', JSON.stringify(data));
}

export const clearAuthStorage = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('storeOrBranchId');
    localStorage.removeItem('userId')
}

export const getAuthStorage = () => {
    return {
        token: localStorage.getItem('token'),
        user: JSON.parse(localStorage.getItem('user') || 'null'),
        storeOrBranch:localStorage.getItem('storeOrBranchId') 
    };
};