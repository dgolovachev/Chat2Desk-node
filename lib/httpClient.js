const request = require('request');

class HttpClient {
    constructor(token) {
        if (!token) throw 'HttpClient token is undefined';
        this.token = token;
    }

    Get(url) {
        return new Promise(async (resolve, reject) => {
            try {
                let options = {
                    method: 'GET',
                    url: url,
                    headers: { 'Content-Type': 'application/json', Authorization: this.token },
                    json: true
                };
                request(options, (error, response, body) => {
                    if (error) return reject(error);
                    resolve(body);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    Post(url, data) {
        return new Promise(async (resolve, reject) => {
            try {
                let options = {
                    method: 'POST',
                    url: url,
                    headers: { 'Content-Type': 'application/json', Authorization: this.token },
                    body: data,
                    json: true
                };
                request(options, (error, response, body) => {
                    if (error) return reject(error);
                    resolve(body);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    Put(url, data) {
        return new Promise(async (resolve, reject) => {
            try {
                let options = {
                    method: 'PUT',
                    url: url,
                    headers: { 'Content-Type': 'application/json', Authorization: this.token },
                    body: data,
                    json: true
                };
                request(options, (error, response, body) => {
                    if (error) return reject(error);
                    resolve(body);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    Delete(url, data = {}) {
        return new Promise(async (resolve, reject) => {
            try {
                let options = {
                    method: 'DELETE',
                    url: url,
                    headers: { 'Content-Type': 'application/json', Authorization: this.token },
                    body: data,
                    json: true
                };
                request(options, (error, response, body) => {
                    if (error) return reject(error);
                    resolve(body);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

}

module.exports = HttpClient;