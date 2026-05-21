# BRaket Selenium QA Tester

Selenium automated input-validation tests for:

- Registration
- Profile creation

## Setup

```bash
cd Tester
npm install
copy .env.example .env
```

Update `.env` with real QA accounts and a duplicate email/username that already
exist in your test database.

Start BRaket in another terminal:

```bash
cd ..
npm run dev
```

## Browser UI

For a nicer visual runner:

```bash
npm run ui
```

The dashboard opens at `http://localhost:4188` by default. Use the buttons on
that page to run Registration, Profile Creation, or all Selenium QA tests.

## CLI Fallback

Run the tests directly:

```bash
npm run test:registration
npm run test:profiles
npm test
```

## Covered Checks

- Required registration fields
- Duplicate registration email
- Successful account creation request
- Required client profile fields
- Duplicate username from profile identity settings
- Successful client profile creation/update
- Required talent profile fields
- Successful talent profile creation step
