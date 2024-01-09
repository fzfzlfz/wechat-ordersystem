Page({
  data: {
    // You can add more data here if needed
  },
  // Function to navigate to the Order page
  navigateToOrder: function() {
    wx.switchTab({
      url: './order/order'
    });
  },
  // Function to navigate to the Member page
  navigateToMember: function() {
    wx.switchTab({
      url: './user/user'
    });
  }
});
