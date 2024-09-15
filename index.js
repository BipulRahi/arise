const express = require('express')
const crypto = require("node:crypto");
const routes=require("./routes/routes")
const { 
    generateRegistrationOptions, 
    verifyRegistrationResponse, 
    generateAuthenticationOptions, 
    verifyAuthenticationResponse 
} = require('@simplewebauthn/erver');

require('dotenv').config()

const PORT = 3000 || process.env.PORT
const app = express();
app.use(express.json())
app.use('/', routes);

const connectToMongoDB = require('./config/db');
connectToMongoDB();

if (!globalThis.crypto) {
    globalThis.crypto = crypto;
}


app.use(express.static('./public'))

// States
// const userStore = {}
// const challengeStore = {}

// app.post('/register', (req, res) => {
//     const { username, password } = req.body
//     const id = `user_${Date.now()}`

//     const user = {
//         id,
//         username,
//         password
//     }

//     userStore[id] = user

//     console.log(`Register successfull`, userStore[id])

//     return res.json({ id })

// })

// app.post('/register-challenge', async (req, res) => {
//     const { userId } = req.body

//     if (!userStore[userId]) return res.status(404).json({ error: 'user not found!' })

//     const user = userStore[userId]

//     const challengePayload = await generateRegistrationOptions({
//         rpID: 'localhost',
//         rpName: 'My Localhost Machine',
//         attestationType: 'none',
//         userName: user.username,
//         timeout: 30_000,
//     })

//     challengeStore[userId] = challengePayload.challenge

//     return res.json({ options: challengePayload })

// })

// app.post('/register-verify', async (req, res) => {
//     const { userId, cred }  = req.body
    
//     if (!userStore[userId]) return res.status(404).json({ error: 'user not found!' })

//     const user = userStore[userId]
//     const challenge = challengeStore[userId]

//     const verificationResult = await verifyRegistrationResponse({
//         expectedChallenge: challenge,
//         expectedOrigin: 'http://localhost:3000',
//         expectedRPID: 'localhost',
//         response: cred,
//     })

//     if (!verificationResult.verified) return res.json({ error: 'could not verify' });
//     console.log("\n");
//     console.log(" passkey\n");
    
//     userStore[userId].passkey = verificationResult.registrationInfo
//     console.log(verificationResult)

//     return res.json({ verified: true })

// })

// app.post('/login-challenge', async (req, res) => {
//     const { userId } = req.body
//     if (!userStore[userId]) return res.status(404).json({ error: 'user not found!' })
    
//     const opts = await generateAuthenticationOptions({
//         rpID: 'localhost',
//     })

//     challengeStore[userId] = opts.challenge
//     console.log(opts)
//     return res.json({ options: opts })
// })


// app.post('/login-verify', async (req, res) => {
//     const { userId, cred }  = req.body

//     if (!userStore[userId]) return res.status(404).json({ error: 'user not found!' })
//     const user = userStore[userId]
//     const challenge = challengeStore[userId]

//     const result = await verifyAuthenticationResponse({
//         expectedChallenge: challenge,
//         expectedOrigin: 'http://localhost:3000',
//         expectedRPID: 'localhost',
//         response: cred,
//         // authenticator: user.passkey.credentialPublicKey
//         authenticator: {
//             credentialID: user.passkey.credentialID,
//             credentialPublicKey: user.passkey.credentialPublicKey,
//             counter: user.passkey.counter,
//             transports: user.passkey.transports,
//           },
//     })

//     if (!result.verified) return res.json({ error: 'something went wrong' })
    
//     // Login the user: Session, Cookies, JWT
//     return res.json({ success: true, userId })
// })


app.listen(PORT, () => console.log(`Server started on PORT:${PORT}`))