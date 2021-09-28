# Auth0 - Singpass Extesion

[![Auth0 Extensions](http://cdn.auth0.com/extensions/assets/badge.svg)]()

This extension will expose endpoints you can use from your custom social connection to support Singpass token endpoint with client-assertion.

## Deploy to Webtask.io

```
npm i -g wt-cli
wt init
wt create https://github.com/vikasjayaram/auth0-singpass-extension/blob/master/index.js \
    --name auth0-singpass-extension \
    --secret AUTH0_CUSTOM_DOMAIN="YOUR_AUTH0_CUSTOM_DOMAIN" \
    --secret SINGPASS_CLIENT_ID="SINGPASS_CLIENT_ID" \
    --secret SINGPASS_TOKEN_ENDPOINT="SINGPASS_TOKEN_ENDPOINT" \
    --secret SINGPASS_ISSUER="SINGPASS_ISSUER" \
    --secret SINGPASS_SIGNING_ALG="SINGPASS_SIGNING_ALG" \
    --secret SINGPASS_JWKS_ENDPOINT="SINGPASS_JWKS_ENDPOINT" \
    --secret RELYING_PARTY_JWKS_ENDPOINT="RELYING_PARTY_JWKS_ENDPOINT" \
    --secret RELYING_PARTY_PRIVATE_KEY="RELYING_PARTY_PRIVATE_KEY" \
    --secret RELYING_PARTY_KID="RELYING_PARTY_KID" \
    --secret SINGPASS_CLIENT_ID="SINGPASS_CLIENT_ID" \
    --secret SINGPASS_AUDIENCE="SINGPASS_AUDIENCE"
    
```

## Usage

Once the webtask has been deployed you will need the following endpoints to complete the setup for the custom social connection

```
authorizeUrl = 'https://{TENANT}.{region}12.webtask.io/auth0-singpass-extension/authorize'
tokenURL = 'https://{TENANT}.{region}12.webtask.io/auth0-singpass-extension/token'
```


## What is Auth0?

Auth0 helps you to:

* Add authentication with [multiple authentication sources](https://docs.auth0.com/identityproviders), either social like **Google, Facebook, Microsoft Account, LinkedIn, GitHub, Twitter, Box, Salesforce, amont others**, or enterprise identity systems like **Windows Azure AD, Google Apps, Active Directory, ADFS or any SAML Identity Provider**.
* Add authentication through more traditional **[username/password databases](https://docs.auth0.com/mysql-connection-tutorial)**.
* Add support for **[linking different user accounts](https://docs.auth0.com/link-accounts)** with the same user.
* Support for generating signed [Json Web Tokens](https://docs.auth0.com/jwt) to call your APIs and **flow the user identity** securely.
* Analytics of how, when and where users are logging in.
* Pull data from other sources and add it to the user profile, through [JavaScript rules](https://docs.auth0.com/rules).

## Create a free Auth0 Account

1. Go to [Auth0](https://auth0.com) and click Sign Up.
2. Use Google, GitHub or Microsoft Account to login.

## License

This project is licensed under the MIT license.
