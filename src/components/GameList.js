import React from "react";
import { useCasinoContext } from "../context/CasinoContext";
import InfiniteScroll from "react-infinite-scroll-component"; // Import InfiniteScroll
import { v4 as uuidv4 } from "uuid";
import "../styles/GameList.css";

function GameList() {
  // Destructure values from the context
  const {
    filteredGames,
    display_games,
    loadMoreFilteredGames,
    loading,
    currentPage,
    setCurrentPage,
    hasMore,
    setHasMore,
  } = useCasinoContext();

  const itemsPerPage = 10; // Number of filteredGames to load per page

  // Infinite scroll state

  const fetchMoreData = () => {
    if (loading) return; // Prevent multiple requests while loading

    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Check if there are more items to load
    if (display_games.length >= filteredGames.length) {
      setHasMore(false);
      return;
    }

    // Calculate more filteredGames to load
    const morefilteredGames = filteredGames.slice(startIndex, endIndex);

    // Update the current page
    setCurrentPage(currentPage + 1);

    // Load more filteredGames
    loadMoreFilteredGames(morefilteredGames);
  };

  return (
    <InfiniteScroll
      dataLength={display_games.length} // This is important to indicate the total number of items
      next={fetchMoreData} // Function to load more data
      hasMore={hasMore} // Whether there are more items to load
      loader={<div>Loading...</div>} // Loader component
      className="pt-50"
    >
      <div className="game-list-grid">
        {display_games.map((game) => (
          <div className="game-card" key={game.id + uuidv4()}>
            <img src={game.imageUrl} alt={game.name} />
            <div className="game-info">
              <h3>
                <b>{game.name}</b>
              </h3>
              <h4>{game.studio.name}</h4>
            </div>
          </div>
        ))}
      </div>
    </InfiniteScroll>
  );
}

export default GameList;
