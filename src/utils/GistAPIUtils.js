import request from 'superagent';
import cookies from 'cookies-js';
import config from '../config';

const GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize';
const COOKIE_TTL = 60 * 60 * 24 * 30 // 30 days

export function authorize () {
    window.open(`${GITHUB_AUTH_URL}?client_id=${config.GITHUB_CLIENT_ID}&scope=gist`);
}

export function getAccessToken (code, callback) {
    if (!code) {
        const err = new Error('Impossible to get access token, code is not present');
        return callback(err);
    }
    request
        .get(config.GATEKEEPER)
        .query({ code })
        .end((err, res) => {
            if (err) {
                callback(err);
            }

            const token = res.text;
            cookies.set('oauth_token', token, {expires: COOKIE_TTL});
            callback(null);
        })
}

export function isAuthorized () {
    return cookies.get('oauth_token') || false;
}
