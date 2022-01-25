<template>
  <div id="app">

    <div class="container-fluid px-0">
      <nav class="navbar navbar-expand-lg navbar-dark py-0 px-0" style="background: rgb(18,18,18); margin: 15px"> <router-link class="navbar-brand" to="/"><strong><span style="border: 1px solid white; padding:10px">TEXT-A-TUNE</span></strong></router-link> <button class="navbar-toggler mr-3" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation"> <span class="navbar-toggler-icon"></span> </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item"> <router-link class="nav-link" to="/howto">Getting Started</router-link> </li>


            <li class="nav-item dropdown right" v-if="token">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Hello, {{user.firstname}}
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                <router-link class="dropdown-item right" to="/dashboard">Dashboard</router-link>
                <router-link class="dropdown-item right" to="#" data-bs-toggle="modal" data-bs-target="#qrcodemodal">QR Code</router-link>
                <router-link class="dropdown-item right" to="/settings">My Account</router-link>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" v-on:click="logout">Logout</a>
              </div>
            </li>
            <li class="nav-item right" v-if="!token"> <router-link class="nav-link" to="/login">Login</router-link> </li>
            <li class="nav-item right" v-if="!token" style="margin-left: 0px;"> <router-link  class="nav-link" to="/signup">Sign Up</router-link> </li>

          </ul>
        </div>
      </nav>

      <div class="modal fade" id="qrcodemodal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
              <button type="button" class="btn-md" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>


    </div>

    <router-view class="container-router"/>

    <!-- <footer class="page-footer font-small blue">

      <!-- Copyright -->
      <!-- <div class="footer-copyright text-center py-3 text-white">© 2021 Copyright:
        <router-link to="/home">Auxy</router-link>
      </div> -->
      <!-- Copyright -->

    <!-- </footer> --> 
  </div>
</template>

<script>

export default {
  data: () => ({
    token: localStorage.jwt,
    user: {}
  }),
  mounted(){

    if(this.token){

        fetch("https://auxy411.ngrok.io/userdata",{
          headers: {
            "Authorization": "Bearer " + localStorage.jwt
          }
        }).then(res=>{
          if(res.status==401){
            localStorage.removeItem("jwt")
            this.token =""
            this.$router.push("login")
          }else{
            return res.json()
          }

        })
            .then(data=>{

              this.user = data
            })

    }
  },
  methods: {
    logout(){
      localStorage.removeItem("jwt")
      localStorage.removeItem("auth_code")
      localStorage.removeItem("spotify_refresh")
      const url = 'https://www.spotify.com/logout/'                                                                                                                                                                                                                                                                               
      const spotifyLogoutWindow = window.open(url, 'Spotify Logout', 'width=700,height=500,top=40,left=40')                                                                                                
      setTimeout(() => spotifyLogoutWindow.close(), 3000)

      this.$router.go("/home")

    }
  },
}
</script>
<style>

/*@media (min-width: 576px) {*/
/*  .container-router {*/
/*    padding-left: 100px !important;*/
/*    padding-right: 100px !important;*/
/*  }*/
/*}*/

.container-router{

    padding-left: 0;

}


@import url('https://fonts.googleapis.com/css2?family=Lato&family=Outfit&family=Roboto+Condensed&display=swap');
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-color: rgb(18,18,18);
  font-family: 'Roboto Condensed', sans-serif !important;
}

.btn-md:hover{
  background-color: #3598dc !important;
  color: black !important;
  border: 1px solid black;
}

.bg-black {
  background-color: rgb(18,18,18) !important;
}

.navbar-brand {
  padding: 11px 20px;
  padding-bottom: 8px !important;
}

.active {
  background-color: blue
}

.navbar-nav {
  width: 100%
}

.nav-link {
  color: #fff !important
}

.nav-item {
  padding: 6px 12px;
  text-align: center
}

.nav-link:hover {
  color: #3598dc !important;
}

.right {
  margin-left: auto
}

.navbar-collapse.collapse.in {
  display: block !important
}

@media (max-width: 992px) {
  .right {
    margin-left: 0
  }

  .nav-item {
    width: 100%;
    text-align: left;

  }

}



.button,
button,
input[type="submit"],
input[type="reset"],
input[type="button"] {
  display: inline-block;
  height: 38px;
  padding: 0 30px;
  color: #555;
  text-align: center;
  font-size: 11px;
  font-weight: 600;
  line-height: 38px;
  letter-spacing: .1rem;
  text-transform: uppercase;
  text-decoration: none;
  white-space: nowrap;
  background-color: transparent;
  border-radius: 4px;
  border: 1px solid #bbb;
  cursor: pointer;
  box-sizing: border-box; }
.button:hover,
button:hover,
input[type="submit"]:hover,
input[type="reset"]:hover,
input[type="button"]:hover,
.button:focus,
button:focus,
input[type="submit"]:focus,
input[type="reset"]:focus,
input[type="button"]:focus {
  color: #333;
  border-color: #888;
  outline: 0; }
.button.button-primary,
button.button-primary,
input[type="submit"].button-primary,
input[type="reset"].button-primary,
input[type="button"].button-primary {
  color: #FFF;
  background-color: #33C3F0;
  border-color: #33C3F0; }
.button.button-primary:hover,
button.button-primary:hover,
input[type="submit"].button-primary:hover,
input[type="reset"].button-primary:hover,
input[type="button"].button-primary:hover,
.button.button-primary:focus,
button.button-primary:focus,
input[type="submit"].button-primary:focus,
input[type="reset"].button-primary:focus,
input[type="button"].button-primary:focus {
  color: #FFF;
  background-color: #1EAEDB;
  border-color: #1EAEDB; }


input[type="email"],
input[type="number"],
input[type="search"],
input[type="text"],
input[type="tel"],
input[type="url"],
input[type="password"],
textarea,
select {
  height: 38px;
  padding: 6px 10px; /* The 6px vertically centers text on FF, ignored by Webkit */
  background-color: #fff;
  border: 1px solid #D1D1D1;
  border-radius: 4px;
  box-shadow: none;
  box-sizing: border-box; }
/* Removes awkward default styles on some inputs for iOS */
input[type="email"],
input[type="number"],
input[type="search"],
input[type="text"],
input[type="tel"],
input[type="url"],
input[type="password"],
textarea {
  -webkit-appearance: none;
     -moz-appearance: none;
          appearance: none; }
textarea {
  min-height: 65px;
  padding-top: 6px;
  padding-bottom: 6px; }
input[type="email"]:focus,
input[type="number"]:focus,
input[type="search"]:focus,
input[type="text"]:focus,
input[type="tel"]:focus,
input[type="url"]:focus,
input[type="password"]:focus,
textarea:focus,
select:focus {
  border: 1px solid #33C3F0;
  outline: 0; }
label,
legend {
  display: block;
  margin-bottom: .5rem;
  font-weight: 600; }
fieldset {
  padding: 0;
  border-width: 0; }
input[type="checkbox"],
input[type="radio"] {
  display: inline; }
label > .label-body {
  display: inline-block;
  margin-left: .5rem;
  font-weight: normal; }


  th,
td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid #E1E1E1; }
th:first-child,
td:first-child {
  padding-left: 0; }
th:last-child,
td:last-child {
  padding-right: 0; }


.navbar .login-btn {
  position: absolute;
  top: 0px;
  right: 15px;
}
@media (max-width: 767px) {
  .navbar .login-btn {
    right: 75px;
  }
}

.nav-link{
    margin-left: 10px !important
  }

/* Larger than mobile */
@media (min-width: 400px) {}

/* Larger than phablet (also point when grid becomes active) */
@media (min-width: 550px) {}

/* Larger than tablet */
@media (min-width: 750px) {}

/* Larger than desktop */
@media (min-width: 1000px) {}

/* Larger than Desktop HD */
@media (min-width: 1200px) {}

</style>
