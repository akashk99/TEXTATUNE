<template class="home">
  <div class="home">
    <div class="row" style="padding-top:30vh">
      <div class="col-12 my-auto mx-auto" style="height: 10vh;" v-if="!jwt"><h1><strong>TEXT-A-TUNE</strong></h1></div>
      <div class="col-12 my-auto mx-auto" style="height: 10vh; padding-left: 25px" v-else><h1><strong>Welcome Back, {{user.firstname}}</strong></h1></div>
    </div>

    <div class="row">
      <div class="col-12 my-auto mx-auto home-btns" style="height: 10vh; padding-left: 12px" v-if="!jwt">
        <div class="btn-group">
            <button class="" @click="$router.push('/howto')" style="">Learn More</button>
             <button class=""  @click="$router.push('/signup')" style="">Sign Up Now</button>
             </div>
      </div>
            <div class="col-12 my-auto mx-auto" style="height: 10vh; padding-left: 30px" v-else>
             <button class="" @click="$router.push('/dashboard')">Go to Dashboard</button>
      </div>
      
    </div>

  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  data: ()=>({
    jwt: localStorage.jwt,
    user: {}
  }),
  mounted(){
    // console.log(window.location.href.split(".io")[1])
    //
    //
    // fetch(('https://auxy411.ngrok.io/callback' + window.location.href.split(".io")[1]),{mode: "no-cors", credentials: 'include'})

    if(this.jwt){
      fetch("https://auxy411.ngrok.io/userdata",{
        headers: {
          "Authorization": "Bearer " + localStorage.jwt
        }
      }).then(res=>{
        if(res.status==401){
          localStorage.removeItem("jwt")
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
}
</script>
<style>

.home{
  padding: 50px  50px 0px 25px;
  color: white !important;
  background-image: url("../assets/background8.png") !important;
      position: absolute;
  background-size:contain;
  padding-top: 20px !important;
background-position:center;
      width: 100%;

      height: 100%;

      background-size: cover;
       
  
}


.home button{
  background: none !important;
  border: 1px solid white !important;
  color: white !important;
  margin-right: 15px;
}

.home button:hover{
  background: white !important;
  color: black !important;
}

.jumbotron{
  border-radius: 25px;
}

.btn{
  background: #3598dc !important;
  margin-right: 20px;
  margin-bottom: 20px;
  height: 55px;
  width: 175px;
}


</style>
