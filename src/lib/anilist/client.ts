import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

const httpLink = createHttpLink({
  uri: "https://graphql.anilist.co",
});

export const anilistClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export const ANILIST_AUTH_URL = (clientId: string, redirectUri: string) =>
  `https://anilist.co/api/v2/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}`;
