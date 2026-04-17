# Release Notes for Google Play Console

**Version:** 1.0.0
**Version Code:** 44

## Release Notes (Copy & Paste this into the Play Console release description):

### Short Description
Stability and UX optimizations for the True North Android experience.

### Full Release Notes (en-US)
* Fixed an issue during account creation where free tier defaults were incorrectly overwriting successful premium subscriptions.
* Resolved a presentation bug where Spiritual Insights (Daily Advice) appeared as unformatted JSON instead of human-readable guidance.
* Enhanced UI layout bounds to seamlessly extend dark theme backdrops behind Android system navigation bars.
* Improved context-awareness of the Nur Companion AI, enabling deep conversational history tracking across multi-turn chats.
* Removed hardcoded Apple Login placeholders from Android registration screens.
* Various security enhancements and background optimizations.

---

### Internal Developer Summary of Fixes (v44)
- **ContentAgent & Gemini Payload:** Added robust Regular Expression fallbacks in `ContentAgentService.ts` to seamlessly extract advice fields when `JSON.parse` fails due to unexpected formatting limits from the Gemini API.
- **Paywall Gating & Onboarding Sync:** Addressed a critical state override in `OnboardingScreen.tsx` where completing onboarding forced `setSubscriptionTier('free')`, overriding active local states.
- **Nur AI Conversational Memory:** Swapped rigid single-turn prompt endpoints with `generateChat` implementations allowing structured, full-session JSON history payloads mapped between User and Assistant.
- **Layout SafeAreas:** Hardened `app.json` Android settings to apply `#000000` to the System Navigation Bar, curing bottom-edge white gaps on full bleed layouts.
