# Render deployment

The Render Blueprint is defined in `render.yaml`. To connect it:

1. In Render, create a Blueprint from this GitHub repository and select the `master` branch.
2. Set `MONGO_URI`, `EMAIL_USER`, `EMAIL_PASS`, and `FRONTEND_URL` when prompted (or later in the service's Environment settings). Keep these values private.
3. Confirm the service. Render generates `JWT_SECRET` for the service.
4. In the Render service settings, use **After CI Checks Pass** for auto-deploys. The Blueprint sets `autoDeployTrigger: checksPass` so pushes deploy only after the GitHub Actions CI workflow succeeds.

The web service runs `npm ci` to build and `npm start` to launch. Render supplies `PORT` at runtime; the server already reads it.
