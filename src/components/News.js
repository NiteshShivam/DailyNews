import React,{useEffect,useState} from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const  News =(props)=> {
   const [articles,setArticles] = useState([])
   const [loading,setLoading] = useState(true)
   const [page,setPage] = useState(1)
   const [totalResults,setTotalResults] = useState(0)
  
  
  const capitalizeFirstLetter = (string)=> {
    return string.charAt(0).toUpperCase() + string.slice(1);}
  
  
  const updateNew = async()=> {
    props.setProgress(10);
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apikey}&page=${page}&pageSize=${props.pageSize}`;
    
    setLoading(true)
    props.setProgress(25);
    let data = await fetch(url);
    let parseData = await data.json();
    props.setProgress(50);
    setArticles(parseData.articles)
    setTotalResults(parseData.totalResults)
    setLoading(false)
    
    props.setProgress(100);
  }
  useEffect(()=>{
     document.title = `${capitalizeFirstLetter(props.category)} - Daily News`;
    updateNew();
    // eslint-disable-next-line
  },[])
    
  const fetchMoreData = async () => {
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apikey}&page=${page+1}&pageSize=${props.pageSize}`;
    
    setPage(page+1)
    
    let data = await fetch(url);
    let parseData = await data.json();
    console.log(parseData);
    setArticles(articles.concat(parseData.articles))
    setTotalResults(parseData.totalResults)
    
  };
  
    return (
      <>
      
        <h2 className="text-center" style={{ margin: "35px 0px" ,marginTop:"90px" }}>
          DailyNews - Top {capitalizeFirstLetter(props.category)}{" "}
          Headlines
        </h2>
        {loading && <Spinner/>}

        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !== totalResults}
          loader={<Spinner />}
        >
          <div className="container">
            <div className="classname row">
              {articles.map((element) => {
                return (
                  <div className="col-md-4" key={element.url}>
                    <NewsItem
                      title={element.title ? element.title : ""}
                      description={
                        element.description ? element.description : ""
                      }
                      imageUrl={element.urlToImage}
                      newsUrl={element.url}
                      author={element.author ? element.author : "unknown"}
                      date={
                        element.publishedAt ? element.publishedAt : "not known"
                      }
                      source={element.source.name}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </InfiniteScroll>
      
      </>
    );
  
}
News.defaultProps = {
  country: "in",
  pageSize: 8,
  category: "general",
};
News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
};
export default News;
