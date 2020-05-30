const dev = {
  s3: {
    REGION: "us-east-2",
    BUCKET: "react-tracks-api-dev-attachmentsbucket-4thobcj3r306"
  },
  apiGateway: {
    REGION: "us-east-2",
    URL: "https://8hqt1qqgll.execute-api.us-east-2.amazonaws.com/dev"
  },
  cognito: {
    REGION: "us-east-2",
    USER_POOL_ID: "us-east-2_OaskE4sGY",
    APP_CLIENT_ID: "5ecihdoci07mrj8b1poqm6uo5t",
    IDENTITY_POOL_ID: "us-east-2:303aafc8-a01b-47d4-9207-650d72349900"
  }
};

// const prod = {
//   STRIPE_KEY: "pk_test_v1amvR35uoCNduJfkqGB8RLD",
//   s3: {
//     REGION: "us-east-1",
//     BUCKET: "notes-app-2-api-prod-attachmentsbucket-1v9w7kkxnznb7"
//   },
//   apiGateway: {
//     REGION: "us-east-1",
//     URL: "https://api.serverless-stack.seed-demo.club/prod"
//   },
//   cognito: {
//     REGION: "us-east-1",
//     USER_POOL_ID: "us-east-1_mLbfKylhm",
//     APP_CLIENT_ID: "mli2vaupiq3ga29m4698m6mrl",
//     IDENTITY_POOL_ID: "us-east-1:4e377eff-0617-4098-b218-673490ffab8d"
//   }
// };

// Default to dev if not set
// const config = process.env.REACT_APP_STAGE === 'prod'
//   ? prod
//   : dev;

const config = dev

export default {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  ...config
};
