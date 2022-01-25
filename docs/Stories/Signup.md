1. User sign-up will be an **atomic** process.

2. As a user, I want to be able to sign up for the service through the website so I can manage a song queue in my own Spotify.

3. The user will be able to link their Spotify account to their personal account on the service through this process.

4. If the user signs up with an already existing user detail, roll back the process and prompt the user to start again. (Session code, email, phone, username must be unique)

5. To sign up, user will be prompted to enter the details of the username, password, organization (optional), phone number, email, and session code.

6. Passwords must abide by the following rules: **at least 8 characters**.

7. Then the phone number will recieve a verification link, which is used to activate the account.

8. After the user is created, their credentials will be stored inside the database, the password will be salted then hashed.

9. After signup, the user will then be prompted to link to their spotify account.