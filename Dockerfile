FROM node:latest AS node-builder

WORKDIR /app
COPY app/package.json ./

RUN npm install
COPY app/ ./
RUN npm run build

RUN sed -i 's|<base href="/" />|<base href="." />|' dist/index.html

FROM mcr.microsoft.com/dotnet/sdk:10.0-alpine AS dotnet-builder

WORKDIR /app

COPY api/*.csproj ./
COPY api/*.slnx ./
RUN dotnet restore
RUN wget -O geoip.mmdb https://github.com/sapics/ip-location-db/releases/download/latest/geolite2-city-ipv4.mmdb
COPY api/ ./
COPY --from=node-builder /app/dist ./wwwroot
RUN dotnet publish SStatic.csproj --configuration Release --output build

FROM mcr.microsoft.com/dotnet/aspnet:10.0-alpine AS runtime

ENV \
	DOTNET_SYSTEM_GLOBALIZATION_INVARIANT=false \
	LC_ALL=en_US.UTF-8 \
	LANG=en_US.UTF-8

RUN apk add --no-cache \
	icu-data-full \
	icu-libs

WORKDIR /app

COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh && \
	mkdir /data/ && \
	chown -R $APP_UID:$APP_UID /data

COPY --from=dotnet-builder /app/build ./

USER $APP_UID
EXPOSE 8080
ENTRYPOINT ["./entrypoint.sh"]
