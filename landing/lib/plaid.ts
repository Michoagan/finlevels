import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

const plaidClientId = process.env.PLAID_CLIENT_ID || "";
const plaidSecret = process.env.PLAID_SECRET || "";
const plaidEnvName = process.env.PLAID_ENV || "sandbox";

// Map environment name to PlaidEnvironments enum
const getPlaidEnv = (env: string) => {
  switch (env) {
    case "production":
      return PlaidEnvironments.production;
    case "development":
      return PlaidEnvironments.development;
    default:
      return PlaidEnvironments.sandbox;
  }
};

const configuration = new Configuration({
  basePath: getPlaidEnv(plaidEnvName),
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": plaidClientId,
      "PLAID-SECRET": plaidSecret,
    },
  },
});

export const plaidClient = new PlaidApi(configuration);
