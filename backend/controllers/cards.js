const Card = require('../models/card');

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  Card.create({ owner: req.user._id, ...req.body })
    .then((card) => res.status(201).send({ data: card }))// if (!card) => check err.name throw error
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
        return;
      }
      res.status(500).send({ message: err.message });
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

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Card ID not found' });
        return;
      }
      if (card.owner._id.equals(req.user._id)) { // node.js Buffer.equals()
        Card.deleteOne(cardId) /* { _id: cardId } */ // findByIdRemove(card)
          .populate(['owner', 'likes'])
          .then(() => {
            res.status(200).send({ message: 'This post has been successfully deleted' });
          })
          .catch((err) => {
            if (err.name === 'CastError') {
              res.status(400).send({ message: err.message });
              return;
            }
            res.status(500).send({ message: err.message });
          });
      } else {
        res.status(403).send({ message: 'Forbidden' });
      }
    }).catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: err.message });
        return;
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports.likeCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
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
};

module.exports.dislikeCard = (req, res) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
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
};
