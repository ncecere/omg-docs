# Build the static export once, on the build machine's own platform (the output
# is the same for every platform), then serve it with nginx.
FROM --platform=$BUILDPLATFORM docker.io/library/node:22.23.4-alpine@sha256:fe4f6d74e20370acb04ad889077d14d0f64a9c8ea6a42bc60cddf1e844699914 AS build
WORKDIR /src
ENV NEXT_TELEMETRY_DISABLED=1
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts --no-audit --no-fund
COPY . .
RUN npm run build

FROM docker.io/library/nginx:1.31.7-alpine@sha256:892bb2152464f0c5d8972593a5f5afaf8054552580b699d95f8ff4af08c2d33d

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
