import { database } from "../firebase/config";
import { ref, set, push, get, query, orderByChild } from "firebase/database";

export const saveQuizResult = async (userId, quizData) => {
  try {
    const quizRef = push(ref(database, `users/${userId}/quizHistory`));
    await set(quizRef, {
      ...quizData,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error("Error saving quiz result:", error);
    throw error;
  }
};

export const getUserQuizHistory = async (userId) => {
  try {
    const snapshot = await get(query(
      ref(database, `users/${userId}/quizHistory`),
      orderByChild("timestamp")
    ));
    
    if (!snapshot.exists()) return [];
    
    return Object.entries(snapshot.val()).map(([key, value]) => ({
      id: key,
      ...value
    })).reverse(); // Newest first
  } catch (error) {
    console.error("Error fetching quiz history:", error);
    throw error;
  }
};