// Generate or retrieve a unique user ID from localStorage
export const getUserId = () => {
  let userId = localStorage.getItem("sop_userId");

  if (!userId) {
    // Generate a unique ID: timestamp + random string
    userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem("sop_userId", userId);
  }

  return userId;
};
