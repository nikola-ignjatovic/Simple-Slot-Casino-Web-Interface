import React, { useState } from "react";
import { useCasinoContext } from "../context/CasinoContext";
import "../styles/FilterMenu.css";

function FilterMenu() {
  // Destructure values from the context
  const {
    selectedCurrency,
    setSelectedCurrency,
    tags,
    selectedCategory,
    studios,
    selectedStudio,
    changeStudio,
    changeCategory,
  } = useCasinoContext();

  // State for showing all studios or not
  const [showAll, setShowAll] = useState(false);

  // State for tracking the currently active studio
  const [activeStudio, setActiveStudio] = useState("ALL"); // Initialize with "ALL" or your default value

  // Function to toggle showAll state
  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  // Function to show less studios
  const toggleShowLess = () => {
    setShowAll(false);
  };

  // State for tracking the clicked button
  const [clickedButton, setClickedButton] = useState(null);

  // Function to handle button click
  const handleButtonClick = (studioName) => {
    changeStudio(studioName); // Update selectedStudio in context
    setClickedButton(studioName); // Store the clicked button's identifier
  };

  return (
    <>
      {/* Top section */}
      <div
        className="row p-2"
        style={{
          background: "black",
          borderRadius: "10px", // Adjust the radius as needed
          padding: "10px", // Adjust the padding as needed
          color: "white",
        }}
      >
        <div className="col-md-10 mx-auto">
          <h1>The Casino Lobby</h1> {/* Updated heading */}
        </div>
        <div className="col-md-2 mx-auto">
          <div className="text-center">
            <div className="">
              <label htmlFor="currency">Currency :</label>
              <div className="custom-select">
                <select
                  id="currency"
                  value={selectedCurrency}
                  onChange={(e) => setSelectedCurrency(e.target.value)}
                >
                  {/* Add currency options */}
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="mBTC">mBTC</option>
                </select>
                <div className="select-arrow">&#9660;</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category buttons */}
      <div className="row">
        <div className="col-md-12 mx-auto pt-5">
          <div className="">
            <div className="">
              <div className="filter-buttons">
                {/* "All" button */}
                <button
                  className={
                    selectedCategory === "ALL"
                      ? "active btn btn-primary text-nowrap"
                      : "btn btn-primary text-nowrap"
                  }
                  style={{ width: "120px", height: "50px" }}
                  onClick={() => changeCategory("ALL")}
                >
                  All
                </button>
                {/* Map and render tags as buttons */}
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    className={
                      selectedCategory === tag.id
                        ? "active btn btn-primary text-nowrap"
                        : "btn btn-primary text-nowrap"
                    }
                    onClick={() => changeCategory(tag.id)}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Studio buttons */}
      <div className="row">
        <div className="col-md-12 mx-auto pt-3" style={{ textAlign: "left" }}>
          <h5>Popular providers:</h5>
        </div>
        <div className="col-md-12 mx-auto">
          <div className="text-center">
            <div className="studio-section">
              <div className="filter-buttons">
                <button
                  className={`btn ${selectedStudio === "ALL" ? "active" : ""}`}
                  onClick={() => changeStudio("ALL")}
                >
                  All
                </button>

                {studios.slice(0, 9).map((studio) => (
                  <button
                    key={studio.id}
                    className={`btn ${
                      selectedStudio === studio.name ? "active" : ""
                    }`}
                    onClick={() => changeStudio(studio.name)}
                    style={{
                      backgroundImage: `url(${studio.imageUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      width: "120px",
                      height: "50px",
                    }}
                  >
                    {/* {studio.name} */}
                  </button>
                ))}

                {studios
                  .slice(10, showAll ? studios.length : studios.length)
                  .map((studio) => (
                    <button
                      key={studio.id}
                      className={`btn ${
                        selectedStudio === studio.name ? "active" : ""
                      }`}
                      onClick={() => changeStudio(studio.name)}
                      style={{
                        backgroundImage: `url(${studio.imageUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        width: "120px",
                        height: "50px",
                        display: showAll ? "inline-block" : "none", // Hide extra buttons initially
                      }}
                    >
                      {/* {studio.name} */}
                    </button>
                  ))}
                {!showAll && (
                  <button className="btn btn-primary" onClick={toggleShowAll}>
                    Show More
                  </button>
                )}
                {showAll && (
                  <button className="btn btn-primary" onClick={toggleShowLess}>
                    Show Less
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default FilterMenu;
