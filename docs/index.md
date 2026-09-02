---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "sstatic"
  text: "A simple self-hosted URL shortener and a file server"
  tagline: "A perfect companion for your personal website"
  image:
    src: /logo.svg
  actions:
    - theme: brand
      text: Get started
      link: /get-started/installation
    - theme: alt
      text: Source code
      link: https://github.com/xfox111/sstatic
      target: _blank

features:
  - title: Personalized URL shortener
    details: Create short links on your personal domain with a simple and easy-to-use interface
  - title: Static file server
    details: Want to share your work with the world? Serve your static files in a few clicks
  - title: Multi-domain support
    details: Serve your short links and static files on different domains with a single sstatic instance
  - title: OIDC support out of the box
    details: Already have an identity provider? sstatic can integrate with it easily
  - title: Bring your own analytics
    details: sstatic intergrates with several popular analytics providers (including open source ones) to help you better understand your users
  - title: Built with Docker
    details: Deploy sstatic in a few minutes with Docker and Docker Compose
---
