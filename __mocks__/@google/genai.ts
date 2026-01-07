const mockChat = {
  sendMessage: jest.fn().mockResolvedValue({
    response: {
      text: () => 'Mock chat response',
    },
  }),
};

export const GoogleGenAI = jest.fn().mockImplementation(() => ({
  models: {
    create: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: () => 'Mock response',
        },
      }),
      startChat: jest.fn().mockReturnValue(mockChat),
    }),
  },
}));

export const Chat = jest.fn();
export const GenerateContentResponse = jest.fn();
