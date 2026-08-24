# Configuring a reverse proxy

<!--@include: @/parts/wip.md-->

## Nginx Proxy Manager

When adding a new proxy host in Nginx Proxy Manager, paste following configuration in the Advanced tab:

```nginx
proxy_buffer_size 128k;
proxy_buffers 4 256k;
proxy_busy_buffers_size 256k;
```

This is needed only for the admin application so that authentication works properly.
