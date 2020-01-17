import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import './App.css';
import './App.scss';

import InfiniteScroll from 'react-infinite-scroll-component';
import ShibeImage from './Components/ShibeImage';
import HeartAnim from './Components/HeartAnim';
import LoaderAnim from './Components/LoaderAnim';

import * as ApiCalls from './ApiCalls';

function App() {
  const [images, setImages] = useState ([]);
  const [favourites, setFavourites] = useState ([]);
  const [hasMoreFavourites, setHasMoreFavourites] = useState (true);
  const [loaded, setIsLoaded] = useState (false);
  const [uuid, setUuid] = useState (localStorage.getItem ('uuid') || '');

  const preloadImages = async () => {
    ApiCalls.fetchImages ((urls) => {
      setImages([...images, ...urls]);
      setIsLoaded (true);
    });
  }

  const preloadFavourites = () => {
    const pageNo = 1 + Math.floor (favourites.length / ApiCalls.preloadCount);
    const pageOffset = favourites.length % ApiCalls.preloadCount;
    
    ApiCalls.fetchFavourites (uuid, pageNo, (res) => {
      const newItems = res['hydra:member'].slice (pageOffset).map (x => ({ url: x.url, id: x.id }));
      setFavourites ([...favourites, ...newItems]);
      setHasMoreFavourites (res['hydra:totalItems'] > favourites.length);
    });
  };

  const removeFavourite = iid => {
    const shibeId = favourites[iid].id;

    setFavourites (favourites.filter ((_, index) => index !== iid));
    ApiCalls.deleteShibe (shibeId);
  }

  useEffect (() => {
    preloadImages ();

    if (!uuid) {
      ApiCalls.fetchUuid ((id) => {
        setUuid (id);
        localStorage.setItem ('uuid', id);
      });
    }
      
    preloadFavourites ();
    }, []);


  function Home () {
    return (
      <div className="App">
        <Link to='/favourites' onClick={preloadFavourites} ><HeartAnim /></Link>

        <InfiniteScroll
          dataLength={images}
          next={preloadImages}
          onLoadMore={preloadImages}
          hasMore={true}
          loader={<LoaderAnim />}>

          <div className="image-grid">
            {loaded && images.map ((data, index) =>
             (<ShibeImage url={data} key={index} iid={data}
              onClick={() => ApiCalls.markFavourite (uuid, data)} />))}
          </div>
        </InfiniteScroll>

    </div>
    )
  }

  function Favourites() {
    return (
      <div className="Favourites">
        <Link to='/'><HeartAnim /></Link>

        <InfiniteScroll
          dataLength={favourites}
          next={preloadFavourites}
          onLoadMore={preloadFavourites}
          hasMore={hasMoreFavourites}
          loader={<LoaderAnim />}>

          <div className="image-grid">
            {favourites.map ((data, index) => (<ShibeImage url={data.url} key={index} iid={index} onClick={removeFavourite} />))}
          </div>
        </InfiniteScroll>

      </div>
    )
}

  return (
    <Router>
      <Route path='/' exact component={Home} />
      <Route path='/favourites' component={Favourites}/>
    </Router>
  );
}

export default App;
