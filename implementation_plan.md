# Verification Plan

## Goal
Verify the implementation of the Achievement and Story systems, and ensure the game logic works correctly with the new features.

## Verification Steps
### 1. Achievement System
- [ ] **Unlock Achievement**: Play the game and trigger an achievement (e.g., merge 5 cherries).
- [ ] **Notification**: Verify that a notification appears when an achievement is unlocked.
- [ ] **Achievement Screen**: Check if the unlocked achievement is marked as completed in the Achievement Screen.
- [ ] **Rewards**: Verify that rewards (items or stories) are given correctly.

### 2. Story System
- [ ] **Unlock Story**: Trigger a story unlock (either by default or via achievement).
- [ ] **Story Screen**: Check if the unlocked story is accessible in the Story Screen.
- [ ] **Story Reader**: Open a story and verify the content is displayed correctly.

### 3. Game Logic
- [ ] **Game Loop**: Play a full game loop (start -> play -> game over/level clear).
- [ ] **Persistence**: Refresh the page and verify that progress (achievements, stories, inventory) is saved.

## Next Steps
- If verification passes, the task is complete.
- If issues are found, fix them.
- If the user wants to deploy or build, proceed with that.
