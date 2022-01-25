1. The user can log in through the main web app to link their Spotify accounts to the app itself.

2. User first arrive at landing page, which contains a button to start the login process.

3. The login process is **atomic**, the entire transaction either takes place or fails.

4. User is prompted to enter their username and the password they created during the [signup process](Signup.md).

5. The database will be queried to see if such an user exists, if not, the user will be prompted to [sign up for the service](Signup.md).

6. If the password is autenticated, log the user in directly.

7. If the password fails, prompt the user to enter the password again.

8. When the user logs in, guide them to the dashboard if the Spotify account is linked. Otherwise, prompt them to link their Spotify account.

9. If the user forgot their password, prompt them to enter the username. If there is an username associated with that account, a personalized password reset link will be texted to the phone number associated with the account if it exists.