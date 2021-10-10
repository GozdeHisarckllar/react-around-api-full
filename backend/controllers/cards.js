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
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('\'name\' or \'link\' field provided in the invalid format'));
        return;
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw (new NotFoundError('Card ID not found'));
      }
      if (card.owner._id.equals(req.user._id)) {
        Card.deleteOne(card)
          .then(() => {
            res.status(200).send({ message: 'This post has been successfully deleted' });
          })
          .catch(next);
      } else {
        throw (new ForbiddenError('Forbidden to delete another user\'s post'));
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
        throw new NotFoundError('Card ID not found');
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
        throw new NotFoundError('Card ID not found');
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
