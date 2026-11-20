# A4 Auth API

A secure Express API that uses Supabase Auth for sign up, log in and log out, verifies JSON Web Tokens, and protects routes with middleware. Built for FlyRank Internship, Backend Track, Week 2, Assignment A4.

## Setup

1. Clone this repo and open the folder.
2. Run `npm install`.
3. Copy `.env.example` to `.env` and fill in:
   - `SUPABASE_URL`: your Supabase Project URL
   - `SUPABASE_KEY`: your Supabase anon (publishable) key. Never use the service_role key.
   - `PORT`: optional, defaults to 3000
4. In Supabase, go to Authentication > Sign In / Providers > Email and turn off "Confirm email" (practice project only).

## Run

`npm start`

Then open http://localhost:3000/docs for the interactive Swagger UI.

## How authentication works

When the user logs in, the database returns a token back to the user. Then the user sents it to an Authorization header and then transfer the token to the middle to check and then come back to the user. Then what happens to the check, it will redirect the user to its respective route if it an error or a success. 