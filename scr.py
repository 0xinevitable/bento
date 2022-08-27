ours = '''
* web: Lazy-load detached component `DashboardMain` to reduce first load JS bundle size(`493kB` -> `373kB`) by @junhoyeo in https://github.com/inevitable-changes/bento/pull/124
* web: Users can view token balances in profile by @citrusinesis in https://github.com/inevitable-changes/bento/pull/125
* web: remove unused imports by @citrusinesis in https://github.com/inevitable-changes/bento/pull/126
* web: boolean cast condition of `assetRatioByPlatform.length` by @junhoyeo in https://github.com/inevitable-changes/bento/pull/127
* web: add skeleton on profile page by @citrusinesis in https://github.com/inevitable-changes/bento/pull/129
* web: apply redesign for user profile  by @junhoyeo in https://github.com/inevitable-changes/bento/pull/128
* web: replace `maximumSignificantDigits` with `maximumFractionDigits` by @junhoyeo in https://github.com/inevitable-changes/bento/pull/130
* web: set max-width to tab bottom border by @junhoyeo in https://github.com/inevitable-changes/bento/pull/131
* web: fix bugs in dependency arrays by @junhoyeo in https://github.com/inevitable-changes/bento/pull/132
* Replace Ethereum logo by @junhoyeo in https://github.com/inevitable-changes/bento/pull/133
* Merge `bento-landing` into `bento-web` and serve on `bento.finance` by @junhoyeo in https://github.com/inevitable-changes/bento/pull/134
* web(landing): Add animations to header illusts and buttons by @junhoyeo in https://github.com/inevitable-changes/bento/pull/136
* web(landing): Implement dashboard section of new landing page by @junhoyeo in https://github.com/inevitable-changes/bento/pull/139
* web(landing): Implement header section of new landing page by @junhoyeo in https://github.com/inevitable-changes/bento/pull/135
* web(landing): Implement status quo section of new landing page  by @junhoyeo in https://github.com/inevitable-changes/bento/pull/140
* web(landing): Implement identity section of new landing page  by @junhoyeo in https://github.com/inevitable-changes/bento/pull/141
* web(landing): Add simple `RoadmapSection` by @junhoyeo in https://github.com/inevitable-changes/bento/pull/142
* web(landing): update background blurs by @junhoyeo in https://github.com/inevitable-changes/bento/pull/143
* web(landing): add mobile responsiveness by @junhoyeo in https://github.com/inevitable-changes/bento/pull/146
* web(landing): fix rendering bugs in Safari and Chrome by @junhoyeo in https://github.com/inevitable-changes/bento/pull/147
* web(dashboard): pass default id value to `Portal` by @junhoyeo in https://github.com/inevitable-changes/bento/pull/149
* web(landing): fix font-family changing bug by @junhoyeo in https://github.com/inevitable-changes/bento/pull/150
* web(landing): fix minor bugs in `HeaderSection` & add transition to all elements except title by @junhoyeo in https://github.com/inevitable-changes/bento/pull/151
* web(landing): track events in new landing page by @junhoyeo in https://github.com/inevitable-changes/bento/pull/152
* web(landing): replace IR button to Twitter link by @junhoyeo in https://github.com/inevitable-changes/bento/pull/153
* web(landing): add content in identity section & update roadmap  by @junhoyeo in https://github.com/inevitable-changes/bento/pull/154
* web(landing): update navigation bar items by @junhoyeo in https://github.com/inevitable-changes/bento/pull/155
* web(landing): reword content in dashboard and roadmap section by @junhoyeo in https://github.com/inevitable-changes/bento/pull/156
* web(landing): redirect to `/home` after Supabase Auth by @junhoyeo in https://github.com/inevitable-changes/bento/pull/157
* web(landing): show navigation bar regardless of feature flag by @junhoyeo in https://github.com/inevitable-changes/bento/pull/158
* web(landing): update OpenGraph image & meta tags by @junhoyeo in https://github.com/inevitable-changes/bento/pull/159
**Full Changelog**: https://github.com/inevitable-changes/bento/compare/@bento/web@1.0.2...@bento/web@1.1.0
'''
theirs = '''web: Lazy-load detached component DashboardMain to reduce first load JS bundle size(493kB -> 373kB) by @junhoyeo in https://github.com/inevitable-changes/bento/pull/124
web: boolean cast condition of assetRatioByPlatform.length by @junhoyeo in https://github.com/inevitable-changes/bento/pull/127
web: replace maximumSignificantDigits with maximumFractionDigits by @junhoyeo in https://github.com/inevitable-changes/bento/pull/130
web: set max-width to tab bottom border by @junhoyeo in https://github.com/inevitable-changes/bento/pull/131
web: fix bugs in dependency arrays by @junhoyeo in https://github.com/inevitable-changes/bento/pull/132
Replace Ethereum logo by @junhoyeo in https://github.com/inevitable-changes/bento/pull/133
Merge bento-landing into bento-web and serve on bento.finance by @junhoyeo in https://github.com/inevitable-changes/bento/pull/134
web(landing): Add animations to header illusts and buttons by @junhoyeo in https://github.com/inevitable-changes/bento/pull/136
web(landing): Implement dashboard section of new landing page by @junhoyeo in https://github.com/inevitable-changes/bento/pull/139
web(landing): Implement header section of new landing page by @junhoyeo in https://github.com/inevitable-changes/bento/pull/135
web(landing): Implement status quo section of new landing page by @junhoyeo in https://github.com/inevitable-changes/bento/pull/140
web(landing): Implement identity section of new landing page by @junhoyeo in https://github.com/inevitable-changes/bento/pull/141
web(landing): Add simple RoadmapSection by @junhoyeo in https://github.com/inevitable-changes/bento/pull/142
web(landing): update background blurs by @junhoyeo in https://github.com/inevitable-changes/bento/pull/143
web(landing): add mobile responsiveness by @junhoyeo in https://github.com/inevitable-changes/bento/pull/146
web(landing): fix rendering bugs in Safari and Chrome by @junhoyeo in https://github.com/inevitable-changes/bento/pull/147
web(dashboard): pass default id value to Portal by @junhoyeo in https://github.com/inevitable-changes/bento/pull/149
web(landing): fix font-family changing bug by @junhoyeo in https://github.com/inevitable-changes/bento/pull/150
web(landing): fix minor bugs in HeaderSection & add transition to all elements except title by @junhoyeo in https://github.com/inevitable-changes/bento/pull/151
web(landing): track events in new landing page by @junhoyeo in https://github.com/inevitable-changes/bento/pull/152
web(landing): replace IR button to Twitter link by @junhoyeo in https://github.com/inevitable-changes/bento/pull/153
web(landing): add content in identity section & update roadmap by @junhoyeo in https://github.com/inevitable-changes/bento/pull/154
web(landing): update navigation bar items by @junhoyeo in https://github.com/inevitable-changes/bento/pull/155
web(landing): reword content in dashboard and roadmap section by @junhoyeo in https://github.com/inevitable-changes/bento/pull/156
web(landing): redirect to /home after Supabase Auth by @junhoyeo in https://github.com/inevitable-changes/bento/pull/157
web(landing): show navigation bar regardless of feature flag by @junhoyeo in https://github.com/inevitable-changes/bento/pull/158
web(landing): update OpenGraph image & meta tags by @junhoyeo in https://github.com/inevitable-changes/bento/pull/159'''
ours = [i.strip().replace('* ', '') for i in ours.split('\n') if i.strip()]
theirs = [i.strip() for i in theirs.split('\n') if i.strip()]
# print(ours)

res = []
for line in ours:
  if line in theirs:
    pass
  else:
    res.append(line)
print('\n'.join(res))
