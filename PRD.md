# Product Requirements Document

## Product

Local Sports & Indoor Games Partner Finder Platform branded here as `PlayCircle`.

## Problem

People often want to play recreational games but cannot easily find nearby partners with similar interests, skill levels, or schedules. Coordination is usually fragmented across WhatsApp groups and word-of-mouth.

## Primary goals

- Help users discover nearby partners by game type and location
- Increase local participation in indoor and outdoor games
- Strengthen neighborhood and society-level engagement
- Reduce friction in arranging casual play sessions

## In scope

- Responsive web platform
- User profile creation and management
- Game preferences, skill level, and availability
- Search and matchmaking filters
- Play request sending and response flow
- Optional community management module
- Admin visibility and lightweight moderation

## Out of scope

- Native mobile apps
- Tournament brackets and scoring engines
- Paid coaching and pro training workflows
- Real-time chat and calling in phase 1

## Core entities

- `User`
- `GameCategory`
- `Community`
- `PlayRequest`

## Frontend architecture

- Next.js App Router
- Shared animated shell and responsive layout
- Route-based modules for home, discover, requests, communities, and admin
- Mock data layer today, prepared for API integration next

## Backend architecture

- Express REST API
- MongoDB with Mongoose models
- Controllers for user discovery, requests, communities, games, and admin metrics
- Seed service for bootstrapping sample data

## Future enhancements

- Login sessions and authentication
- Ratings and reviews
- AI-based partner recommendations
- Map-based search and geocoded distance filters
- Chat, notifications, and event reminders
