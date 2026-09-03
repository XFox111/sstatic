# robots.txt

sstatic comes with a built-in `robots.txt` file that is designed to prevent search engines and AI systems from indexing the content of your sstatic instance.

> [!IMPORTANT]
> The `robots.txt` file does not guarantee that web crawlers will repsect its rules.

This file is served at the root path on any host, and ignores `SSTATIC_*_HOST` and `SSTATIC_*_PREFIX` variables.

The `robots.txt` file contains the following text:

::: details robots.txt (click to open)
<<< @/../app/public/robots.txt
:::

At the time, content of this file cannot be overriden. If you want to customize the `robots.txt` file, you can use a reverse proxy to serve your own `robots.txt` file instead of the built-in one.
