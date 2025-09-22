import React from "react";
import "./CardNews.css"; // file css riêng

const NewsCard = ({ image, date, author, title, description }) => {
  return (
    <div className="news-card">
      <div className="news-card-image">
        <img src={image} alt={title} />
      </div>

      <div className="news-card-content">
        <div className="news-card-meta">
          <span className="news-card-date">{date}</span>
          <span className="news-card-author">- {author}</span>
        </div>

        <h3 className="news-card-title">{title}</h3>
        <p className="news-card-description">{description}</p>
      </div>
    </div>
  );
};

export default NewsCard;
