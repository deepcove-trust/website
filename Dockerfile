FROM mcr.microsoft.com/dotnet/core/aspnet:2.2-stretch-slim AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/core/sdk:2.2-stretch AS build
WORKDIR /src
COPY ["Deepcove-Trust-Website/Deepcove-Trust-Website.csproj", "Deepcove-Trust-Website/"]
RUN dotnet restore "Deepcove-Trust-Website/Deepcove-Trust-Website.csproj"
COPY . .
WORKDIR "/src/Deepcove-Trust-Website"
RUN dotnet build "Deepcove-Trust-Website.csproj" -c Release -o /app

FROM build AS publish
RUN dotnet publish "Deepcove-Trust-Website.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=publish /app .
ENTRYPOINT ["dotnet", "Deepcove-Trust-Website.dll"]