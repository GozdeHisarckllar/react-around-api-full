const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  Card.create({ owner: req.user._id, ...req.body })
    .then((createdCard) => {
      Card.findById(createdCard._id)
        .populate(['owner', 'likes'])
        .then((card) => res.status(201).send({ data: card }))
        .catch(next);
    })// if (!card) => check err.name throw error
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('\'name\' or \'link\' field provided in the invalid format'));
        return;
      }
      next(err);
    });
};

/* module.exports.deleteCard = (req, res) => {
    const { cardId } = req.params;

    Card.findByIdAndRemove(cardId)
      .populate(['owner', 'likes'])
      .then((card) => {
        if (!card) {
          res.status(404).send({ message: 'Card ID not found' });
          return;
        }
        res.status(200).send({ data: card });
      })
      .catch((err) => {
        if (err.name === 'CastError') {
          res.status(400).send({ message: err.message });
          return;
        }
        res.status(500).send({ message: err.message });
      });
  }; */

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Card ID not found'));
        return;
      }
      if (card.owner._id.equals(req.user._id)) { // node.js Buffer.equals()
        Card.deleteOne(card) /* { _id: cardId } */ // findByIdAndRemove(card)
          // .populate(['owner', 'likes'])
          .then(() => {
            res.status(200).send({ message: 'This post has been successfully deleted' });
          })
          .catch(next);
      } else {
        next(new ForbiddenError('Forbidden resource. Authorization required'));
      }
    }).catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Incorrect ID'));
        return;
      }
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Card ID not found'));
        return;
      }
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Incorrect ID'));
        return;
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Card ID not found'));
        return;
      }
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Incorrect ID'));
        return;
      }
      next(err);
    });
};
