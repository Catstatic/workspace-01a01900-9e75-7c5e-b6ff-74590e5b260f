# AI Transfer — Stepwise Copy-Paste Prompt

I am attaching two GitHub repositories.

==================================================
REPOSITORY LINKS
==================================================

LATEST / CURRENT TRACKER REPOSITORY:
https://github.com/Catstatic/NEW-LATEST-TRACKER-FINAL-FINAL-FINAL

OLDER SOURCE REPOSITORY CONTAINING index.html:
https://github.com/ESV43/NET-TRACKER-BRO

Use the Catstatic repository as the canonical latest tracker source. Use the ESV43 repository only as the older index.html/AI source repository and fetch only the files genuinely required for the AI transfer.

==================================================
MAIN OBJECTIVE
==================================================

The latest tracker repository is the canonical project.

The goal is to transfer every useful AI feature from the older repository's index.html into the latest tracker HTML, while improving the AI system where possible.

The final result must contain all useful AI features from index.html, but the latest tracker's current features, data, themes, games, styling, and functionality must not be damaged.

MAIN TARGET FILE:

CSIR_GATE_Tracker_Physics_Lab_edited (3).html

Do not replace the latest tracker with index.html.
Do not copy the entire old HTML over the latest HTML.
Do not redesign the application aggressively.
Merge features surgically and preserve the latest tracker as the base.

==================================================
VERY IMPORTANT GITHUB FILE RULE
==================================================

Do not add useless files from either GitHub repository.

Only inspect, download, or copy files that are genuinely required for this AI transfer.

Do NOT download or add:

- Unrelated books.
- PDFs.
- Textbooks.
- Repository documentation.
- Screenshots.
- Sample projects.
- Python scripts that are not required.
- Node modules.
- Build folders.
- Cache folders.
- Test exports.
- Duplicate HTML files.
- Unrelated images.
- Git metadata.
- .github folders.
- README files unless needed for API instructions.
- Any repository extras that are not required by the final tracker.

If a file is not clearly required, do not copy it.
If you are unsure whether a file is needed, stop and ask before downloading it.

Preserve the required files already belonging to the latest tracker, including where present:

- CSIR_GATE_Tracker_Physics_Lab_edited (3).html
- index.html
- gate-pyq-data.js
- gate-answer-overrides.js
- gate-source/
- content-data.js
- content-figures/
- Existing Markdown files.
- Existing required local assets.

Do not delete important files.
Do not recreate deleted backups.
Do not add repository clutter.
Keep the final project lean.

==================================================
FEATURES THAT MUST BE PRESERVED
==================================================

The latest tracker already contains important completed systems. Preserve all of them:

- All current themes.
- White Room visual direction.
- Ayanokoji modes.
- Horikita, Ryuuen, Ichinose, Sakayanagi, Sung Jinwoo, Tang San, Klein, Aincrad, Physics Lab, and other character systems.
- Theme-specific typography and visual effects.
- CSIR-NET simulator.
- GATE simulator.
- Official CSIR Part A, B, and C attempt limits.
- Official CSIR marking scheme.
- GATE question banks.
- GATE question images.
- GATE answer overrides.
- PYQ history and scoring.
- Roadmap and subject progress.
- Content Vault.
- Content figures.
- Markdown and LaTeX rendering.
- Code-block and ASCII diagram rendering.
- Notes system.
- Note image upload and clipboard paste.
- To-Do system.
- Reminders.
- Pomodoro.
- Dashboard and Command Center.
- Weekly reports.
- Games.
- Game scores, levels, achievements, and history.
- Full backup and restore.
- Responsive layout.
- Keyboard accessibility.
- Focus states.
- Reduced-motion support.
- Current video-resource behavior.
- Existing local-first privacy model.

Do not change official PYQ answers, official scoring, or official question data through AI.

AI-generated content must remain clearly separate from official content.

==================================================
AI PROVIDER REQUIREMENT
==================================================

The AI system must be provider-agnostic.

Do not design it around only one provider.

The user must be able to configure different providers from the AI Settings panel, including:

- OpenAI.
- Google Gemini.
- Anthropic Claude.
- OpenRouter.
- Groq.
- DeepSeek.
- Mistral.
- Together AI.
- Any other OpenAI-compatible provider.
- Custom providers where the API format can be configured.

Use a provider-adapter architecture.

Required adapter types:

1. OpenAI adapter
   - Support the OpenAI Responses API and/or Chat Completions API.
   - Configurable endpoint.
   - Configurable model.
   - Configurable API key.

2. Gemini adapter
   - Support the native Gemini Generative Language API format.
   - Configurable model.
   - Configurable API key.

3. Anthropic adapter
   - Support the native Anthropic Messages API format.
   - Configurable model.
   - Configurable API key.

4. OpenAI-compatible adapter
   - Configurable base URL.
   - Configurable model.
   - Configurable API key.
   - Configurable authentication header.
   - Suitable for OpenRouter, Groq, DeepSeek, Mistral, Together AI, and similar services.

5. Custom provider adapter
   - Custom endpoint.
   - API format selection.
   - Model name.
   - Authentication method.
   - Optional custom headers.
   - Request/response format selection where practical.

Use a common internal interface, such as:

```javascript
callAi({
  provider,
  model,
  messages,
  systemPrompt,
  temperature,
  maxTokens,
  signal
});
```

Each provider adapter must convert this common request into the correct provider-specific request and normalize the result into a common response format.

The user must be able to configure:

- Provider.
- API format.
- Endpoint/base URL.
- Model name.
- API key.
- Optional organization/project field.
- Optional additional headers.
- Temperature.
- Maximum output tokens.
- Timeout.
- Test connection.

IMPORTANT SECURITY RULES:

- Never hard-code an API key.
- Never hard-code a secret.
- Never copy the old Google Apps Script cloud endpoint.
- Never silently add cloud synchronization.
- Store the API key locally in the browser only.
- Never print API keys or authorization headers to the console.
- Never include API keys in backups by default.
- Never send notes, scores, PYQs, or tracker data automatically.
- Show the user what context will be sent before an AI request where practical.
- If a provider does not permit browser requests because of CORS, show a clear error.
- Do not silently use an unknown proxy.
- Do not add a proxy without explicit approval.

==================================================
AI FEATURES TO TRANSFER FROM index.html
==================================================

Transfer and improve all useful AI-related functionality, including:

- aiConfig.
- openSettings.
- renderAiSettings.
- saveAiSettings.
- clearAiSettings.
- callAi.
- askContentAi.
- openContentAi.
- askReviewAi.
- openReviewAi.
- askSimAi.
- openSimAi.
- generateWeakPractice.
- Video-note extraction.
- AI response rendering.
- AI Markdown rendering.
- AI LaTeX rendering.
- Saved AI responses.
- Regeneration.
- Copy response.
- AI loading states.
- AI error handling.
- Prompt templates.
- Context builders.
- Model controls.
- Any AI-specific local persistence.
- Any useful AI navigation or response history.

Improve these features where possible with:

- AbortController cancellation.
- Request timeout.
- Safe retry of temporary network errors.
- No retry for invalid credentials.
- Clear provider-specific errors.
- Context-length protection.
- Token-budget controls.
- Loading indicators.
- Disabled buttons while requests are running.
- Cancel buttons.
- Copy buttons.
- Regenerate buttons.
- Delete buttons.
- Local AI history.
- Privacy labels.
- Selected-text-only mode.
- Source/context labels.
- Safe HTML escaping.
- Safe Markdown rendering.
- Safe LaTeX rendering.
- Theme-aware AI panels.
- Mobile-friendly AI dialogs.
- Accessibility and keyboard support.

AI must never overwrite:

- Official question answers.
- Official PYQ data.
- Official scores.
- Official marking schemes.
- Official Content Vault notes.

==================================================
STRICT STEP-BY-STEP WORKFLOW
==================================================

Work in exactly six steps.

Execute ONLY one step at a time.

Do not begin the next step automatically.
Do not perform all six steps in one response.
Do not continue working after completing the current step.

After every step:

1. Test the changes.
2. Preserve the main target file.
3. Present the updated main HTML file.
4. Give a short list of changes.
5. Give a short list of tests.
6. Say exactly:
   STEP X DONE — WAITING FOR NEXT
7. Stop and wait for my reply:
   NEXT

If a required file is missing, stop and explain the blocker.
Do not compensate by downloading unrelated files.
Do not silently make unrelated changes.

==================================================
STEP 1 — AUDIT AND PROVIDER-AGNOSTIC AI FOUNDATION
==================================================

Inspect both repositories and internally map all AI-related functions from index.html.

Do not dump huge files into the response.
Use targeted inspection only.

Then modify only the latest tracker.

Implement the secure AI foundation:

- AI Settings panel.
- Provider selector.
- API format selector.
- Endpoint/base URL field.
- Model field.
- API key field.
- Show/hide API key control.
- Save settings.
- Clear settings.
- Test connection control.
- Connection status.
- Privacy notice.
- Local-only settings storage.
- Provider-adapter registry.
- Configuration validation.
- No hard-coded secret.
- No old cloud endpoint.
- No automatic tracker-data upload.

Create the architecture needed for:

- OpenAI.
- Gemini.
- Anthropic.
- OpenAI-compatible providers.
- Custom providers.

Do not yet connect every AI feature.
Do not yet modify official PYQ behavior.
Do not yet transfer all AI prompt tools.

Test:

- JavaScript syntax.
- HTML integrity.
- Settings open/close.
- Save and reload persistence.
- Clear settings.
- Provider switching.
- Invalid configuration handling.
- API key not included in backup.
- Dashboard still works.
- Resources still works.
- Content Vault still works.
- PYQ systems still work.
- Games still work.
- No duplicate IDs.
- No duplicate event listeners.
- No duplicate timers.

Present:

CSIR_GATE_Tracker_Physics_Lab_edited (3).html

Then say:

STEP 1 DONE — WAITING FOR NEXT

Stop.

==================================================
STEP 2 — CORE AI REQUEST ENGINE AND PROVIDER ADAPTERS
==================================================

Only after I reply NEXT:

Transfer and improve the core AI request system.

Implement:

- callAi.
- Common request format.
- Common normalized response format.
- OpenAI adapter.
- Gemini adapter.
- Anthropic adapter.
- OpenAI-compatible adapter.
- Custom provider configuration.
- AbortController cancellation.
- Timeout handling.
- Loading state.
- Retry handling.
- Authentication error handling.
- Rate-limit error handling.
- CORS error handling.
- Safe response parsing.
- No secret logging.
- Context-length protection.
- Model and token controls.

Do not yet wire every Content, Review, Simulator, and Video tool.

Test all provider configuration paths without requiring the user to expose a real API key.

Present the updated main HTML.

Then say:

STEP 2 DONE — WAITING FOR NEXT

Stop.

==================================================
STEP 3 — CONTENT VAULT AI FEATURES
==================================================

Only after I reply NEXT:

Transfer and improve the Content AI features:

- askContentAi.
- openContentAi.
- Selected-text explanation.
- Topic explanation.
- Concept tutor.
- Derivation mode.
- Formula-sheet mode.
- Worked-example mode.
- Common-mistake analysis.
- AI-generated practice questions.
- Answer checking.
- Flashcard generation.
- Revision summary.
- Local save.
- Regenerate.
- Copy.
- Delete.
- AI response history.

Integrate these into the current Content Vault without replacing it.

Requirements:

- Preserve the current Content Vault subjects.
- Preserve reference images and figures.
- Preserve Markdown code blocks and ASCII diagrams.
- Preserve LaTeX rendering.
- Keep AI-generated content separate from official notes.
- Clearly label AI-generated questions.
- Never insert AI questions into official PYQ data.
- Show the relevant subject/topic context.
- Support selected-text-only requests for privacy.
- Handle large notes safely.

Test:

- All Content Vault subjects.
- Search.
- Outline.
- Font-size controls.
- Math rendering.
- Code diagrams.
- AI loading/error states.
- Mobile layout.
- No-key behavior.
- Provider switching.

Present the updated main HTML.

Then say:

STEP 3 DONE — WAITING FOR NEXT

Stop.

==================================================
STEP 4 — REVIEW, SIMULATOR, AND WEAK-PRACTICE AI
==================================================

Only after I reply NEXT:

Transfer and improve:

- askReviewAi.
- openReviewAi.
- askSimAi.
- openSimAi.
- generateWeakPractice.
- Score analysis.
- Mistake analysis.
- Weak-subject diagnosis.
- Personalized revision plan.
- Question hints.
- Detailed solutions.
- Distractor/option analysis.
- Concept-gap detection.
- Weak-topic practice generation.

The AI must understand:

- CSIR Part A.
- CSIR Part B.
- CSIR Part C.
- GATE Physics.
- Existing subject structure.
- Existing topic metadata.

Strict rules:

- Never change official answers.
- Never change official scores.
- Never change official marking schemes.
- Never bypass attempt limits.
- Never modify official PYQ data.
- Keep AI-generated practice separate from official questions.
- Mark AI-generated answers as AI-generated.
- Allow the user to delete generated practice.

Test:

- CSIR simulator.
- GATE simulator.
- Official attempt limits.
- Official score calculation.
- Review tools.
- Weak-practice generation.
- Provider errors.
- No-key behavior.

Present the updated main HTML.

Then say:

STEP 4 DONE — WAITING FOR NEXT

Stop.

==================================================
STEP 5 — VIDEO AI AND ADVANCED STUDY ASSISTANT
==================================================

Only after I reply NEXT:

Transfer and improve the video-note and advanced study features.

Implement:

- Video-note extraction.
- Transcript-based note generation.
- Topic summaries.
- Formula sheets.
- Flashcards.
- Revision checklists.
- Solved-example extraction.
- Common-mistake extraction.
- Saved local notes.
- Regenerate.
- Copy.
- Delete.
- Source labels.
- Multi-part long-response handling.

Important:

- Do not claim that the AI watched a video if it could not access it.
- Support pasted transcripts or user-provided text as the reliable source.
- Keep YouTube links external.
- Keep video playback behavior separate from AI extraction.
- Clearly state when the source is unavailable.
- Keep generated notes separate from official Content Vault notes.
- Do not automatically upload video URLs, notes, or transcripts.

Test:

- Video resource cards.
- External video links.
- Transcript mode.
- Missing-source behavior.
- Large responses.
- Save/delete/regenerate.
- Mobile layout.
- Provider switching.
- Error states.

Present the updated main HTML.

Then say:

STEP 5 DONE — WAITING FOR NEXT

Stop.

==================================================
STEP 6 — FINAL HARDENING, BACKUP, PERFORMANCE, AND REGRESSION
==================================================

Only after I reply NEXT:

Perform the final audit.

Check:

- Duplicate IDs.
- Duplicate listeners.
- Duplicate timers.
- Memory leaks.
- Unhandled promises.
- Broken buttons.
- Broken tabs.
- Theme compatibility.
- Mobile layout.
- Keyboard navigation.
- Focus states.
- Reduced-motion behavior.
- Safe AI output rendering.
- API key privacy.
- Backup privacy.
- CORS errors.
- Offline behavior when AI is unavailable.
- Loading and cancellation behavior.
- Token limits.
- Context limits.
- AI history deletion.
- Provider switching.

Verify that backups exclude API keys by default.

Update standalone packaging only if necessary so the current GATE and Content assets remain available.

Do not add unrelated repository files.
Do not delete important files.
Do not replace the latest tracker with index.html.

Run regression checks for:

- Dashboard.
- Resources.
- Content Vault.
- Roadmap.
- PYQ Log.
- CSIR simulator.
- GATE simulator.
- Notes.
- To-Do.
- Pomodoro.
- Games.
- Themes.
- Backup/restore.
- AI Settings.
- Content AI.
- Review AI.
- Simulator AI.
- Video AI.

Present the final main HTML file.

Then say:

STEP 6 DONE — FINAL BUILD COMPLETE

After Step 1 is completed, I will reply only:

NEXT
