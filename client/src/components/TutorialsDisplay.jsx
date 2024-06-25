import React, { useState } from "react";
import {
  InstantSearch,
  SearchBox,
  Hits,
  connectScrollTo,
} from "react-instantsearch-dom";
import algoliasearch from "algoliasearch/lite";
import "../styles/TutorialsDisplay.css";
import VideoModal from "./VideoModal";

// Initialize Algolia search client
const searchClient = algoliasearch(
  process.env.REACT_APP_ALGOLIA_APP_ID,
  process.env.REACT_APP_ALGOLIA_SEARCH_ONLY_KEY
);


const TutorialHit = ({ hit, openModal }) => {
  console.log("ttt", hit);
  const thumbnailUrl = hit.fields.images["en-US"][0].url;
  const title = hit.fields.title["en-US"];
  const videoUrl = hit.fields.video["en-US"].original_url;

  return (
    <div className="tutorial-hit">
      <div className="video-card">
        <img className="video-thumbnail" src={thumbnailUrl} alt={title} />
        <div className="video-info">
          <h3>{title}</h3>
          {/* Optional: If you want to link to a modal or dedicated page for viewing */}
          <button className="watch-video-button" onClick={() => openModal()}>
            Watch Video
          </button>
        </div>
      </div>
    </div>
  );
};

const TutorialsDisplay = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedTutorial, setSelectedTutorial] = useState(null);

  const openModalWithTutorial = (tutorial) => {
    setSelectedTutorial(tutorial);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedTutorial(null);
  };

  return (
    <InstantSearch
      searchClient={searchClient}
      indexName={process.env.REACT_APP_ALGOLIA_INDEX_NAME}
    >
      <div className="search-bar-container">
        <SearchBox />
      </div>

      <div className="tutorials-section-box">
        <Hits
          hitComponent={(hitProps) => (
            <TutorialHit
              {...hitProps}
              openModal={() => openModalWithTutorial(hitProps.hit)}
            />
          )}
        />
      </div>

      {/* Video Modal */}
      {selectedTutorial && (
        <VideoModal
          isOpen={isModalOpen}
          close={closeModal}
          videoUrl={selectedTutorial.fields.video["en-US"][0].original_url}
          title={selectedTutorial.fields.title["en-US"]}
          description={selectedTutorial.fields.shortDescription["en-US"]}
          // author={selectedTutorial.fields.author["en-US"]}
        />
      )}
    </InstantSearch>
  );
};

export default TutorialsDisplay;
