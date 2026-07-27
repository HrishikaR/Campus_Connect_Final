import Club from '../models/Club.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

export const getClubs = async (req, res, next) => {
  try {
    const clubs = await Club.find({}).lean();
    res.json({ success: true, count: clubs.length, clubs });
  } catch (error) {
    next(error);
  }
};

export const getClubById = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id).lean();
    if (!club) return res.status(404).json({ success: false, message: 'Club not found' });
    res.json({ success: true, club });
  } catch (error) {
    next(error);
  }
};

export const createClub = async (req, res, next) => {
  try {
    const { name, category, description, logo, banner } = req.body;
    if (!name || !category || !description) {
      return res.status(400).json({ success: false, message: 'Please provide club name, category, and description' });
    }

    const newClubId = `club_${Date.now()}`;
    const newClubData = {
      _id: newClubId,
      name,
      category,
      description,
      logo: logo || "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=300&q=80",
      banner: banner || "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80",
      leaderId: req.user._id,
      leaderName: req.user.name,
      members: [{ userId: req.user._id, name: req.user.name, role: 'President', status: 'approved' }],
      pendingRequests: [],
      createdDate: new Date().toISOString()
    };

    const doc = await Club.create(newClubData);
    await User.findByIdAndUpdate(req.user._id, { $addToSet: { joinedClubs: newClubId } });

    res.status(201).json({ success: true, message: 'Club created successfully', club: doc.toObject() });
  } catch (error) {
    next(error);
  }
};

export const joinClub = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ success: false, message: 'Club not found' });

    const existingMember = club.members.find(m => m.userId === req.user._id);
    if (existingMember) {
      return res.status(400).json({ success: false, message: 'You are already a member or pending approval in this club.' });
    }

    club.members.push({
      userId: req.user._id,
      name: req.user.name,
      role: 'Member',
      status: 'approved'
    });

    await club.save();
    await User.findByIdAndUpdate(req.user._id, { $addToSet: { joinedClubs: req.params.id } });

    await Notification.create({
      _id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: req.user._id,
      title: "Joined Club",
      message: `You have successfully joined ${club.name}.`,
      type: "club",
      isRead: false
    });

    res.json({ success: true, message: 'Joined club successfully', club: club.toObject() });
  } catch (error) {
    next(error);
  }
};

export const leaveClub = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ success: false, message: 'Club not found' });

    club.members = club.members.filter(m => m.userId !== req.user._id);
    await club.save();
    await User.findByIdAndUpdate(req.user._id, { $pull: { joinedClubs: req.params.id } });

    res.json({ success: true, message: 'Left club', club: club.toObject() });
  } catch (error) {
    next(error);
  }
};

export const requestMembership = async (req, res, next) => {
  try {
    const { statement } = req.body;
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ success: false, message: 'Club not found' });

    const isMember = club.members.some(m => m.userId === req.user._id);
    if (isMember) {
      return res.status(400).json({ success: false, message: 'You are already a registered member of this club.' });
    }

    const existingReq = club.pendingRequests.find(r => r.userId === req.user._id);
    if (existingReq) {
      return res.status(400).json({ success: false, message: 'You already have a pending membership request for this club.' });
    }

    const reqObj = {
      _id: `req_${Date.now()}`,
      userId: req.user._id,
      name: req.user.name,
      email: req.user.email,
      statement: statement || "I'd love to contribute to this club!",
      requestedAt: new Date().toISOString()
    };

    club.pendingRequests.push(reqObj);
    await club.save();

    await Notification.create({
      _id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId: club.leaderId,
      title: "New Membership Request",
      message: `${req.user.name} submitted a membership request for ${club.name}.`,
      type: "club",
      isRead: false
    });

    res.status(201).json({ success: true, message: 'Membership request submitted', request: reqObj });
  } catch (error) {
    next(error);
  }
};

export const approveMembership = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ success: false, message: 'Club not found' });

    const reqIdx = club.pendingRequests.findIndex(r => r.userId === userId);
    if (reqIdx === -1) {
      return res.status(400).json({ success: false, message: 'Request not found' });
    }

    const reqObj = club.pendingRequests[reqIdx];
    club.pendingRequests.splice(reqIdx, 1);

    club.members.push({
      userId: reqObj.userId,
      name: reqObj.name,
      role: 'Member',
      status: 'approved'
    });

    await club.save();
    await User.findByIdAndUpdate(userId, { $addToSet: { joinedClubs: req.params.id } });

    await Notification.create({
      _id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      title: "Membership Approved!",
      message: `Congratulations! Your membership request for ${club.name} has been approved.`,
      type: "club",
      isRead: false
    });

    res.json({ success: true, message: 'Membership approved', club: club.toObject() });
  } catch (error) {
    next(error);
  }
};

export const rejectMembership = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ success: false, message: 'Club not found' });

    club.pendingRequests = club.pendingRequests.filter(r => r.userId !== userId);
    await club.save();

    await Notification.create({
      _id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      title: "Membership Update",
      message: `Your membership request for ${club.name} was not accepted at this time.`,
      type: "club",
      isRead: false
    });

    res.json({ success: true, message: 'Membership request declined', club: club.toObject() });
  } catch (error) {
    next(error);
  }
};

export const updateClub = async (req, res, next) => {
  try {
    const club = await Club.findById(req.params.id).lean();
    if (!club) return res.status(404).json({ success: false, message: 'Club not found' });

    if (club.leaderId !== req.user._id && req.user.role !== 'super_admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to manage this club' });
    }

    const updated = await Club.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true }).lean();
    res.json({ success: true, message: 'Club updated', club: updated });
  } catch (error) {
    next(error);
  }
};
