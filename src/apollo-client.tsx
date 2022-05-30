import React, { useContext, useMemo, useRef, useEffect } from "react";

import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  ApolloProvider,
  ApolloLink,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

import { setContext } from "@apollo/client/link/context";
import { useAllState } from "./Provider";

type GraphQLError ={
  message: string;
  location: any ;
  path? : any
}
interface IOnError {
  graphQLErrors: any;
  networkError: any;
  operation: any;

}

const graphqlEndpoint = "http://localhost:80/graphql";

export default function CustomApolloProvider(props : any) {

  const { token } = useAllState();

  const thisRef = useRef<string>()
  thisRef.current = token

  const client = useMemo(() => {
    console.log("%c token in apollo client", "background:yellow", token);
    const authLink = setContext((_, { headers }) => {
      return {
        headers: {
          ...headers,
          auth: thisRef.current ? `ut ${thisRef.current}` : null,
        },
      };
    });

    const errorLink = onError(({ graphQLErrors , networkError, operation }) => {
      if (graphQLErrors) {
        graphQLErrors.forEach(({ message}) => {
          console.log(`message:${message}`);
        });
      }

      if (networkError) {
        console.log(`networkerror: ${networkError}`);
      }
    });
    // const errorLink = onError(({ graphQLErrors , networkError, operation }) => {
    //   if (graphQLErrors) {
    //     graphQLErrors.forEach(({ message, location , path }) => {
    //       console.log(`message:${message} location:${location}`);
    //     });
    //   }

    //   if (networkError) {
    //     console.log(`networkerror: ${networkError}`);
    //   }
    // });

    const httpLink = createHttpLink({
      uri: graphqlEndpoint,
    });

    const link = ApolloLink.from([errorLink, authLink, httpLink]);

    return new ApolloClient({
      link,
      cache: new InMemoryCache(),
    });
  }, []);

  return <ApolloProvider client={client} {...props} />;
}
