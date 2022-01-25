<template>
  <div class="container">

    <div class="settings-form">
      <form @submit.prevent="">

        <h2>My Account</h2>
        <hr>
        <div>

          Balance: ${{user.balance.toFixed(2)}}
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <label class="input-group-text">Reload</label>
            </div>
            <select class="custom-select" v-model="amount" id="reloadoptions">
              <option selected>Choose an amount</option>
              <option value="0">$5</option>
              <option value="1">$10</option>
              <option value="2">$20</option>
              <option value="3">$30</option>
            </select>

          </div>
          <button v-if="amount !='Choose an amount'" class="btn-md" @click="checkout()">Checkout</button>
        </div>
        <br>
        <hr>
        <h6 style="color:black; text-align:center">Autoqueue: </h6>
        <div class="form-check form-switch">
          <input class="form-check-input" v-model="user.autoqueue" type="checkbox" id="flexSwitchCheckDefault">
        </div>
        <br>

      

        <div class="form-group">
          <button  v-on:click="$router.push('/dashboard')" style="height: 40px; margin-right: 10px;" class="btn-md">Back</button>
          <button type="submit" @click="saveSettings()" style="height: 40px" class="btn-md">Save</button>
        </div>
        <hr>

        

      </form>

    </div>

    


  </div>
</template>

<script>
export default {
  data: () => ({
    user: {},
    amount: "Choose an amount"
  }),
  mounted(){
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
  },
  methods: {
    changePassword(){
      window.location.href='https://auxy411client.ngrok.io/resetpassword'
    },
    saveSettings(){
      fetch("https://auxy411.ngrok.io/updatesettings",{
        method: "POST",
        headers: {
          "Authorization": "Bearer " + localStorage.jwt,
          "Content-Type" :  "application/json"
        },
        body: JSON.stringify({
          "autoqueue": this.user.autoqueue
        })

      }).then(res=>{
        console.log("pushed")
        this.$router.push("/dashboard")
      })
    },
    checkout(){
      fetch("https://auxy411.ngrok.io/checkout",{
        method: "POST",
        headers: {
          "Authorization": "Bearer " + localStorage.jwt,
          "Content-Type" :  "application/json"
        },
        body: JSON.stringify({
          amount: this.amount
        })
      }).then(data=>data.json()).then(json=>{
        window.location.href = json.url
      })
    }
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
.settings-form{
  width: 390px;
  margin: 30px auto;
}
.settings-form form{
  color: #999;
  border-radius: 3px;
  margin-bottom: 15px;
  background: #fff;
  box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.3);
  padding: 30px;
}
.settings-form h2 {
  color: #333;
  font-weight: bold;
  margin-top: 0;
}
.settings-form hr {
  margin: 0 -30px 20px;
}
.settings-form .form-group{
  margin-bottom: 20px;
}
.settings-form input[type="checkbox"]{
  margin-top: 3px;
}
.settings-form .row div:first-child{
  padding-right: 10px;
}
.settings-form .row div:last-child{
  padding-left: 10px;
}
.settings-form .btn{
  font-size: 16px;
  font-weight: bold;
  background: #3598dc;
  border: none;
  min-width: 140px;
}
.settings-form .btn:hover, .settings-form .btn:focus{
  background: #2389cd !important;
  outline: none;
}
.settings-form a{
  color: #fff;
  text-decoration: underline;
}
.settings-form a:hover{
  text-decoration: none;
}
.settings-form form a{
  color: #3598dc;
  text-decoration: none;
}
.settings-form form a:hover{
  text-decoration: underline;
}
.settings-form .hint-text {
  padding-bottom: 15px;
  text-align: center;
}

</style>

// add error message