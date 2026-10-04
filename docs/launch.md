# Launch materials

These drafts are for the maintainer to post in communities that allow relevant project introductions. They have not been sent. Tailor the example to the audience and follow the community rules.

## English

I made CSV Delta for the moment when two database or price-table exports need checking and a text diff mostly shows reordered lines.

It runs in your browser, matches rows by composite keys, rejects duplicate keys, and lets you ignore timestamps or compare selected numeric columns with a tolerance. Export a self-contained HTML report for offline review. No account or file uploads.

The demo includes an example you can try in one click. I'd appreciate feedback on the comparison rules and any confusing results, especially from people checking migrations or configuration tables.

Demo: https://jiaozenghao.github.io/csv-delta/
Source: https://github.com/JiaoZenghao/csv-delta

## 中文

做了一个小工具 CSV Delta，用来核对数据库、配置表或价格表的两次 CSV 导出。

在浏览器里按复合主键比较，行列重排不会产生差异；重复主键直接报错。可以忽略更新时间、按数值容差比较指定列，并导出可离线打开的 HTML 报告。无需账号，文件不上传。

在线示例可以一键体验。欢迎分享具体核对场景，尤其想知道哪些比较规则容易让人困惑，以及结果是否符合预期。

体验：https://jiaozenghao.github.io/csv-delta/
源码：https://github.com/JiaoZenghao/csv-delta

## Distribution experiment

Start with a short real example and one relevant community where the maintainer already participates. Do not mass-post, send unsolicited messages, or request star exchanges. Keep a dated record of the channel and resulting useful feedback. Any community post or message requires the user's explicit instruction.

## 价格表审核实验文案 — 2026-10-04

状态：待发布。发布前确认新版已部署并检查目标社区规则。

### 面向价格表维护者

更新商品价格表时，你怎样确认哪些价格涨了、降了，哪些商品新增或不在新表里？

我做了 CSV Delta：按 SKU＋地区核对两份 CSV，文件只在浏览器处理，可导出离线 HTML 报告。示例里能看到 79→74、89→94，以及商品新增和移除，无需准备文件即可体验。

体验：https://jiaozenghao.github.io/csv-delta/

想听听近期维护过价格表的人反馈：它能否替代你当前核对流程的一步？哪里不方便？请勿公开真实业务数据。

### 面向开发者

两份价格导出文件换了行列顺序，普通文本 diff 很难看出实际改价。我做了一个浏览器内的 CSV 比较工具，按复合主键匹配，可忽略时间戳、按数值比较，并导出无脚本的离线报告。

内置 SKU＋地区示例，展示涨价、降价、新增和移除。欢迎用模拟或脱敏数据反馈比较规则是否符合你的核对流程。

体验：https://jiaozenghao.github.io/csv-delta/
源码：https://github.com/JiaoZenghao/csv-delta

配图：docs/images/price-review.svg。实验记录：docs/price-review-experiment.md。
