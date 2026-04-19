const Outage = require('../models/Outage');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalOutages = await Outage.countDocuments();
    const pending = await Outage.countDocuments({ status: 'pending' });
    const inProgress = await Outage.countDocuments({ status: 'in_progress' });
    const resolved = await Outage.countDocuments({ status: 'resolved' });

    const byTypeData = await Outage.aggregate([{ $group: { _id: "$type", count: { $sum: 1 } } }]);
    const byType = byTypeData.map(t => ({ type: t._id, count: t.count }));

    const byPriorityData = await Outage.aggregate([{ $group: { _id: "$priority", count: { $sum: 1 } } }]);
    const byPriority = byPriorityData.map(p => ({ priority: p._id, count: p.count }));

    res.json({
      totalOutages, pending, inProgress, resolved,
      byType,
      byPriority,
      recentTrend: [] 
    });
  } catch (err) {
    res.status(500).json({ message: 'Error generating stats' });
  }
};

exports.getRecentTrend = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // 6 days ago + today = 7 days
    sevenDaysAgo.setHours(0, 0, 0, 0); // Start at midnight

    const trendData = await Outage.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
    ]);

    // Generate an array of the last 7 days, zero-padded
    const recentTrend = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      
      const found = trendData.find(t => t._id === dateStr);
      recentTrend.push({ date: dateStr, count: found ? found.count : 0 });
    }

    res.json(recentTrend);
  } catch (err) {
    res.status(500).json({ message: 'Error generating trend stats' });
  }
};