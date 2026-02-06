Cleanup suggestions (manual review before delete)

- `src/api/githubDbClient.js` - legacy GitHub-backed client. Keep as fallback if you want GitHub writes; otherwise safe to remove.
- `src/api/dbManager.js` - utilities for db switching / diagnostics; verify if still used before removal.
- `src/entities/` and `data/*.txt` - reference files that may no longer be needed if Firestore is primary.
- Old image upload helpers in `base44Client` that only used GitHub - consolidated but double-check.

Procedure:
1. Review each file above and confirm no runtime imports reference them (search in repo).
2. Move to a backup branch or folder before permanent deletion.
3. Run the app and tests after removal to ensure behavior remains.

I recommend not deleting automatically — I'll prepare a smaller patch to remove any file you confirm.
