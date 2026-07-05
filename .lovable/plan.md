# Proposal Responses — Save & View Plan

## Problem
Right now the date and food choices only live in browser state. When someone completes the form, there is no way for you to know what they picked. You want a private page to view all responses, and multiple people should be able to use the link.

## Solution Overview
1. Enable **Lovable Cloud** (gives you a built-in database + auth).
2. Create a `responses` table to store each submission.
3. Save the response when the user reaches the final confirmation screen.
4. Add **authentication** so only you can log in and view submissions.
5. Build a private **/responses** page that lists every date + food choice.

## Plan

### 1. Enable Lovable Cloud
Enable Lovable Cloud on this project so we get a database and authentication out of the box.

### 2. Database — `responses` table
Create a `responses` table with:
- `id` (UUID, primary key)
- `date` (text) — the chosen date string
- `food` (text) — the chosen food
- `created_at` (timestamp)

Add grants, enable RLS, and create a policy allowing anonymous inserts (any visitor can submit) but only authenticated users can read.

### 3. Save submission on confirmation
Add a `createServerFn` that inserts `{ date, food }` into the `responses` table. Call this function from the `DoneStep` component (or right before it) when the user finishes the form. No user login required to submit — it is an open form.

### 4. Authentication
Add a simple login/logout flow (Lovable Cloud auth). Only you need an account. After logging in, you can access the private page.

### 5. Private `/responses` route
Create a protected route at `/responses` (under `_authenticated/` layout) that:
- Lists every response with the chosen date, food, and timestamp
- Is only accessible after logging in

## Tech choices
- **Lovable Cloud** for database + auth (zero external setup needed)
- `createServerFn` for saving and fetching responses
- Protected route under `_authenticated/` for the private viewing page
- Simple table/card layout for the response list

## Result
- Anyone with the link can open the proposal, pick a date, pick food, and submit
- Only you, after logging in, can visit `/responses` and see every submission