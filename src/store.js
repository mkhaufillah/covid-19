"use strict";

export const setStore = (key, val) => {
    if (typeof (Storage) !== "undefined") {
        localStorage.setItem(key, val);
    } else {
        throw 'Gagal menyimpan data di store';
    }
}

export const getStore = (key) => {
    if (typeof (Storage) !== "undefined") {
        return localStorage.getItem(key);
    } else {
        return undefined;
    }
}