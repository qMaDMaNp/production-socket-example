const crypto = require('crypto');

export const getObjectByKeyValue = (arr, value, key = 'id') => {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][key] === value) return arr[i];
    }

    return null;
}

export const getObjectIndexByKeyValue = (arr, value, key = 'id') => {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][key] === value) return i;
    }

    return null;
}

export const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0,
            v = c === 'x' ? r : r & 0x3 | 0x8;
        return v.toString(16);
    });
}

export const formQuery = (params) => {
    return Object.keys(params).reduce(function(a,k){a.push(k+'='+params[k]);return a},[]).join('&');
}

export const formSignature = (params, secretKey) => {
    return crypto.createHmac('sha256', secretKey).update(params).digest('hex');
}

export const removeEmptyProperties = (obj) => {
    return Object.fromEntries(
        Object.entries(obj)
            .filter(([_, v]) => v != null)
            .map(([k, v]) => [k, v === Object(v) ? removeEmptyProperties(v) : v])
    );
}

export const formatTime = (date = new Date()) => {
    let fullDate = new Date(date),
      h = fullDate.getHours().toString(),
      m = fullDate.getMinutes().toString();
    h = h.length === 1 ? `0${h}` : h;
    m = m.length === 1 ? `0${m}` : m;
  
    return `${h}:${m}`;
  };