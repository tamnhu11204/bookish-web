import React from "react";
import "./NewsCard.css";

const NewsCard = ({ image, title, date }) => {
  return (
    <div className="news-card2">
      <img src={image} alt={title} className="news-card-image2" />
      <div className="news-card-content">
        <h4 className="news-card-title">{title}</h4>
        <p className="news-card-date">{date}</p>
      </div>
    </div>
  );
};

export default NewsCard;
