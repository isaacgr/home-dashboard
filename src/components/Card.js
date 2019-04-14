import React from "react";

const Card = props => (
  <div className={`card u-raised ${props.classes}`}>
    <div className="card__header">
      <i className={`card__icon ${props.icon}`} />
      <h6 className="card__title">{props.title}</h6>
    </div>
    <div className="card__content">
      <h1 className="card__content__title">{props.contentTitle}</h1>
      {props.values.map(value => (
        <div className="card__content--block">
          {value.icon ? (
            <i className={`card__icon ${value.icon}`} />
          ) : (
            <h5 className="card__content__value--description">
              {value.description}
            </h5>
          )}
          <h2 className="card__content__value">{value.content}</h2>
        </div>
      ))}
    </div>
    <CardFooter key={props.footerContent} footerContent={props.footerContent} />
  </div>
);

const CardFooter = props => (
  <div className="card__footer">
    <h6 className="card__footer__title">{props.footerContent.title}</h6>
    <p className="card__footer__content">{props.footerContent.content}</p>
  </div>
);

export default Card;
