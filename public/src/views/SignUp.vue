<template>
  <div class="container">


    <div v-if="errorMessage" class="alert alert-danger d-flex align-items-center" role="alert">
      <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg>
      <div class="text-center">
        {{errorMessage}}
      </div>
    </div>



    <div class="signup-form">
      <form @submit.prevent="signup">
        <h2>Sign Up</h2>
        <p>Please fill in this form to create an account!</p>
        <hr>
        <div class="form-group">
          <div class="row">
            <div class="col-sm-6">
              <input class="form-control" type="text" v-model="user.firstname" name="fname" id="fname" placeholder="First Name" required/>
            </div>
            <div class="col-sm-6">
              <input type="text" v-model="user.lastname" name="lname" id="lname" class="form-control" placeholder="Last Name" required/>
            </div>
          </div>
        </div>

        <div class="form-group">
          <input class="form-control" type="text" v-model="user.username" name="username" id="username" placeholder="Username" required/>
        </div>

        <div class="form-group">
          <input class="form-control" type="email" v-model="user.email" name="email" id="email" placeholder="Email" required/>
        </div>


        <div class="form-group">
          <input class="form-control" type="password" v-model="user.password" name="password" id="password" placeholder="Password" required/>
        </div>

        <div class="form-group">
          <input class="form-control" type="password" v-model="confirmPassword" name="confirmpassword" id="confirmpassword" placeholder="Confirm Password" required/>
        </div>

        <div class="form-group">
          <input class="form-control" type="text" v-model="user.organization" name="organization" id="organization" placeholder="Organization (Optional)"/>
        </div>

        <div class="form-group">
          <input class="form-control" type="tel" v-model="user.phonenumber" name="phonenumber" id="phonenumber" maxlength="12" placeholder="Phone Number" required/>
        </div>

        <div class="form-group">
          <input class="form-control" type="text"  maxlength="6" v-model="user.code" name="code" id="code" placeholder="Choose a Session Code (Optional)" />
          <small>Must be 4-6 letters. Leave blank to get a random unique code</small>
        </div>

        <!-- <div class="form-group">
          <label class="checkbox-inline"><input type="checkbox" required="required"> I accept the <a href="#">Terms of Use</a> &amp; <a href="#">Privacy Policy</a></label>
        </div> -->
        <div class="form-group">
          <button type="submit" class="btn-md">Sign Up</button>
        </div>
        <div class="hint-text">Already have an account? <router-link to="/login">Login here</router-link></div>
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
    },
    confirmPassword: {
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
      code: "",
      organization: "",
      firstname: "",
      lastname: "",
      phonenumber: "",
      email: ""
    },
    confirmPassword: ""
  }),
  mounted(){
      localStorage.removeItem("jwt")
      localStorage.removeItem("auth_code")
      localStorage.removeItem("spotify_refresh")
  },
  methods: {
    signup() {
      if(this.confirmPassword === this.user.password){
        fetch("https://auxy411.ngrok.io/signup", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(this.user),
        }).then((response) => {
            
            return response.json()
        }).then((res)=> {
          console.log(res)
          if(res.message){
            this.errorMessage = (res.message)
          }else if(res.error){
            this.errorMessage = (res.error.details[0].message)
          }

          if(res.token){
            localStorage.jwt = res.token
            this.$router.go("/linkspotify")
            console.log(res.token)
          }

      
        })
      }else{
        this.errorMessage = "Passwords don't match"
      }
    },
  },
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
  background: #f2f2f2;
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

@media (max-width: 574px) {
  #fname{
    margin-bottom:20px;
  }
  #lname{
    margin-left: 2px;
  }
}
</style>
