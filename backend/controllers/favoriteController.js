import User from '../models/User.js';
import Resource from '../models/Resource.js';
import Favorite from '../models/Favorite.js';

export const getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).lean();
    const favoriteIds = user ? user.favorites || [] : [];
    const favoriteResources = await Resource.find({ _id: { $in: favoriteIds } }).lean();
    res.json({ success: true, count: favoriteResources.length, favorites: favoriteResources });
  } catch (error) {
    next(error);
  }
};

export const toggleFavorite = async (req, res, next) => {
  try {
    const { resourceId } = req.body;
    if (!resourceId) return res.status(400).json({ success: false, message: 'Resource ID is required' });

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const idx = user.favorites.indexOf(resourceId);
    let isFavorited = false;

    if (idx !== -1) {
      user.favorites.splice(idx, 1);
      await Favorite.findOneAndDelete({ userId: req.user._id, resourceId });
      isFavorited = false;
    } else {
      user.favorites.push(resourceId);
      await Favorite.create({
        _id: `fav_${req.user._id}_${resourceId}`,
        userId: req.user._id,
        resourceId
      });
      isFavorited = true;
    }

    await user.save();

    res.json({
      success: true,
      message: isFavorited ? 'Added to favorite resources' : 'Removed from favorites',
      isFavorited,
      favorites: user.favorites
    });
  } catch (error) {
    next(error);
  }
};
