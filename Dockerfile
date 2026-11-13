# Build the static export once, on the build machine's own platform (the output
# is the same for every platform), then serve it with nginx.
FROM --platform=$BUILDPLATFORM docker.io/library/node:22.23.4-alpine@sha256:0e1754758c2df4cfa3e68d59e2e1b7374bb7fd9ea6328eaaacf15cc934af8202 AS build
WORKDIR /src
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts --no-audit --no-fund
COPY . .
RUN npm run build

FROM docker.io/library/nginx:1.31.8-alpine@sha256:713fc2ebfd92e8217db451477182ee91944b123d2b1ee9fd5a8c6e91ca6c3a11

LABEL org.opencontainers.image.source="https://github.com/ncecere/omg-docs" \
      org.opencontainers.image.description="Open Model Gateway documentation (static site)" \
      org.opencontainers.image.licenses="MIT AND CC-BY-4.0"

# Our own nginx.conf: pid, logs and temp files under /tmp (read-only root
# filesystem friendly). Our default.conf replaces the image's. No RUN steps in
# this stage, so a multi-platform build needs no emulation.
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY nginx/security-headers.conf /etc/nginx/snippets/security-headers.conf
COPY --from=build --chown=101:101 /src/out /usr/share/nginx/html

USER 101:101
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
