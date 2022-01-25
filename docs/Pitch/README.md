# CS 411 Team 3 Project Pitches

---

## Community powered Spotify song queue

#### Synposis:

Add songs easily in a group setting via text. Users can link their spotify account to our website so that their friends and customers can text a song request using Twilio to directly add songs to our user’s queue. The users on our website will be presented with a dashboard where they can see all the song requests that they have received. If they choose to accept a request, that song will automatically appear in their queue.

1. API Use
   
   1. [Spotify](https://developer.spotify.com/documentation/web-api/)
   
   2. [SMS Text messaging](https://www.twilio.com/)

   3. [QR Code API](https://rapidapi.com/linqr-linqr-default/api/qrcode3/)

   4. [Stripe](https://stripe.com/docs/api)

2. Database Use
   
   1. Creating and storing accounts in our webapp

3. OAuth
   
   1. Spotify OAuth API Calls

---

## Auto post-flight rideshare scheduler

#### Synopsis:

Tired of waiting a long time for an Uber after your flight? Introducing the app that **calls an Uber automatically** for you. It utilizes the **Aviation Stack API**, **Uber API**, and the **Twilio API** to ensure that you have an Uber waiting for you when you land. Simply go on our website and make an account with your phone number, enter in your flight details. Our app will then constantly monitor your flight for changes, and take into account whether or not you checked in your luggage in order to guarantee there is an uber waiting for you. Throughout the process, we will utilize the SMS text messages to stay in touch with you and call an Uber in time.

1. API Use
   
   1. [Aviation Stack Flight API](https://aviationstack.com/documentation)
   
   2. [Uber Sandbox API](https://developer.uber.com/docs/riders/guides/sandbox)
   
   3. [SMS Text messaging](https://www.twilio.com/)

2. Database Use
   
   1. Creating and storing accounts in our webapp

3. OAuth
   
   1. Uber OAuth API Calls