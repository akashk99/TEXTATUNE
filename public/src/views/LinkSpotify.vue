<template>
  <div class="link-spotify-container">
    <div class="link my-auto" style="padding-top:30vh" v-if="!loading">
      <h1>Link Your Spotify Account</h1>
      <br>
      <button class="btn-md" style="color:white !important" v-on:click="link">Link Spotify</button>
    </div>
    <div class="loading" style="margin-top: 20vh;" v-else>
      <img src="../assets/loading3.gif"/>
      <br>
      <br>
      <h5>Click <router-link to="dashboard">here</router-link> if not redirected in 10 seconds</h5>
    </div>
  </div>
</template>

<script>


export default {
  data: () => ({
    loading: false
  }),
  mounted(){

    if(localStorage.refresh_token){
       this.$router.go("dashboard")
    }

    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1);
    while (e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }

    var params = hashParams


    var access_token = params.access_token,
        refresh_token = params.refresh_token,
        error = params.error;

    if(access_token){

      this.loading = true
      fetch("https://auxy411.ngrok.io/storerefresh",{
          method: "POST",
          headers: {
            "Authorization": "Bearer " + localStorage.jwt,
            "Content-type" :  "application/json"
          },
          body: JSON.stringify({
            "refresh": refresh_token,
          })

        }).then(res=>{
          localStorage.auth_code = access_token
          localStorage.spotify_refresh = refresh_token
          this.$router.go("dashboard")
      })

    }
          
  },
  methods: {
    link() {
      window.location.href = "https://auxy411.ngrok.io/link"
    },
  },
}
</script>

<style>
  .link-spotify-container{
    padding: 30px;
    color: white;
  }
</style>

// figure out what happens when these auth token and jwt expire
