const User = require('../models/User')
const Passkey=require('../models/Pass')
const { 
  generateRegistrationOptions, 
  verifyRegistrationResponse, 
  generateAuthenticationOptions, 
  verifyAuthenticationResponse 
} = require('@simplewebauthn/server');





exports.getUsers= async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching users' });
  }
};

exports.register=async(req,res)=>{
  const { username} = req.body

 
  const user=User.findOne({username});
// console.log(user);


  // if (user) return res.status(404).json({ error: 'user already found! , please login' })

  

  const challengePayload = await generateRegistrationOptions({
      rpID: 'localhost',
      rpName: 'My Localhost Machine',
      attestationType: 'none',
      userName: username,
      timeout: 30_000,
  })

  
// console.log(challengePayload);

  return res.json({ options: challengePayload })


}





exports.register_verification= async (req, res) => {
  const {username, challenge, cred }  = req.body
  
//  console.log("bipul\n\n\n   "+challenge);
 

  
// return
  const verificationResult = await verifyRegistrationResponse({
      expectedChallenge: challenge,
      expectedOrigin: 'http://localhost:3000',
      expectedRPID: 'localhost',
      response: cred,
  })

  if (!verificationResult.verified) return res.json({ error: 'could not verify' });
  console.log("\n");
  console.log(" passkey\n "+verificationResult.verified);

  
  const {credentialID,credentialPublicKey,counter,transports}= verificationResult.registrationInfo
  console.log(credentialID,credentialPublicKey,counter,transports)
  // userStore[userId].passkey = verificationResult.registrationInfo
  // const result=await Passkey.create({credentialID,credentialPublicKey,counter,transports});

  const newPasskey = new Passkey({
    credentialId: credentialID,
    credentialPublicKey: Buffer.from(credentialPublicKey),
    counter: counter,
    transports: transports
  });
  
  newPasskey.save()
    .then(savedPasskey => {
      console.log('Passkey saved:', savedPasskey);
    })
    .catch(err => {
      console.error('Error saving passkey:', err);
    });


  // if(!result) return res.json({error:error});
  // User.findByIdAndUpdate({user._id},)

  const user=new User({username,passkeys:[newPasskey._id]});
  user.save()
    .then(savedPasskey => {
      console.log('user saved:', savedPasskey);
    })
    .catch(err => {
      console.error('Error saving user:', err);
    });


  console.log('verification result '+
  verificationResult)

  return res.json({ verified: true })

}











exports.login=async (req, res) => {
    const { username } = req.body
    
    
    const opts = await generateAuthenticationOptions({
        rpID: 'localhost',
    })

    
 
    return res.json({ options: opts })
}


exports.login_veri=async (req, res) => {
    const { username,challenge, cred }  = req.body
    const userd=await User.findOne({username}).populate('passkeys')
    console.log(userd.passkeys[0]);
    
    const user=userd.passkeys[0]

    const result = await verifyAuthenticationResponse({
        expectedChallenge: challenge,
        expectedOrigin: 'http://localhost:3000',
        expectedRPID: 'localhost',
        response: cred,
        // authenticator: user.passkey.credentialPublicKey
        authenticator: {
            credentialID: user.credentialID,
            credentialPublicKey: user.credentialPublicKey,
            counter: user.counter,
            transports: user.transports,
          },
    })

    if (!result.verified) return res.json({ error: 'something went wrong' })
    
    // Login the user: Session, Cookies, JWT
    return res.json({ success: true })
}

