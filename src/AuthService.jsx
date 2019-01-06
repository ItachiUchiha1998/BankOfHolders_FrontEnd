import React from 'react';
import decode from 'jwt-decode';
import config from './client-config';

export default class AuthService {
    constructor() {
        this.domain = config.API_BASE;
        this.fetch = this.fetch.bind(this);
        this.login = this.login.bind(this);
        this.getProfile = this.getProfile.bind(this);
    }

    login(username, password) {
        return this.fetch('signin', {
            method: 'POST',
            body: JSON.stringify({
                username: username,
                password: password
            })
        }).then(res => {
            if(!res.token){
                return Promise.reject(res);
            }else{
                this.setToken(res.token);
                return Promise.resolve(res);
            }
        })
    }

    loggedIn() {
        const token = this.getToken();
        return !!token && !this.isTokenExpired(token);
    }

    isTokenExpired(token) {
        try {
            const decoded = decode(token);
            if (decoded.exp < Date.now() / 1000) {
                return true;
            }
            else
                return false;
        }
        catch (err) {
            return false;
        }
    }

    setToken(idToken) {
        localStorage.setItem('id_token', idToken);
    }

    getToken() {
        return localStorage.getItem('id_token')
    }

    logout() {
        localStorage.removeItem('id_token');
    }

    getProfile() {
        return decode(this.getToken());
    }


    fetch(url, options) {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        if (this.loggedIn()) {
            headers['Authorization'] = this.getToken()
        }
        return fetch(this.domain+'/'+url, {
            headers,
            ...options
        })
            .then(this._checkStatus)
            .then(response => response.json())
    }

    _checkStatus(response) {
        if (response.status >= 200 && response.status < 300) { // Success status lies between 200 to 300
            return response
        }else{
            var error = new Error(response.statusText);
            throw error;
        }
    }
}