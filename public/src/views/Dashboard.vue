<template>
  <div class="dashboard">



    <!-- Modal -->


    <div class="row">
      <div class="col-sm-7 text-left" style="">
        <h2>{{user.firstname}}'s Dashboard</h2>
        <h6>Balance: ${{user.balance.toFixed(2)}}</h6>
        <h6>Queue Number: 507-650-6504</h6>
        <h6>Code: {{user.code}}</h6>
        <h6 style=""><span style="display: inline-block; padding-top: 2px" >Autoqueue:</span>
      

          <div style="display: inline-block; vertical-align: top; margin-left: 10px" class="form-check form-switch">
            <input v-on:change="saveSettings()" v-model="user.autoqueue" class="form-check-input"  type="checkbox" id="flexSwitchCheckDefault">
          </div>


        </h6>

        <!-- Implement suggestive mode, no need to have to spotify playing for this work -->
        <!-- <h6 style=""><span style="display: inline-block; padding-top: 2px" >Suggestions:</span>
          <div style="display: inline-block; vertical-align: top; margin-left: 10px" class="form-check form-switch">
            <input v-on:change="saveSettings()" v-model="user.autoqueue" class="form-check-input"  type="checkbox" id="flexSwitchCheckDefault">
          </div>
        </h6> -->

        <button class="btn" style="height:40px; width: auto" v-if="user.requests.length>0" v-on:click="clearAll"><i class="fas fa-trash-alt"></i></button>
        <button v-on:click="getCurrentlyPlaying()" type="button" style="height:40px; width: auto" class="btn" data-toggle="modal" data-target="#playerControls">
          <i class="fas fa-music"></i>
        </button>

        <button type="button" style="height:40px; width: auto" class="btn" data-toggle="modal" data-target="#qrcode">
          <i class="fas fa-qrcode"></i>
        </button>

        

  


      </div>
      <div class="col-sm-5">

      </div>
    </div>

          <div class="modal fade" id="qrcode" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header text-center d-block">
              <h5 class="modal-title" id="exampleModalLabel">QR Code</h5>

            </div>
            <div class="modal-body">
              <img style="margin-bottom: 20px" v-bind:src="user.QRUrl"/>

              <p>Scan the QR code and then press send</p>
            </div>
            <div class="modal-footer  text-center">
              <button type="button" class="btn-md" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>

    <div class="modal fade" id="playerControls" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-body media-player">
            <div class="card media-player" v-if="playing">
              <div class="card-header player-header">
                <div class="row">
                  <div class="col-11 text-left">
                    Currently Playing
                  </div>
                  <div class="col-1">
                    <i data-dismiss="modal" class="far fa-times-circle"></i>
                  </div>
                </div>

              </div>


              <div class="card-body player-body">
                <div class="player">
                  <div class="row" >
                    <div class="col-sm-3">
                      <img v-bind:src="currentSong.albumCover" class="album-art">
                    </div>
                    <div class="col-sm-9">
                      {{currentSong.title}}<br><small>{{currentSong.artist}}</small>
                    </div>
                  </div>

                  <!--              Add controls here-->

                  <div class="row">
                    <div class="col-sm-3">

                    </div>
                    <div class="col-sm-9">
                      <button class="btn-md controls" v-on:click="prev"><i class="fas fa-backward"></i></button>
                      <button class="btn-md controls" v-on:click="play" v-if="paused"><i class="fas fa-play"></i></button>
                      <button class="btn-md controls" v-on:click="pause" v-if="!paused"><i class="fas fa-pause"></i></button>
                      <button class="btn-md controls" v-on:click="next"><i class="fas fa-forward"></i></button>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            <div v-else>
              Nothing is currently playing
            </div>
          </div>
        </div>
      </div>
    </div>

    <hr>
    <div v-if="user.verified">
      <h4 align="left" v-if="user.requests.length>0 && user.balance > 0"><strong>Pending Requests</strong></h4>
      <div class="" v-if="user.requests.length>0 && user.balance > 0">

      <ul class="list-group song-list request-list">
        <li v-for="request in user.requests" :key="request.uri" class="list-group-item container song"><div class="row">
          <div class="col-sm-2 my-auto"><img class="album-art" v-bind:src="request.cover" /></div>
          <div class="col-sm-4 my-auto">{{request.title}}<br><small>{{request.artist}}</small>
            <span v-if="request.numTimesRequested>1"><br><small>Requested by {{request.numTimesRequested}} people</small></span>
          </div>
          <div class="col-6 my-auto"  v-if="windowWidth<=576" style="margin-bottom: 10px"><button v-on:click="addToQueue(request)" class="addbutton">ADD</button></div>
          <div class="col-6 my-auto" v-if="windowWidth<=576" >
            <button v-on:click="remove(request)" class="deletebutton ">DELETE</button>
            </div>

          <div class="col-3 my-auto"  v-if="windowWidth>576" style="margin-bottom: 10px"><button v-on:click="addToQueue(request)" class="addbutton large">ADD</button></div>
          <div class="col-3 my-auto" v-if="windowWidth>576" >
            <button v-on:click="remove(request)" class="deletebutton large">DELETE</button>
            </div>
        </div>
        </li>


        </ul>
      </div>

      <h6 v-else-if="user.requests.length==0 && user.balance > 0" class="no-songs">No Pending Song Requests</h6>


      <div v-else class="alert alert-danger" role="alert">
      <div  class="no-songs">
        <h4><strong>Insufficent Balance</strong></h4><br>Go to <router-link to="settings">My Account</router-link> to add more credits <br><br>
      You have {{user.requests.length}} request<span v-if="user.requests.length != 1">s</span> pending your approval
      </div>
    </div>
  </div>
    <div v-else-if="user.verified==false">
      <div class="alert alert-danger" role="alert">
        Please use the link that was texted to you inorder to verify your account
        <br>
        Click <a href="" @click="reverify()">here</a> to recieve another text message
      </div>
    </div>
    <hr>
    <div v-if="user.queued.length > 0">
    <h4 align="left"><strong>Previously Queued</strong></h4>
    <ul class="list-group song-list">
      <li v-for="request in user.queued" :key="request.uri" class="list-group-item container song"><div class="row">
        <div class="col-2 my-auto"><img class="album-art rec-album" v-bind:src="request.cover" /></div>
        <div class="col-5 my-auto">{{request.title}}</div>
        <div class="col-5 my-auto">{{request.artist}}</div>
      </div>
      </li>


    </ul>
    </div>
  
 
  </div>
</template>

<script>


export default {
  data: () => ({
    user: {},
    autoqueue: false,
    currentSong: {},
    playing: false,
    paused: true,
    windowWidth: window.innerWidth

  }),
  mounted(){

    window.onresize = () => {
                this.windowWidth = window.innerWidth
            }

    setInterval(()=>{
      if($("#playerControls").is(':visible')){
        console.log("open")
        this.getCurrentlyPlaying()
      }

    },1000)

    this.getUpdates()
    setInterval(()=>{
      this.getUpdates()
    },1000)

    fetch("https://auxy411.ngrok.io/refresh_token",{
      method: "POST",
      headers: {
        "Content-type" :  "application/json"
      },
      body: JSON.stringify({
        "refresh_token": localStorage.spotify_refresh,
        })
      }).then(res=>res.json())
        .then(data=>{
          localStorage.auth_code = data.access_token
        })


  },
  methods: {
    play(){
      fetch("https://api.spotify.com/v1/me/player/play",{
        method: "PUT",
        headers: {
          "Authorization": "Bearer " + localStorage.auth_code
        }
      })
    },
    pause(){
      fetch("https://api.spotify.com/v1/me/player/pause",{
        method: "PUT",
        headers: {
          "Authorization": "Bearer " + localStorage.auth_code
        }
      })
    },
    next(){
      fetch("https://api.spotify.com/v1/me/player/next",{
        method: "POST",
        headers: {
          "Authorization": "Bearer " + localStorage.auth_code
        }
      })

    },
    prev(){
      fetch("https://api.spotify.com/v1/me/player/previous",{
        method: "POST",
        headers: {
          "Authorization": "Bearer " + localStorage.auth_code
        }
      })

    },
    getCurrentlyPlaying(){
      fetch("https://api.spotify.com/v1/me/player/currently-playing",{
        headers: {
          "Authorization": "Bearer " + localStorage.auth_code
        }
      }).then(res=>{
        if(res.status == 401){
          fetch("https://auxy411.ngrok.io/refresh_token",{
            method: "POST",
            headers: {
              "Content-type" :  "application/json"
            },
            body: JSON.stringify({
              "refresh_token": localStorage.spotify_refresh,
            })

          }).then(res=>res.json())
              .then(data=>{
                localStorage.auth_code = data.access_token
                this.getCurrentlyPlaying()
              })
        }else{
            return res.json()
        }
      }).then(data=>{
        this.playing = true
        console.log(data)
        this.paused = !data.is_playing
        this.currentSong = {
          title: data.item.name,
          artist: data.item.album.artists[0].name,
          albumCover: data.item.album.images[0].url,
          uri: data.item.uri
        }

      }).catch(e=>{

        this.playing = false
      })

    },
    getUpdates(){
      fetch("https://auxy411.ngrok.io/userdata",{
      headers: {
        "Authorization": "Bearer " + localStorage.jwt
      }
    }).then(res=>{
      if(res.status==401){
        localStorage.removeItem("jwt")
        this.$router.go("home")
      }else{
        return res.json()
      }

      })
    .then(data=>{

      this.user = data
      this.user.queued = this.user.queued.reverse().splice(0,10)
      this.user.code = this.user.code.toUpperCase()
    })
    },
    addToQueue(request){
      // console.log(request)
      // remove from request, send post to update request array, add to queue list, make post request to spotify api
      // MAKE SURE SPOTIFY AUTH TOKEN IS STILL VALID

      fetch("https://api.spotify.com/v1/me/player/queue?uri=" + request.uri,{
        method: "POST",
        headers: {
          "Authorization": "Bearer " + localStorage.auth_code
        },
      }).then((res)=>{
        if(res.status == 200 || res.status == 204){

        // REMOVE FROM REQUESTS ARRAY AND SEND TO SERVER
        for(let i=0; i<this.user.requests.length; i++){
          if(this.user.requests[i].uri == request.uri){
            this.user.requests.splice(i,1)
          }
        }
        

// REMOVE FROM DB AFTER ADDING TO QUEUE
        fetch("https://auxy411.ngrok.io/updaterequests",{
          method: "POST",
          headers: {
            "Authorization": "Bearer " + localStorage.jwt,
            "Content-type" :  "application/json"
          },
          body: JSON.stringify({
            "uri": request.uri,
            "request": request,
            "added": true
          })

        }).catch(e=>{
          console.log("error with updating requests")
        })

        }else if(res.status == 401){
          // alert("You need to re link your spotify account")
          // localStorage.removeItem("auth_code")
          // this.$router.push("linkspotify")

          // GET SPOTIFY AUTH TOKEN WITH REFRESH TOKEN
          fetch("https://auxy411.ngrok.io/refresh_token",{
          method: "POST",
          headers: {
            "Content-type" :  "application/json"
          },
          body: JSON.stringify({
            "refresh_token": localStorage.spotify_refresh,
          })

        }).then(res=>res.json())
        .then(data=>{
          localStorage.auth_code = data.access_token
          this.addToQueue(request)
        })


        }else{
          console.log(res.status)
          alert("An error has occured. You must be playing a song to use this app")
        }

      })
    },
    reverify(){
      fetch("https://auxy411.ngrok.io/getnewlink",{
          method: "GET",
          headers: {
            "Authorization": "Bearer " + localStorage.jwt,
            "Content-type" :  "application/json"
          }

        })
    },
    remove(request){

        for(let i=0; i<this.user.requests.length; i++){
          if(this.user.requests[i].uri == request.uri){
            this.user.requests.splice(i,1)
          }
        }
        
        fetch("https://auxy411.ngrok.io/updaterequests",{
          method: "POST",
          headers: {
            "Authorization": "Bearer " + localStorage.jwt,
            "Content-type" :  "application/json"
          },
          body: JSON.stringify({
            "uri": request.uri,
            "request": request,
            "added": false
          })

        })
    },
    logout(){
      localStorage.removeItem("jwt")
      localStorage.removeItem("auth_code")
      localStorage.removeItem("spotify_refresh")
      const url = 'https://www.spotify.com/logout/'                                                                                                                                                                                                                                                                               
      const spotifyLogoutWindow = window.open(url, 'Spotify Logout', 'width=700,height=500,top=40,left=40')                                                                                                
      setTimeout(() => spotifyLogoutWindow.close(), 1000)
      this.$router.go("/home")


    },
    clearAll(){
      fetch("https://auxy411.ngrok.io/clearall",{
        method: "POST",
        headers: {
          "Authorization": "Bearer " + localStorage.jwt,
          "Content-type" :  "application/json"
        }
      })
    },
    saveSettings(){
      this.user.autoqueue = !this.user.autoqueue
      fetch("https://auxy411.ngrok.io/updatesettings",{
        method: "POST",
        headers: {
          "Authorization": "Bearer " + localStorage.jwt,
          "Content-Type" :  "application/json"
        },
        body: JSON.stringify({
          "switch": true
        })

      }).then(res=>{

      })
    }
  }
}
</script>
<style>

@media (min-width: 800px ){
  .large{
  width: 75% !important;
}
}


#qrcode{
  color: #2c3e50 !important;
}


.dashboard{
  padding: 20px;
  margin: 30px;
  margin-top: 15px !important;;
  color: white !important;
}
.album-art{
  width: 60px;
  height: 60px;
  border-radius:20%;
}

.controls{
  width: 50px;
}

th,td{
  text-align: center;
  
}

.card {

}


button{
  color:black !important;
}
.addbutton:hover {
  background-color: #4CAF50; /* Green */
  color: white;

}
.deletebutton:hover {
  background-color: #d92121;
  color: white;
}

.addbutton,.deletebutton{
  width: 100%;
  /* border-radius: 24px!important; */
  border: 1px solid rgb(60,60,60) !important;
  background: rgb(18,18,18);
  color: white !important;

}

@media (max-width: 576px){
  .addbutton,.deletebutton {
    font-size: 75%;
    text-align: center !important;
    margin-bottom: 10px;
  }

  .rec-album{
    width: 28px;
    height: 28px
  }

}

@media (max-width: 776px){
  .addbutton,.deletebutton {
    font-size: 75%;
    text-align: center !important;
    margin-bottom: 10px;
  }

}

.btn{
  background-color: transparent !important;
  color: white !important;
  border: 1px solid white !important;

}

.btn:hover{
  background-color: #3598dc !important;
}


.song-list{
  margin-bottom: 20px !important;
}

.song{
  margin-bottom: 10px;
  background: rgb(245,245,245) !important;
  padding: 20px !important;
  border: 1.5px solid rgb(36,36,36) !important;
  /*border-bottom: 1px solid rgb(36,36,36) !important;*/
  /*border-radius: 25px !important;*/
  background:rgb(18,18,18) !important;
  color: white !important;
  

}

#app > div.dashboard.container-router > div > div > ul > li{
  padding-left: 20px !important;
}

#app > div.dashboard.container-router > div > ul > li{
  padding-left: 20px !important;
}

.request-list div{
  padding: 5px;
}

.clear{

  height: 50px;
  margin-bottom: 20px;
  border: 1px solid black !important;
  border-radius: 25px !important;
  background: #FFFFFF !important;
}

.clear:hover{
  background-color: #d92121 !important;
  height: 50px;
  border: 1px solid black;

}

/*.song:hover{*/
/*  background: rgb(245,245,245) !important;*/
/*}*/

.controls{
  width: 5px !important;
  text-align: center !important;
  /* margin-right: 10px !important; */
  color: white !important;
  font-size: 18px;
  padding-left: 20px;
  border: none !important;
}

.controls:hover{
  color: #3598dc !important;
  background-color: transparent !important
}

.media-player{
  background: rgb(36,36,36) !important;
  color: white !important;

}

.player-header{
  border-bottom: 1px solid white !important;
}

.media-player{
  border: none !important;
}

</style>