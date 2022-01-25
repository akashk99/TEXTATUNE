<template>

  <div class="container">

    <!-- Forgot password modal -->
    <div class="modal fade" id="forgotpassword" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header text-center d-block">
              <h5 class="modal-title" id="exampleModalLabel">Forgot Password</h5>
            </div>
            <div class="modal-body">
              <div v-if="!showInstructions">
              <form @submit.prevent="forgotPassword">
                <input type="text" v-model="forgotusername" name="username" id="forgotusername" placeholder="Email or Username" required/>
              </form>
              </div>
              <div v-else>If an account associated with: {{forgotusername}} exists, password reset instructions will be texted to the phone number associated with that account</div>
            </div>
            <div class="modal-footer  text-center">
              <button type="submit" class="btn-md" @click="forgotPassword()" v-if="!showInstructions" >Reset Password</button>
              <button type="button" class="btn-md" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>


    <div v-if="errorMessage" class="alert alert-danger d-flex align-items-center" role="alert">
      <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg>
      <div class="text-center">
        {{errorMessage}}
      </div>
    </div>

    <div class="signup-form">
      <form @submit.prevent="login">
        <h2>Login</h2>
        <hr>


        <div class="form-group">
          <input class="form-control" type="text" v-model="user.username" name="username" id="username" placeholder="Email or Username" required/>
        </div>


        <div class="form-group">
          <input class="form-control" type="password" v-model="user.password" name="password" id="password" placeholder="Password" required/>
        </div>

        <div class="form-group">
          <button type="submit" class="btn-md">Login</button>
        </div>
        <div class="hint-text">Don't have an account? <router-link to="/signup">Sign up here</router-link></div>
        <div class="hint-text">Forgot Password? <a href="" v-on:click="showInstructions = false; forgotusername=''" data-target="#forgotpassword" data-toggle="modal">Click Here</a></div>
      </form>

    </div>


  </div>
</template>

<script>
export default {
  watch: {
    user: {
      handler() {
        this.errorMessage = ''
      },
      deep: true
    }
  },
  data: () => ({
    errorMessage: "",
    user: {
      username: "",
      password: "",
    },
    forgotusername: "",
    showInstructions: false
  }),
  methods: {
    login() {
      fetch("https://auxy411.ngrok.io/login", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(this.user),
      }).then((response) => {
        if (response.status == 404) {
          console.log(response)

          this.errorMessage = "Error with login. Please check username and password and try again";
        } else {
          return response.json()
        }
      }).then((res)=> {
        if(res.token){
          localStorage.jwt = res.token
          if(res.refresh_token == ""){
            this.$router.go("/linkspotify")
          }else{
            localStorage.spotify_refresh = res.refresh_token
            this.$router.go("/dashboard")
          }

          console.log(res.token)
        }else{
          this.errorMessage = res.message
        }
       
      
      });
    },

    forgotPassword(){
      this.showInstructions = true
      console.log(this.forgotusername)

      fetch("https://auxy411.ngrok.io/forgotpassword",{
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({username: forgotusername}),
      })
      // make call to backend that generates link with jwt to forgot password page, get their new password, confirm it and then send that and the jwt back to the server. use the jwt to figure out which user to change the password for
    }
  },
  mounted(){
      localStorage.removeItem("jwt")
      localStorage.removeItem("auth_code")
      localStorage.removeItem("spotify_refresh")
  }
}
</script>

<style>



body {
  color: #fff;
  background: #3598dc;
  font-family: 'Roboto', sans-serif;
}
.form-control{
  height: 41px;
  background: rgb(33,33,33);
  box-shadow: none !important;
  border: none;
}
.form-control:focus{
  background: #e2e2e2;
}
.form-control, .btn{
  border-radius: 3px;
}
.signup-form{
  width: 390px;
  margin: 30px auto;
}
.signup-form form{
  color: #999;
  border-radius: 3px;
  margin-bottom: 15px;
  background: #fff;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  padding: 30px;
}
.signup-form h2 {
  color: #333;
  font-weight: bold;
  margin-top: 0;
}
.signup-form hr {
  margin: 0 -30px 20px;
}
.signup-form .form-group{
  margin-bottom: 20px;
}
.signup-form input[type="checkbox"]{
  margin-top: 3px;
}
.signup-form .row div:first-child{
  padding-right: 10px;
}
.signup-form .row div:last-child{
  padding-left: 10px;
}
.signup-form .btn{
  font-size: 16px;
  font-weight: bold;
  background: #3598dc;
  border: none;
  min-width: 140px;
}
.signup-form .btn:hover, .signup-form .btn:focus{
  /*background: #2389cd !important;*/
  outline: none;
}
.signup-form a{
  color: #fff;
  text-decoration: underline;
}
.signup-form a:hover{
  text-decoration: none;
}
.signup-form form a{
  color: #3598dc;
  text-decoration: none;
}
.signup-form form a:hover{
  text-decoration: underline;
}
.signup-form .hint-text {
  padding-bottom: 15px;
  text-align: center;
}

form{
  margin: 20px !important;
}
.container{
  padding-left: 0 !important
}
</style>

