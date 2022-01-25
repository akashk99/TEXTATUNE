<template>
  <div class="container-fluid px-0">
    <nav class="navbar navbar-expand-lg navbar-dark bg-black py-0 px-0"> <a class="navbar-brand" href="#"><strong><i>Auxy</i></strong></a> <button class="navbar-toggler mr-3" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation"> <span class="navbar-toggler-icon"></span> </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item"> <a class="nav-link" href="#">Features</a> </li>
          <li class="nav-item"> <a class="nav-link" href="#">Why Webflow</a> </li>
          <li class="nav-item"> <a class="nav-link" href="#">Resources</a> </li>
          <li class="nav-item"> <a class="nav-link" href="#">Blog</a> </li>
          <li class="nav-item dropdown right">
            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Hello, {{user.firstname}}
            </a>
            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
              <a class="dropdown-item right" href="#">Dashboard</a>
              <a class="dropdown-item right" href="#">Settings</a>
              <div class="dropdown-divider"></div>
              <a class="dropdown-item" href="#">Logout</a>
            </div>
          </li>
          <!--            <li class="nav-item right"> <a class="nav-link" href="#">#MadeInWebflow</a> </li>-->
          <!--            <li class="nav-item active"> <a class="nav-link" href="#">Dashboard</a> </li>-->
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'Navbar',
  props: {
    msg: String
  }
}
</script>

<style>

</style>