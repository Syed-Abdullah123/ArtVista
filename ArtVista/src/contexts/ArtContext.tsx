import React, { createContext, useContext, useState, useEffect } from "react";
import {
  onSnapshot,
  collection,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
} from "firebase/firestore";
import { FIREBASE_DB, FIREBASE_AUTH } from "../../firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";

interface Comment {
  id?: string;
  userId: string;
  username: string;
  userImage: string | null;
  text: string;
  timestamp: Date;
}

interface Art {
  id: string;
  title: string;
  imageUrl: string;
  author: string;
  authorImage?: string;
  description: string;
  likes: number;
  likesArray: string[];
  commentsArray: Comment[];
  [key: string]: any;
}

interface ArtContextType {
  arts: Art[];
  loading: boolean;
  toggleLike: (artId: string) => Promise<void>;
  addComment: (artId: string, text: string) => Promise<void>;
  isLiked: (artId: string) => boolean;
  getComments: (artId: string) => Comment[];
  isLikeLoading: { [key: string]: boolean };
  isCommentLoading: { [key: string]: boolean };
  currentUser: User | null;
}

const ArtContext = createContext<ArtContextType | undefined>(undefined);

export const ArtProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [arts, setArts] = useState<Art[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLikeLoading, setIsLikeLoading] = useState<{
    [key: string]: boolean;
  }>({});
  const [isCommentLoading, setIsCommentLoading] = useState<{
    [key: string]: boolean;
  }>({});
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(FIREBASE_DB, "artworks"),
      (snapshot) => {
        const artworks = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Art[];
        setArts(artworks);
        setLoading(false);
      },
      (error) => {
        console.error("Error listening to artworks:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const toggleLike = async (artId: string) => {
    if (!currentUser) return;

    try {
      setIsLikeLoading((prev) => ({ ...prev, [artId]: true }));
      const artworkRef = doc(FIREBASE_DB, "artworks", artId);
      const artworkDoc = await getDoc(artworkRef);

      if (artworkDoc.exists()) {
        const artworkData = artworkDoc.data();
        const likesArray = artworkData?.likesArray || [];
        const currentLikes = artworkData?.likes || 0;
        const userLiked = likesArray.includes(currentUser.uid);

        await updateDoc(artworkRef, {
          likes: userLiked ? currentLikes - 1 : currentLikes + 1,
          likesArray: userLiked
            ? arrayRemove(currentUser.uid)
            : arrayUnion(currentUser.uid),
        });
      }
    } catch (error) {
      console.error("Error updating like:", error);
    } finally {
      setIsLikeLoading((prev) => ({ ...prev, [artId]: false }));
    }
  };

  const addComment = async (artId: string, text: string) => {
    if (!currentUser || !text.trim()) return;

    try {
      setIsCommentLoading((prev) => ({ ...prev, [artId]: true }));
      const userRef = doc(FIREBASE_DB, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);
      const userData = userSnap.exists()
        ? userSnap.data()
        : { username: "Anonymous", userImage: null };

      const artworkRef = doc(FIREBASE_DB, "artworks", artId);
      const newComment = {
        id: `${currentUser.uid}-${Date.now()}`, // Create a unique ID
        userId: currentUser.uid,
        username: userData.username,
        userImage: userData.userImage || null,
        text: text.trim(),
        timestamp: new Date(),
      };

      await updateDoc(artworkRef, {
        commentsArray: arrayUnion(newComment),
      });
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsCommentLoading((prev) => ({ ...prev, [artId]: false }));
    }
  };

  const isLiked = (artId: string): boolean => {
    if (!currentUser) return false;
    const art = arts.find((a) => a.id === artId);
    return art?.likesArray?.includes(currentUser.uid) || false;
  };

  const getComments = (artId: string): Comment[] => {
    const art = arts.find((a) => a.id === artId);
    return art?.commentsArray || [];
  };

  return (
    <ArtContext.Provider
      value={{
        arts,
        loading,
        toggleLike,
        addComment,
        isLiked,
        getComments,
        isLikeLoading,
        isCommentLoading,
        currentUser,
      }}
    >
      {children}
    </ArtContext.Provider>
  );
};

export const useArt = () => {
  const context = useContext(ArtContext);
  if (context === undefined) {
    throw new Error("useArt must be used within an ArtProvider");
  }
  return context;
};
