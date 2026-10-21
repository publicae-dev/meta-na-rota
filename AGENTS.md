<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Financial math lives in pure functions in src/lib/finance.ts using integer cents; UI must not compute money inline (keeps rules testable).
- Data currently lives in a local store (src/lib/store.ts) for the visual phase; it will be swapped for Lovable Cloud persistence behind the same actions API.
