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
import { combineUrlAndPath } from "../auth/utils/combineUrlAndPath";
import { REACT_APP_BABYGO_API, REACT_APP_TENANT_API } from "../env";

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
  getSeller: (id: number | string) => Promise<any>;
  changeAdStatus: (id: string, newStatus: string) => void;
}

const ClassifiedContext = createContext<ClassifiedContextType | undefined>(
  undefined
);

export const ClassifiedProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [ads, setAds] = useState<ClassifiedAd[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [myAdverts, setMyAdverts] = useState<ClassifiedAd[]>([]);
  const { user, token } = useAuth();
  const { tenant } = useTenant();

  const getSellerDetails = async (id: number | string) => {
    return await fetch(
      combineUrlAndPath(REACT_APP_TENANT_API, `api.php/user/${id}`),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          APP_ID: tenant,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.firstname && data.lastname) {
          data.name = `${data.firstname} ${data.lastname}`;
        } else {
          data.name = "User" + data.id;
        }
        console.log("Cache: ", id, data);
        return data;
      });
  };
  const { getItem: getSeller } = useCachedItem(getSellerDetails);

  const headers = {
    Authorization: `Bearer ${token}`,
    APP_ID: tenant,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    fetch(
      combineUrlAndPath(
        REACT_APP_BABYGO_API,
        `api/api.php/user/${user.id}/adverts`
      ),
      {
        headers,
      }
    )
      .then((res) => res.json())
      .then((data) => setMyAdverts(data));

    fetch(combineUrlAndPath(REACT_APP_BABYGO_API, `api/api.php/adverts`), {
      headers,
    })
      .then((res) => res.json(``))
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
  const addNewAd = async (
    adData: Omit<ClassifiedAd, "id" | "posted_date" | "sellerName" | "userId">
  ) => {
    const newAd = {
      ...adData,
      item_condition: adData.condition,
      location: adData.location ?? "Unknown", // Default location
      priority: 0, // Default priority
      tags: [], // Default tags
    };

    try {
      const response = await fetch(
        combineUrlAndPath(REACT_APP_BABYGO_API, `api/api.php/adverts`),
        {
          method: "POST",
          headers,
          body: JSON.stringify(newAd),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add new ad");
      }

      const savedAd = await response.json();
      
      setAds(refreshAdverts(ads, savedAd));
      setMyAdverts(refreshAdverts(myAdverts, savedAd));   
    } catch (error) {
      console.error("Error adding new ad:", error);
    }
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

  const refreshAdverts = (ads: ClassifiedAd[], newAds: ClassifiedAd[]): ClassifiedAd[] => {
    const updatedAds = ads.map((ad) => {
      const matchingAd = newAds.find((newAd) => newAd.id === ad.id);
      return matchingAd ? matchingAd : ad;
    });
    const newAdIds = newAds.map((newAd) => newAd.id);
    const nonDuplicateNewAds = newAds.filter((newAd) => !ads.some((ad) => ad.id === newAd.id));
    return [...updatedAds, ...nonDuplicateNewAds];
  };

  // Change ad status
  const changeAdStatus = async (id: string, newStatus: string) => {
    try {
      fetch(
        combineUrlAndPath(REACT_APP_BABYGO_API, `api/api.php/adverts/${id}`),
        {
          method: "PUT",
          headers,
          body: JSON.stringify({ status: newStatus }),
        }
      )
        .then((response) => {
          if (!response.ok) throw new Error("Failed to update status");
          return response.json();
        })
        .then((updatedAds) => {
          setAds(refreshAdverts(ads, updatedAds));
          setMyAdverts(refreshAdverts(myAdverts, updatedAds));          
        })
        .catch((error) => {
          console.error("Error updating ad status", error);
        });
    } catch (e) {
      console.error("Error updating ad status", e);
    }
  };

  // Check if an ad belongs to the current user
  const isCurrentUserAd = (adId: string) => {
    const ad = ads.find((ad) => ad.id === adId);
    return ad?.userId === user?.id;
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
    changeAdStatus,
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
