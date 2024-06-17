import algoliasearch from "algoliasearch/lite";
import {
  InstantSearch,
  SearchBox,
  Hits,
  Pagination,
  RefinementList,
} from "react-instantsearch";
import "../styles/productList.css"

const searchClient = algoliasearch(
  "LQ3AGF58XX",
  "6d50bab0ee0616f1d5994ba0dfa920f3"
);

function Hit({ hit }) {
  console.log(hit);
  return (<>
    
    <article className="search-panel_item">
      <div>
        <div>
          <img src={hit.images} alt="images" />
          <h1>{hit.name["en-US"]}</h1>
          <p>{hit.description["en-US"]}</p>
          <h4>{hit.productType}</h4>
          <h3>Rs. {hit.prices['INR'].max}</h3>
        </div>
      </div>
    </article>
    </>
  );
}


function ProductListPage() {
  return (
    <div className="container">
      <InstantSearch searchClient={searchClient} indexName="Handicraft_Machathon" insights>
      <div className="search-container">
              <SearchBox placeholder="Search" />
            </div>
        <div className="output-result-and-filters">
          <div className="search-panel__filters">
            <div className="filter_container">
            <h4>Category</h4>
              <RefinementList
                attribute="categories.en-US.lvl0"
              />
               <h4>Price</h4>
              <RefinementList
                attribute="prices.INR.max"
              />

</div>
          </div>

           
          <div className="search-panel__results">
            
              <Hits hitComponent={Hit} />
            

            <div className="pagination">
              <Pagination />
            </div>
          </div>
        </div>
      </InstantSearch>
    </div>
  );
}
export default ProductListPage;
