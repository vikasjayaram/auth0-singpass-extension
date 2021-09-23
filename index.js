var express = require('express');
var Webtask = require('webtask-tools');
var bodyParser = require('body-parser');
const { SignJWT } = require('jose/jwt/sign');
const { parseJwk } = require('jose/jwk/parse');
const { jwtVerify } = require('jose/jwt/verify')
const crypto = require("crypto");
const uuid = require("uuid");
const axios = require("axios").default;
const qs = require('qs');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/authorize', (req, res) => {
    const context = req.webtaskContext;
    let nonce = crypto.randomBytes(16).toString('base64');
    var url = `https://${context.data.AUTH0_CUSTOM_DOMAIN}${req.url}&ndi_state=${req.query.state}&ndi_nonce=${nonce}&singpass=true`;
    res.redirect(url);
});

app.post('/token', async function (req, res) {
    const context = req.webtaskContext;
    const { code, redirect_uri } = req.body;
    const client_assertion = await generatePrivateKeyJWT(context.data);
    var options = {
        method: 'POST',
        url: context.data.IDP_TOKEN_ENDPOINT,
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        data: qs.stringify({
            grant_type: 'authorization_code',
            client_id: context.data.CLIENT_ID,
            client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
            client_assertion: client_assertion,
            code: code,
            redirect_uri: redirect_uri
        })
    };
    console.log(options.data);
    try {
        const response = await axios.request(options);
        console.log(response.data);
        const { id_token } = response.data;
        const publicKey = await loadPublicKey(context.data);
        const { payload, protectedHeader } = await jwtVerify(id_token, publicKey, {
            issuer: context.data.ISSUER,
            audience: context.data.CLIENT_ID
        })

        console.log(protectedHeader);
        console.log(payload);
        response.data.payload = payload;
        return res.status(200).send(response.data);
    } catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
            return res.status(error.response.status).send(error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
    }
});

async function loadPrivateKey(config) {
    try {
        const response = await axios.get(config.RELYING_PARTY_JWKS_ENDPOINT);
        const { keys } = response.data;
        keys[0].d = config.RELYING_PARTY_PRIVATE_KEY;
        return await parseJwk(keys[0], config.IDP_SIGNING_ALG);;
    } catch (e) {
        return e;
    }
};

async function loadPublicKey(config) {
    try {
        const response = await axios.get(config.IDP_JWKS_ENDPOINT);
        console.log(response.data.keys);
        const publicKey = await parseJwk(response.keys[0], config.IDP_SIGNING_ALG);
        return publicKey;
    } catch (e) {
        return e;
    }
};

async function generatePrivateKeyJWT(config) {
    //const privateKeyPEM = crypto.createPrivateKey(config.PRIVATE_KEY.replace(/\\n/gm, '\n'));
    const key = await loadPrivateKey(config);
    const jwt = await new SignJWT({})
        .setProtectedHeader({ alg: config.IDP_SIGNING_ALG, kid: config.RELYING_PARTY_KID, typ: "JWT" })
        .setIssuedAt()
        .setIssuer(config.CLIENT_ID)
        .setSubject(config.CLIENT_ID)
        .setAudience(config.AUDIENCE)
        .setExpirationTime('2m') //The expiration time on or after which the JWT MUST NOT be accepted by NDI for processing. Additionally, NDI will not accept tokens with an exp longer than 2 minutes since iat. https://tools.ietf.org/html/rfc7519#section-4.1.4
        .setJti(uuid.v4())
        .sign(key);
    return jwt;
}


module.exports = Webtask.fromExpress(app);
