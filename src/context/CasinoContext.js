import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";

// Create a context for the casino data
const CasinoContext = createContext();

// Custom hook to access the casino context
export const useCasinoContext = () => {
  return useContext(CasinoContext);
};

// Casino provider component
export const CasinoProvider = ({ children }) => {
  // State variables for casino data and filters
  const [data, setData] = useState({
    games: [],
    filtered_games: [],
    display_games: [],
    studios: [],
    currencies: [],
    tags: [],
  });
  const [selectedCurrency, setSelectedCurrency] = useState("EUR");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedStudio, setSelectedStudio] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Function to load more filtered games
  const loadMoreFilteredGames = (newGames, clearList = false) => {
    setData((prevData) => ({
      ...prevData,
      display_games: clearList
        ? [...newGames]
        : [...prevData.display_games, ...newGames],
    }));
  };

  // Function to fetch casino data
  const fetchData = () => {
    fetch("/casinoData.json") // Replace with the actual path to casinoData.json
      .then((response) => response.json())
      .then((jsonData) => {
        const mappedGames = jsonData.games.map((game) => {
          const studio = jsonData.studios.find(
            (studio) => studio.id === game.studioId
          );
          return {
            ...game,
            studio,
          };
        });

        setData({
          games: mappedGames,
          filtered_games: [],
          display_games: [],
          studios: jsonData.studios,
          currencies: jsonData.currencies,
          tags: jsonData.tags,
        });
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  // UseEffect to fetch data when the component mounts
  useEffect(() => {
    // Check if data is already cached
    if (data.games.length === 0) {
      fetchData();
    }
  }, []);

  // Memoized filteredGames using useMemo
  const filteredGames = useMemo(() => {
    let filtered = data.games.filter((game) => {
      // Convert selectedCategory to a number if it's a string
      const selectedCategoryNumber = Number(selectedCategory);

      // Apply category filter
      if (selectedCategory !== "ALL") {
        if (!game.gameTags.includes(selectedCategoryNumber)) {
          return false;
        }
      }

      // Apply currency filter
      if (
        selectedCurrency !== "ALL" &&
        game.studio.blockedCurrencies &&
        !game.studio.blockedCurrencies.includes(selectedCurrency)
      ) {
        return false;
      }

      // Apply studio filter
      if (selectedStudio !== "ALL") {
        if (game.studio.name !== selectedStudio) {
          return false;
        }
      }

      return true;
    });

    const display_games = filtered.slice(0, 10);
    setData((prevData) => ({
      ...prevData,
      display_games: [...prevData.display_games, ...display_games],
    }));

    // Limit the number of filtered games to 10
    return filtered;
  }, [data.games, selectedCategory, selectedCurrency, selectedStudio]);

  // Memoized filteredStudios using useMemo
  const filteredStudios = useMemo(() => {
    if (selectedCategory === "ALL") {
      return data.studios;
    }

    return data.studios.filter((studio) => {
      return data.games.some((game) => {
        const selectedCategoryNumber = Number(selectedCategory);
        return (
          game.studio.id === studio.id &&
          game.gameTags.includes(selectedCategoryNumber)
        );
      });
    });
  }, [data.studios, selectedCategory, data.games]);

  // Function to change the selected studio
  const changeStudio = (studio) => {
    setCurrentPage(1); // Reset the current page
    setSelectedStudio(studio);
    const temp_games = data.filtered_games.slice(0, 10);
    setHasMore(true);
    loadMoreFilteredGames(temp_games, true);
  };

  // Function to change the selected category
  const changeCategory = (category) => {
    setCurrentPage(1); // Reset the current page
    setSelectedCategory(category);
    setSelectedStudio("ALL");
    const temp_games = data.filtered_games.slice(0, 10);
    setHasMore(true);
    loadMoreFilteredGames(temp_games, true);
  };

  // Create the value object to provide in the context
  const value = {
    filteredGames: filteredGames,
    display_games: data.display_games,
    studios: filteredStudios, // Use the filtered studios
    tags: data.tags,
    selectedCurrency,
    setSelectedCurrency,
    selectedCategory,
    setSelectedCategory,
    selectedStudio,
    setSelectedStudio,
    loadMoreFilteredGames,
    loading,
    changeStudio,
    currentPage,
    setCurrentPage,
    changeCategory,
    hasMore,
    setHasMore,
  };

  return (
    <CasinoContext.Provider value={value}>{children}</CasinoContext.Provider>
  );
};
