<template>

  <div class="container">



    <div v-if="errorMessage" class="alert alert-danger d-flex align-items-center" role="alert">
      <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg>
      <div class="text-center">
        {{errorMessage}}
      </div>
    </div>

    <div class="signup-form">
      <form @submit.prevent="resetpassword">
        <h2>Reset Password</h2>
        <hr>


        <div class="form-group">
          <input class="form-control" type="password" v-model="form.password" name="username" id="username" placeholder="Password" required/>
        </div>


        <div class="form-group">
          <input class="form-control" type="password" v-model="form.confirmPassword" name="password" id="password" placeholder="Confirm Password" required/>
        </div>

        <div class="form-group">
          <button type="submit" class="btn-md">Reset Password</button>
        </div>
      </form>

    </div>


  </div>
</template>

<script>
export default {
  watch: {
    form: {
      handler() {
        this.errorMessage = ''
      },
      deep: true
    },
  },
  data: () => ({
    errorMessage: "",
    form: {
        password: "",
        confirmPassword: ""
    },
    token: ""
  }),
  methods: {
    resetpassword() {
        if(this.form.confirmPassword == this.form.password && this.form.password.length >= 8){
            fetch("https://auxy411.ngrok.io/resetpassword", {
                method: "POST",
                headers: {
                "content-type": "application/json",
                },
                body: JSON.stringify({
                    token: this.token,
                    password: this.form.password
                }),
            }).then((response) => {
                return response.json()
            }).then(res=>{
                alert("Your password has been reset")
                this.$router.push("/login")
            })
        }else if(this.form.password.length < 8){
            this.errorMessage = "Password must be at least 8 characters"
        }else{
            this.errorMessage = "Passwords Dont Match"
        }
    }
  },
  mounted(){
    localStorage.removeItem("jwt")
    localStorage.removeItem("auth_code")
    localStorage.removeItem("spotify_refresh")

    const params = new URLSearchParams(window.location.search)
    this.token = params.get("token")
  }
}
</script>

<style>

form{
  margin: 20px;
}
.container{
  padding-left: 0 !important
}

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

</style>

// add error message