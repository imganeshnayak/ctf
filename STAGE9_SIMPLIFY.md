# Stage 9 Update - Simplified Instructions

## Problem
The current Stage 9 gives too much detail about how to solve the challenge. For a "Hard" difficulty stage, we should only describe WHAT to do, not HOW to do it.

## Current (Too Detailed)
```
Your Mission:
- Read through the entire document below
- Find all the highlighted letters (they appear in different colors and styles)  ← TOO MUCH DETAIL
- Combine them in the order they appear to form the flag  ← GIVES AWAY THE METHOD
- Submit the complete flag
```

## Recommended (More Challenging)
```
Challenge:
Read through the cybersecurity document below carefully. The flag is concealed within the text.

Flag Format: The flag will be in the format of uppercase letters, numbers, and underscores (e.g., EXAMPLE_FLAG_2024)
```

## What to Change in seed.js

Find Stage 9 (around line 470-490) and replace the info-box section with:

```javascript
<div class="info-box">
  <p>💡 <strong>Challenge:</strong></p>
  <p>Read through the cybersecurity document below carefully. The flag is concealed within the text.</p>
  <p><strong>Flag Format:</strong> The flag will be in the format of uppercase letters, numbers, and underscores (e.g., EXAMPLE_FLAG_2024)</p>
</div>
```

## Why This is Better

✅ Doesn't reveal that letters are highlighted
✅ Doesn't tell users to look for colors/styles
✅ Doesn't explain to combine in order
✅ Only provides the problem and expected format
✅ Makes it truly "Hard" difficulty
✅ Users must figure out the method themselves

## The Hint System

The hint button (with -50 point penalty) can reveal:
"Look for text that stands out - different colors, bold formatting, shadows, borders, or backgrounds. The letters spell out the flag in the order they appear from top to bottom."

This way:
- Challenge is harder by default
- Users can get help if stuck (at a cost)
- Maintains the difficulty level
