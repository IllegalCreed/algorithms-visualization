# English Content Style Guide

> Status: active
> Owner: IllegalCreed
> Created: 2026-07-11
> Last reviewed: 2026-07-11
> Related plan: C-20260711-130

## Purpose

This guide keeps English algorithm pages consistent as the catalog grows from 10 to 30 pages. It applies to page prose, player captions, variable labels, quizzes, navigation, complexity notes, source comments, and internal links.

## Voice

- Explain the invariant or decision before naming an optimization.
- Prefer direct verbs: compare, swap, relax, settle, push, pop, skip, take, update, query.
- Describe what the visualization proves; do not claim ranking, adoption, or performance data that the project cannot observe.
- Use short active sentences in captions. One step should communicate one state transition.

## Names And Capitalization

| Use                                   | Avoid                                                   |
| ------------------------------------- | ------------------------------------------------------- |
| Quick Sort, Merge Sort, Binary Search | quicksort, mergesort, binary search in headings         |
| Dijkstra's algorithm                  | Dijkstra algorithm                                      |
| Fenwick Tree (Binary Indexed Tree)    | BIT without first defining it                           |
| KMP string matching                   | KMP algorithm when the matching context is unclear      |
| 0/1 Knapsack                          | zero-one knapsack in titles                             |
| lower bound, upper bound              | left boundary, right boundary when API semantics matter |

Use title case for page headings and sentence case for captions, table notes, callouts, and quiz questions.

## Complexity

- Write asymptotic notation as inline code in prose, for example `O(n log n)` and `O(V + E)`.
- State average, worst-case, amortized, or pseudo-polynomial qualifiers explicitly.
- Separate auxiliary space from input/output storage when the distinction matters.
- Do not write “fast” without naming the comparison or bound.

## Player Copy

- Captions use current values when they help explain the transition.
- Variable labels use stable English nouns: Current, Candidate range, Settled, Stack depth, Decision, Result.
- Preserve symbols used by the source algorithm, such as `lo`, `hi`, `mid`, `i`, `j`, `dp`, and `dist`.
- Translate source comments without changing line count or `lineMap`.
- Quizzes ask about the visible invariant or the next state, not trivia.

## Page Structure

Every algorithm page must include:

1. a literal algorithm-name `h1` and a concise subtitle;
2. the core problem and invariant;
3. guidance for reading the visualization;
4. the interactive player;
5. time/space complexity and practical limits;
6. at least one valid internal learning link.

Do not create title-only placeholders or runtime-translated prose. English content remains reviewable Vue SFC source.

## Links And Product Facts

- Use named Vue Router links for internal navigation.
- Link to the English counterpart when it exists; do not send an English reader to a Chinese page without saying so.
- Read page counts, supported languages, and feature claims from current repository facts before publishing content.
- C130 is live on both deployment tracks with 95 Chinese pages and 30 English pages; this is still a partial English catalog, not full-site localization.
