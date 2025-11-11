// Mock Firebase configuration - static version
export const auth = {
  currentUser: null
};

export const db = {
  collection: () => ({
    doc: () => ({
      get: async () => ({
        exists: true,
        data: () => ({
          // Mock data here
        })
      }),
      set: async () => ({}),
      update: async () => ({})
    })
  })
};

export const analytics = {
  logEvent: (name: string, params: any) => {
    console.log(`Analytics event: ${name}`, params);
  }
};