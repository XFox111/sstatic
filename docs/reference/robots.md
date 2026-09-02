# robots.txt

sstatic comes with a built-in `robots.txt` file that is designed to prevent search engines and AI systems from indexing the content of your sstatic instance.

> [!IMPORTANT]
> The `robots.txt` file does not guarantee that web crawlers will repsect its rules.

This file is served at the root path on any host, and ignores `SSTATIC_*_HOST` and `SSTATIC_*_PREFIX` variables.

As of v1.0.1, the `robots.txt` file contains the following text:

::: details robots.txt (click to open)
```txt
# As a condition of accessing this website, you agree to abide by the following
# content signals:

# (a)  If a Content-Signal = yes, you may collect content for the corresponding
#      use.
# (b)  If a Content-Signal = no, you may not collect content for the
#      corresponding use.
# (c)  If the website operator does not include a Content-Signal for a
#      corresponding use, the website operator neither grants nor restricts
#      permission via Content-Signal with respect to the corresponding use.

# The content signals and their meanings are:

# search:   building a search index and providing search results (e.g., returning
#           hyperlinks and short excerpts from your website's contents). Search does not
#           include providing AI-generated search summaries.
# ai-input: inputting content into one or more AI models (e.g., retrieval
#           augmented generation, grounding, or other real-time taking of content for
#           generative AI search answers).
# ai-train: training or fine-tuning AI models.

# ANY RESTRICTIONS EXPRESSED VIA CONTENT SIGNALS ARE EXPRESS RESERVATIONS OF
# RIGHTS UNDER ARTICLE 4 OF THE EUROPEAN UNION DIRECTIVE 2019/790 ON COPYRIGHT
# AND RELATED RIGHTS IN THE DIGITAL SINGLE MARKET.

User-agent: *
Content-Signal: search=no,ai-train=no,ai-input=no
Disallow: /

User-agent: Amazonbot
Disallow: /

User-agent: Applebot-Extended
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: CloudflareBrowserRenderingCrawler
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: GPTBot
Disallow: /

User-agent: meta-externalagent
Disallow: /

```
:::

At the time, content of this file cannot be overriden. If you want to customize the `robots.txt` file, you can use a reverse proxy to serve your own `robots.txt` file instead of the built-in one.
