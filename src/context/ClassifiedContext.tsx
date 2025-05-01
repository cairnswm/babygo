import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ClassifiedAd, Category } from "../types";
import { classifiedAds, categories, CURRENT_USER_ID } from "../data/mockData";
import { useAuth } from "../auth/hooks/useAuth";
import { useTenant } from "../auth/hooks/useTenant";
import useCachedItem from "./useCacheItem";

interface ClassifiedContextType {
  ads: ClassifiedAd[];
  filteredAds: ClassifiedAd[];
  categories: Category[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  addNewAd: (
    ad: Omit<ClassifiedAd, "id" | "posted_date" | "sellerName" | "userId">
  ) => void;
  updateAd: (
    id: string,
    ad: Omit<ClassifiedAd, "id" | "posted_date" | "sellerName" | "userId">
  ) => void;
  deleteAd: (id: string) => void;
  myAdverts: ClassifiedAd[];
  isCurrentUserAd: (adId: string) => boolean;
  toggleFavorite: (id: string) => void;
}

const ClassifiedContext = createContext<ClassifiedContextType | undefined>(
  undefined
);

export const ClassifiedProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [ads, setAds] = useState<ClassifiedAd[]>([]);
  // const [ads, setAds] = useState<ClassifiedAd[]>(classifiedAds);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [myAdverts, setMyAdverts] = useState([]);
  const { user, token } = useAuth();
  const { tenant } = useTenant();

  const getSellerDetails = async (id: number | string) => {
    return await fetch(`http://localhost/cairnsgames/php/tenant/api.php/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        APP_ID: tenant,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.firstname && data.lastname) {
          data.name = `${data.firstname} ${data.lastname}`;
        } else {
          data.name = "User" + data.id;
        }
        console.log("Cache: ", id, data)
        return data;
      });
  };
  const { getItem: getSeller } = useCachedItem(getSellerDetails);

  const headers = {
    Authorization: `Bearer ${token}`,
    APP_ID: tenant,
  };

  useEffect(() => {
    fetch(`http://localhost/babygo/php/api/api.php/user/${user.id}/adverts`, {
      headers,
    })
      .then((res) => res.json())
      .then((data) => setMyAdverts(data));
    fetch(`http://localhost/babygo/php/api/api.php/adverts`, { headers })
      .then((res) => res.json())
      .then((data) => setAds(data));
  }, [user]);

  // Filter ads based on selected category and search term
  const filteredAds = ads.filter((ad) => {
    const matchesCategory = selectedCategory
      ? ad.category === selectedCategory
      : true;
    const matchesSearch = searchTerm
      ? ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.description.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });

  // Add a new ad
  const addNewAd = (
    adData: Omit<ClassifiedAd, "id" | "posted_date" | "sellerName" | "userId">
  ) => {
    const newAd: ClassifiedAd = {
      ...adData,
      id: `ad-${Date.now()}`,
      posted_date: new Date().toISOString(),
      sellerName: "Current User", // In a real app, this would come from auth
      userId: CURRENT_USER_ID,
    };
    setAds((prevAds) => [newAd, ...prevAds]);
  };

  // Update an existing ad
  const updateAd = (
    id: string,
    adData: Omit<ClassifiedAd, "id" | "posted_date" | "sellerName" | "userId">
  ) => {
    setAds((prevAds) =>
      prevAds.map((ad) => {
        if (ad.id === id && ad.userId === CURRENT_USER_ID) {
          return {
            ...ad,
            ...adData,
            posted_date: ad.posted_date, // Keep original post date
          };
        }
        return ad;
      })
    );
  };

  // Delete an ad
  const deleteAd = (id: string) => {
    setAds((prevAds) =>
      prevAds.filter((ad) => !(ad.id === id && ad.userId === CURRENT_USER_ID))
    );
  };

  // // Get user's own ads
  // const getUserAds = () => {
  //   return ads.filter(ad => ad.userId === CURRENT_USER_ID);
  // };

  // Check if an ad belongs to the current user
  const isCurrentUserAd = (adId: string) => {
    const ad = ads.find((ad) => ad.id === adId);
    return ad?.userId === CURRENT_USER_ID;
  };

  const toggleFavorite = (id: string) => {
    setAds((prevAds) =>
      prevAds.map((ad) => {
        if (ad.id === id) {
          return { ...ad, favorite: !ad.favorite };
        }
        return ad;
      })
    );
  };

  const value = {
    ads,
    filteredAds,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchTerm,
    setSearchTerm,
    addNewAd,
    updateAd,
    deleteAd,
    myAdverts,
    isCurrentUserAd,
    toggleFavorite,
    getSeller,
  };

  return (
    <ClassifiedContext.Provider value={value}>
      {children}
    </ClassifiedContext.Provider>
  );
};

export const useClassified = (): ClassifiedContextType => {
  const context = useContext(ClassifiedContext);
  if (context === undefined) {
    throw new Error("useClassified must be used within a ClassifiedProvider");
  }
  return context;
};
