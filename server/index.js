// DEPENDENCIES
const express = require("express"); // Express web server framework
const request = require("request"); // "Request" library
const Spotify = require("node-spotify-api");
const querystring = require("querystring");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const MessagingResponse = require("twilio").twiml.MessagingResponse;
const socket = require("socket.io");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')
const joi = require("joi");
const monk = require("monk");
var morgan = require('morgan')
const { send } = require("process");
const { Console } = require("console");
const dotenv = require("dotenv").config()
const stripe = require('stripe')(process.env.STRIPESK)
const path = require('path')
const nodemailer = require("nodemailer");
const fs = require('fs')

// STRIPE CONFIG




// EXPRESS CONFIG + MIDDLEWARES
const app = express();
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}))
app.use(checkToken)
app
  .use(cors())
  .use(cookieParser())

  // DEPLOYMENT

  // app.use(express.static(path.join(__dirname, "./dist")))
  // app.get('/', (req, res) => {
  //     res.sendFile(path.join(__dirname, './dist', 'index.html'))
  // })

//   app.get('/signup', (req, res) => {
//     res.sendFile(path.join(__dirname, './dist', 'index.html'))
// })

// app.get('/linkspotify', (req, res) => {
//   res.sendFile(path.join(__dirname, './dist', 'index.html'))
// })

// app.get('/login', (req, res) => {
//   res.sendFile(path.join(__dirname, './dist', 'index.html'))
// })

// app.get('/dashboard', (req, res) => {
//   res.sendFile(path.join(__dirname, './dist', 'index.html'))
// })

// app.get('/howto', (req, res) => {
//   res.sendFile(path.join(__dirname, './dist', 'index.html'))
// })

// app.get('/settings', (req, res) => {
//   res.sendFile(path.join(__dirname, './dist', 'index.html'))
// })

// app.get('/resetpassword', (req, res) => {
//   res.sendFile(path.join(__dirname, './dist', 'index.html'))
// })

const server = app.listen(process.env.PORT || 3000, function () {
    console.log("Listening on 3000...");
  });


// TWILIO CONFIG
const twilioNum = "+15076506504";
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);


// SPOTIFY CONFIG
const client_id = process.env.SPOTIFY_CLIENT_ID; 
const client_secret = process.env.SPOTIFY_CLIENT_SECRET; 
const redirect_uri = "https://auxy411.ngrok.io/callback";
const stateKey = "spotify_auth_state";
const spotify = new Spotify({ id: client_id, secret: client_secret });



// SOCKET.IO CONFIG
const io = socket(server);
var socketIDS = [];

// DB CONFIG

// var mongo = require('mongodb');
// var db = monk(`mongodb+srv://akashk99:${process.env.MONGODB}@cluster0.qavqf.gcp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`);

const db = monk('localhost/auxy411')
var users = db.get("users");
var texters = db.get("texters")
var requesters = db.get("requesters")
texters.createIndex("phonenumber")
requesters.createIndex("phonenumber")
users.createIndex("username");
users.createIndex("code");

// JOI SCHEMAS
// TODO:
// 1) get email verification and phone number
// 2) user object in database should contain unique 3-5 letter code, can ask when signing up
const schema = joi.object().keys({
    firstname: joi.string().regex(/^[a-zA-Z]{3,30}$/).required(),
    lastname: joi.string().regex(/^[a-zA-Z]{3,30}$/).required(),
    phonenumber: joi.string().length(10).pattern(/^[0-9]+$/).required(),
    organization: joi.string().regex(/^[a-zA-Z]{0,30}$/).optional().allow(''),
    username: joi.string().alphanum().min(3).max(30).required(),
    password: joi.string().min(8).required(),
    code: joi.string().min(3).max(6).regex(/^[a-zA-Z]{3,30}$/).optional().allow('').messages({
      'string.pattern.base': `Code can only contain letters`,
    }),
    email: joi.string().min(3).required().email()
})


// MIDDLEWARE FUNCTIONS
function checkToken(req, res, next) {
  
 
  const authHeader = req.get("Authorization")
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    if (token) {
      jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
          console.log(err);
        }
        req.user = user;

      });
    }
  }

  next();
}


// function updateSessionMembers(){
//   texters.find({}).then(docs=>{
//     for(let i=0; i<docs.length;i++){
//       let now = (new Date()).getTime()
//       if(docs[i].expireTime < now){
//         texters.remove({phonenumber: docs[i].phonenumber})
//       }

//     }
//   })
// }

// setInterval(()=>{
//   updateSessionMembers()

//   users.find({}).then(docs=>{
//     // console.log(docs)
//     for(let i=0; i<docs.length;i++){
//       userscode = docs[i].code
//       texters.find({code: userscode}).then(sessionMembers=>{
//         console.log(userscode + " " + sessionMembers.length)
//         users.findOneAndUpdate({code: userscode}, {$set: {numPeopleInSession: sessionMembers.length}})
//       })
//     }
//   })

// }, 2000)

// used to assign random code to user

function getRandomCode(){

    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var randomCode = "";

    for (var i = 0; i < 5; i++)
      randomCode += possible.charAt(Math.floor(Math.random() * possible.length));

    randomCode = randomCode.substring(0,Math.floor(Math.random() * 3)+4)



  return randomCode
}

// stripe endpoint
app.post('/checkout', async (req, res) => {
  if(req.user){
    var prices = ["price_1JtL3lFpNNCPWyyXC6O90QZb", "price_1JtKmqFpNNCPWyyXj6s7BIi0", "price_1JtL4BFpNNCPWyyXFDicZwwT", "price_1JtL4BFpNNCPWyyXT5dBBdQq"]
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          // Provide the exact Price ID (e.g. pr_1234) of the product you want to sell
          price: prices[req.body.amount],
          quantity: 1,
        },
  
  
      ],
      payment_method_types: [
        'card',
      ],
      mode: 'payment',
      cancel_url: "https://auxy411client.ngrok.io/settings",
      success_url: `https://auxy411.ngrok.io/success-payment?priceindex=${req.body.amount}&username=${req.user.username}`,
    });
  
    res.json({url: session.url, data: session})
  }

});

app.get("/success-payment", (req,res)=>{
  usernamereq = req.query.username
  priceindex = req.query.priceindex
  prices = [5,10,20,30]
  
  users.findOneAndUpdate({username: usernamereq }, {$inc: {balance: prices[priceindex]}})


  res.redirect("https://auxy411client.ngrok.io/settings")
})


// SIGNUP ROUTE
app.post("/signup", (req, res) => {
    const result = schema.validate(req.body);
    // const result = req.body
  
    if (result.error == null) {
      // Insert in to DB
      users.findOne({email: req.body.email}).then((email)=>{
        if(email==null){
            users.findOne({ phonenumber: req.body.phonenumber }).then((number) => {
          if(number==null){
            users.findOne({ username: req.body.username }).then((user) => {
              if (user == null) {
                // USERNAME UNIQUE AND VALID

                users.findOne({ code: req.body.code }).then((code) => {
                  if(code==null){

                    users.distinct('code').then(codes=>{

                      if(req.body.code==""){
                        randomCode = getRandomCode()
                        while(codes.includes(randomCode)){
                          randomCode = getRandomCode()
                        }
                        req.body.code = randomCode
                      }


                    var QRLink = "sms:+15076506504&body=Join%20Session%20"+req.body.code.toUpperCase()
                    const options = {
                      method: 'GET',
                      url: 'https://codzz-qr-cods.p.rapidapi.com/getQrcode',
                      qs: {type: 'url', value: QRLink},
                      headers: {
                        'x-rapidapi-host': 'codzz-qr-cods.p.rapidapi.com',
                        'x-rapidapi-key': '2AVoqgSWermshEZAWAGb0mioEtDEp1FH1VGjsn2bEL3sq0tT5D',
                        useQueryString: true
                      }
                    };

                    request(options, function (error, response, body) {

                    bcrypt.hash(req.body.password, 12, function (err, hash) {
                      let userToInsert = {
                        firstname: req.body.firstname.charAt(0).toUpperCase() + req.body.firstname.slice(1),
                        lastname: req.body.lastname.charAt(0).toUpperCase() + req.body.lastname.slice(1),
                        organization: req.body.organization,
                        phonenumber: req.body.phonenumber,
                        email: req.body.email.toLowerCase(),
                        username: req.body.username.toLowerCase(),
                        password: hash,
                        code: req.body.code.toLowerCase(),
                        requests: [],
                        queued: [],
                        balance: 10.0,
                        spotify_refresh: "",
                        jwt_refresh: "",
                        numPeopleInSession: 0,
                        QRUrl: JSON.parse(body).url,
                        autoqueue: false,
                        verified: false
                      };

                      users.insert(userToInsert).then((user) => {
                        
                        const payload = {
                          username: user.username,
                          id: user._id,
                          code: user.code
                        };
            
                        jwt.sign(
                          payload,
                          process.env.TOKEN_SECRET,
                          { expiresIn: "6h" },
                          (err, token) => {
                            if (err) {
                              res.status(422).send({
                                message: "Could not create token",
                              });
                            } else {
                                sendVerifyText(user.phonenumber,user.username)
                              res.json({ token });
                            }
                          }
                        );
                      });
                    });
                    });
                    })
                  }else{
                    return res.status(409).send({
                      message: "Code is Taken",
                    });
                  }
                })
              } else {
                return res.status(409).send({
                  message: "Username is Taken",
                });
              }
            });
          }else{
            return res.status(409).send({
              message: "An account with that phone number already exists",
            });
          }
          })
      }else{
        return res.status(409).send({
          message: "An account with that email already exists",
        });
      }
      })
          
    } else {
      res.json({
        error: result.error,
      });
    }
  });

// LOGIN ROUTE
app.post("/login", (req, res) => {

  var lowerCaseUsername = req.body.username.toLowerCase()
  console.log(lowerCaseUsername)
  users.findOne({ username: lowerCaseUsername }).then((user) => {
    if (user == null) {
      users.findOne({email: lowerCaseUsername}).then(email=>{
        if(email==null){
          return res.status(404).send({
            message: "User Not Found",
          });
        }else{
          bcrypt.compare(req.body.password, email.password).then((same) => {
            if (same) {
            
              const payload = {
                  username: email.username,
                  id: email._id,
                  code: email.code
              }
    
              jwt.sign(payload, process.env.TOKEN_SECRET,{expiresIn: '6h'},(err, token)=>{
                if(err){
                    res.status(422).send({
                        message: 'Could not create token'
                    })
                }else{
                    users.findOne({username: email.username}).then(user=>{
                      var refresh_token = user.spotify_refresh
                      res.json({
                        token,
                        refresh_token
                      })
                    })
                    // res.json({token})
                }
              })
            } else { 
              return res.status(404).send({
                message: "User Not Found",
              });
            }
          });
        }
      })
    } else {
      bcrypt.compare(req.body.password, user.password).then((same) => {
        if (same) {
        
          const payload = {
              username: user.username,
              id: user._id,
              code: user.code
          }

          jwt.sign(payload, process.env.TOKEN_SECRET,{expiresIn: '6h'},(err, token)=>{
            if(err){
                res.status(422).send({
                    message: 'Could not create token'
                })
            }else{
                users.findOne({username: user.username}).then(user=>{
                  var refresh_token = user.spotify_refresh
                  res.json({
                    token,
                    refresh_token
                  })
                })
                // res.json({token})
            }
          })
        } else { 
          return res.status(404).send({
            message: "User Not Found",
          });
        }
      });
    }
  });
});

app.post("/storerefresh",(req,res)=>{
  console.log("hit endpoint")
  console.log(req.body)
  if(req.user){
    users.findOneAndUpdate({username: req.user.username}, {$set: { spotify_refresh: req.body.refresh } }).then(res.send("done"))
  }else{
    res.status(401)
    throw new Error('Not Logged In')
  }
})


function sendMessage(to,body){

  client.messages
  .create({
    to: to,
    from: twilioNum,
    body: body
  })
}

function autoqueue(req,user) {
  var refresh=user.spotify_refresh
  uri = req.uri

  if(refresh){
    var options = {
      'method': 'POST',
      'url': 'https://auxy411.ngrok.io/refresh_token',
      'headers': {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "refresh_token": refresh
      })

    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      access_token = JSON.parse(response.body)["access_token"];

      let url = "https://api.spotify.com/v1/me/player/queue?uri="+uri

      var options = {
        'method': 'POST',
        'url': url,
        'headers': {
          'Authorization': 'Bearer ' + access_token
        }
      };
      request(options, function (error, response) {
        console.log(response.body)
        if (response.body!==''){
          sendMessage(req.sender, "DJ must be playing music in order to receive requests. Please try again later")
          return;
        }
        users.findOneAndUpdate({username: user.username},{$push: { queued: req } }).then((updatedDoc)=>{
          console.log(req)
          sendMessage(req.sender,"Request for " + req.title + " by " + req.artist +" has been added to the queue. Use this phone number to send more requests")
        })

      });

    });
  }



}

app.post('/updatesettings',(req,res)=>{

  if(req.user){

    console.log(req.body)
    if(req.body.switch) {
      users.findOne({username: req.user.username}).then(user => {
        users.findOneAndUpdate({username: req.user.username}, {$set: {autoqueue: !user.autoqueue}}).then(updated => {
          res.send("updated")
        })
      })
    }else if(req.body.autoqueue != null){
      console.log("here")
      users.findOneAndUpdate({username: req.user.username}, {$set: {autoqueue: req.body.autoqueue}}).then(updated => {
        res.send("updated")
      })
    }

  }
})

// INCOMING SMS ROUTE
app.post("/sms", async (req,res) => {

  console.log("recieved message")

  const sender = req.body.From
  req.body.Body = req.body.Body.toLowerCase()
  req.body.Body = req.body.Body.trim()

  
  // LINK SENDER NUMBER TO USER'S CODE
  texters.findOne( {phonenumber: sender} ).then((texter)=>{
    if(texter == null){
      // SENDERS NUM IS NOT LINKED TO A SESSION
      req.body.Body = req.body.Body.toLowerCase()
      if(req.body.Body.split(" ")[0]=="join" && req.body.Body.split(" ")[1]=="session"){
        var joinCode = req.body.Body.split(" ")[2]
        var now = new Date().getTime()
        const ttl = 43200000
        const data = {
          phonenumber: sender,
          code: joinCode,
          expireTime: now + ttl
        }
        texters.insert(data)

      
        users.findOne({code: joinCode}).then(user=>{

       
          if(user!=null){
            if(user.organization==""){
              sendMessage(sender,"You have now been added to " + user.username + "'s session. Your phone number will be associated with this session for the next 12 hours. You can join another session at anytime by texting 'Join session' followed by the session code. Any song requests made to this number will be sent to the DJ")
            }else{
              sendMessage(sender,"You have now been added to " + user.organization + "'s session. Your phone number will be associated with this session for the next 12 hours. You can join another session at anytime by texting 'Join session' followed by the session code. Any song requests made to this number will be sent to the DJ")
            }

          }else{
            sendMessage(sender,"Invalid Code")
          }
        })
      }else{
        sendMessage(sender,"Welcome to Text-a-Tune. To request a song, you must first join an active session. You can do that by responding with:\n'Join Session [session code]")
      }
    }else{
      // SENDER NUM IS ALREADY LINKED TO A CODE
      var now = new Date().getTime()
      if(texter.expireTime < now){
        texters.remove({phonenumber: sender})
        if(req.body.Body.toLowerCase().split(" ")[0]=="join" && req.body.Body.toLowerCase().split(" ")[1]=="session"){
          var newCode = req.body.Body.split(" ")[2]
          users.findOne({code: newCode}).then((user)=>{
            if(user){
              var newTTL = (new Date()).getTime() + 43200000
              const data = {
                phonenumber: sender,
                code: newCode,
                expireTime: newTTL
              }
              texters.insert(data)
  
              if(user.organization==""){
                sendMessage(sender,"You have now been added to " + user.username + "'s session. Your phone number will be associated with this session for the next 12 hours. You can join another session at anytime by texting 'Join session' followed by the session code. Any song requests made to this number will be sent to the DJ")
              }else{
                sendMessage(sender,"You have now been added to " + user.organization + "'s session. Your phone number will be associated with this session for the next 12 hours. You can join another session at anytime by texting 'Join session' followed by the session code. Any song requests made to this number will be sent to the DJ")
              }
  
            }else{
              sendMessage(sender,"Invalid Code")
            }
          })
  
        
  
        }else{
          sendMessage(sender,"Welcome to Text-a-Tune. To request a song, you must first join an active session. You can do that by responding with:\n'Join Session [session code]")
        }

      }else if(req.body.Body == "LEAVE"){
        texters.remove({phonenumber: sender})
        sendMessage(sender, "You have been removed from the session. Send a join code to be added to another session")

      }else if(req.body.Body.toLowerCase().split(" ")[0]=="join" && req.body.Body.toLowerCase().split(" ")[1]=="session"){
        var newCode = req.body.Body.split(" ")[2]
        users.findOne({code: newCode}).then((user)=>{
          if(user){
            var newTTL = (new Date()).getTime() + 43200000
            texters.findOneAndUpdate({phonenumber: sender}, {$set: { code: newCode } })
            texters.findOneAndUpdate({phonenumber: sender}, {$set: { expireTime: newTTL } })

            if(user.organization==""){
              sendMessage(sender,"Welcome to Text-a-Tune. You’re all set! You have been succesfully added to " + user.username + "'s session. Use this phone number to text the name of the song you want to hear. Be sure to check the spelling and include the artist if there are multiple songs with the same name.")
            }else{
              sendMessage(sender,"Welcome to Text-a-Tune. You’re all set! You have been succesfully added to " + user.organization + "'s session. Use this phone number to text the name of the song you want to hear. Be sure to check the spelling and include the artist if there are multiple songs with the same name.")
            }

          }else{
            sendMessage(sender,"You have entered an invalid code. Please check the code and resend")
          }
        })

      

      }else{

        texters.findOne({phonenumber: sender}).then(texter=>{
          spotify.search({type: "track", query: req.body.Body })
          .then(async (response) => {
            let song = response.tracks.items[0] ;
            let title = song.name;
            let artist = song.artists[0].name;
            let cover = song.album.images[0].url;
            let uri = song.uri;
        
          
            let request = {
              title,
              artist,
              cover,
              uri,
              sender,
              numTimesRequested: 1
            };

            //add to requesters array, this keeps track of every request ever made to this app
            requesters.findOne({phonenumber: sender}).then(requester=>{
              if(requester){
                newRequest = {
                    title: request.title,
                    artist: request.artist,
                    uri: request.uri,
                    codeSentTo: texter.code,
                    time: new Date(),
                  }
                requesters.findOneAndUpdate({phonenumber: sender}, {$push: {requests: newRequest }})
              }else{
                requesters.insert({
                  phonenumber: sender,
                  requests: [{
                    title: request.title,
                    artist: request.artist,
                    uri: request.uri,
                    codeSentTo: texter.code,
                    time: new Date()
                  }],

                })
              }
            })


            users.findOne({code: texter.code}).then(user=>{
              var alreadyRequested = false
              for(let i=0;i<user.requests.length;i++){
                if(user.requests[i].uri == request.uri){
                  alreadyRequested = true
                  break;
                }
              }

              if(user.autoqueue){
                autoqueue(request,user)

              }else{
                if(alreadyRequested){
                  users.findOneAndUpdate( {username : user.username , "requests.uri" : request.uri } ,
                      {$inc : {"requests.$.numTimesRequested" : 1} } ,
                      false ,
                      true).then(updatedDoc=>{
                    console.log(updatedDoc)
                  })
                  sendMessage(sender, "Request for " + request.title + " by " + request.artist +" has been sent to the DJ for approval. We will let you know once it has been added to the queue. Use this phone number to send more requests.")
                }else{
                  users.findOneAndUpdate({ code: texter.code },{$push: { requests: request } }).then((updatedDoc)=>{
                    if(updatedDoc){
                      sendMessage(sender, "Request for " + request.title + " by " + request.artist +" has been sent to the DJ for approval. We will let you know once it has been added to the queue. Use this phone number to send more requests.")

                    }else{
                      sendMessage(sender, "No account associated with code: " + texter.code)
                    }
                  })
                }
              }

              users.findOneAndUpdate({username: user.username}, {$inc: {balance: -0.05}})

            })
            
    
            // UPDATES USER'S LIST OF REQUESTS
          
            
        
          }).catch(e=>{
            sendMessage(sender, "We could not find a song by that name. Please check your spelling and try again")
          })
        })
      }
    }
  })
  
})

app.post("/clearall",(req,res)=>{
  if(req.user){
    users.findOneAndUpdate({username: req.user.username},{$set: {requests: []}})
  }
})


app.get("/userdata",(req,res)=>{
  if(req.user){
    
    users.findOne({ code: req.user.code }).then(user=>{
      res.json(user)
    })
  }else{
    res.status(401)
    throw new Error('Not Logged In')
  }
})

app.post("/updaterequests",(req,res)=>{
  
  if(req.user){

    console.log(req.body.request)
    var updatedRequests = req.body.requests
    var added = req.body.added

    if(added){
      users.findOneAndUpdate({username: req.user.username},{$push: { queued: req.body.request } }).then((updatedDoc)=>{
        console.log(updatedDoc)
      })

      sendMessage(req.body.request.sender, "Your request for " + req.body.request.title + " by " + req.body.request.artist + " has been approved by the DJ and is now in the queue.")

    }

    users.findOneAndUpdate({username: req.user.username},{$pull: {requests: {uri: req.body.uri}}}).then((updatedDoc)=>{
      console.log(updatedDoc)
    })
    res.json({"Got data": true})
  }else{
    res.status(401)
    throw new Error('Not Logged In')
  }
  
})



// WHEN USER LOGS IN THROUGH GET REQUEST:
  // SEND LIST OF SONGS, CODE, USERNAME
  // ON FRONT END, IF THEY CLICK ADD, USE AUTH TOKEN TO ADD THEN SEND POST REQUEST TO SERVER TO REMOVE THAT SONG
  // FIGURE OUT HOW TO LONG POLL FOR UPDATED REQUESTS OR USE SOCKETS
  // FIGURE OUT TO REMOVE TEXTERS AFTER 4 HOURS
  // ADD ROUTE FOR REMOVING SONG FROM REQUESTS LIST
  // KEEP TRACK OF SONGS ALREADY QUEUED
  // INSIDE SMS ROUTE, DUPLICATE CALLBACKS
  // TO GET TO LINK PAGE, YOU NEED EXACTLY JWT AND NO AUTH TOKEN COOKIE
  // DASHBOARD MUST HAVE BOTH, IF IT HAS ONE, GO TO LINK PAGE OR SIGN UP/LOGIN
  // REMOVE SONG ON CLIENT



// CODE TO LINK SPOTIFY

var generateRandomString = function (length) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};


app.get("/link", function (req, res) {

  // if(req.user){
    var state = generateRandomString(16);
    res.cookie(stateKey, state);
  
    
    // your application requests authorization
    var scope =
      "playlist-read-private user-modify-playback-state user-read-playback-state playlist-modify-public playlist-modify-private";
    res.redirect(
      "https://accounts.spotify.com/authorize?" +
        querystring.stringify({
          response_type: "code",
          client_id: client_id,
          scope: scope,
          redirect_uri: redirect_uri,
          state: state,
        })
    );
  // }else{
  //   res.status(401)
  //   throw new Error('Not Logged In')
  // }
});


app.get("/callback", function (req, res) {
  // your application requests refresh and access tokens
  // after checking the state parameter
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect(
      "https://auxy411client.ngrok.io/linkspotify/#" +
        querystring.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
      },
      headers: {
        Authorization:
          "Basic " +
          new Buffer(client_id + ":" + client_secret).toString("base64"),
      },
      json: true,
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token,
          refresh_token = body.refresh_token;

        request.get(
          {
            url: "https://api.spotify.com/v1/me",
            headers: {
              Authorization: "Bearer " + access_token,
            },
          },
          (error, response, body) => {
      
          }
        );

        // we can also pass the token to the browser to make requests from there
        res.redirect(
          "https://auxy411client.ngrok.io/linkspotify/#" +
            querystring.stringify({
              access_token: access_token,
              refresh_token: refresh_token,
            })
        );
      } else {
        res.redirect(
          "https://auxy411client.ngrok.io/linkspotify/#" +
            querystring.stringify({
              error: "invalid_token",
            })
        );
      }
    });
  }
});

app.post("/refresh_token", function (req, res) {

  // requesting access token from refresh token
  var refresh_token = req.body.refresh_token;
  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        new Buffer(client_id + ":" + client_secret).toString("base64"),
    },
    form: {
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        access_token: access_token,
      });
    }
  });
});


app.post("/resetpassword",(req,res)=>{
  token = req.body.token
  password = req.body.password

  console.log(req.body)

  res.json({status:"good"})

    jwt.verify(token, process.env.TOKEN_SECRET, (err, username) => {
    if (err) {
      console.log(err);
    }else{
      console.log("reset");
      bcrypt.hash(password, 12, function (err, hash) {
        users.findOneAndUpdate({username: username.username}, {$set: {password: hash}}).then(user=>{
          if(user==null){
          
            users.findOneAndUpdate({email: username.username}, {$set: {password: hash}})
          }
        })
      })
      
    }
    
  });
})

  // hash password and set it as password for username thats defined by token



app.post("/forgotpassword",(req,res)=>{
  username = req.body.username._value
  console.log(username)
  users.findOne({username: req.body.username._value}).then(user=>{
    if(user){
      number = user.phonenumber
      console.log(number)
      jwt.sign(
        {username: username},
        process.env.TOKEN_SECRET,
        { expiresIn: "30m" },
        (err, token) => {
          if (err) {
            console.log(err)
            res.status(422).send({
              message: "Could not create token",
            });
          } else {
            url = "https://auxy411client.ngrok.io/resetpassword?token=" + token
            sendMessage(user.phonenumber, "Use this link to reset password: " + url)
          }
        }
      );
    }else{
      users.findOne({email: req.body.username._value}).then(user=>{
        number = user.phonenumber
        console.log(number)
        jwt.sign(
          {username: username},
          process.env.TOKEN_SECRET,
          { expiresIn: "30m" },
          (err, token) => {
            if (err) {
              console.log(err)
              res.status(422).send({
                message: "Could not create token",
              });
            } else {
              url = "https://auxy411client.ngrok.io/resetpassword?token=" + token
              sendMessage(user.phonenumber, "Use this link to reset password: " + url)
            }
          }
        );
      })
    }
  })
})


app.get("/verify",(req,res)=>{
  token = req.query.token

  jwt.verify(token, process.env.TOKEN_SECRET, (err, username) => {
    if (err) {
      console.log(err);
    }
    users.findOneAndUpdate({username: username.username}, {$set: {verified: true}}).then((user)=>{
      console.log(user.phonenumber)
      sendMessage(user.phonenumber, "Your account has been verified")
      res.redirect("https://auxy411client.ngrok.io/")
    })
  });
})


// SEND VERIFY EMAIL
function sendVerifyText(number,username){
  url = "https://auxy411.ngrok.io/verify?token="
  jwt.sign(
    {username: username},
    process.env.TOKEN_SECRET,
    {expiresIn: "30m"},
    (err, token) => {
      if (err) {
        res.status(422).send({
          message: "Could not create token",
        });
      } else {
        url = url + token
        sendMessage(number, "Please verify your phone number with this link: " + url)
      }
    }
  );
  
}

app.get("/getnewlink",(req,res)=>{
  if(req.user){
    users.findOne({username: req.user.username}).then(user=>{
      num = user.phonenumber
      sendVerifyText(num,user.username)
    })
  }
})





// FOR DEPLOYMENT:
//  change redirect uri, twilio web hook, and res.redirect urls in callback route
// add proper redirect links to spotify dashboard
