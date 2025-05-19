const CHAT_API_ENDPOINT = '/graphql';
const CODE_REVIEW_API_ENDPOINT = '/api/agents/codeReviewAgent/stream';

export const sendChatMessage = async (message: string): Promise<Response> => {
  return fetch(CHAT_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        mutation Chat($message: String!) {
          chat(message: $message) {
            text
          }
        }
      `,
      variables: {
        message
      }
    })
  });
};

export const sendCodeReviewMessage = async (message: string): Promise<Response> => {
  return fetch(CODE_REVIEW_API_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [
        {
          content: message,
          role: "user"
        }
      ]
    })
  });
};
