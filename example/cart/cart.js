Page({
  data: {
    cartItems: {},
    totalPrice: 0 // 总价格
  },
  objectToArray: function(obj) {
    return Object.keys(obj).map(key => obj[key]);
  },

  onShow: function() {
    const app = getApp();
    const cartData = app.globalData.cartData;
    this.setData({ cartItems: cartData || {} }, () => {
      this.updateGlobalCartData();
      this.calculateTotal();
    });
  },
  
  // 计算购物车总价
  calculateTotal: function() {
    let total = 0;
    Object.values(this.data.cartItems).forEach(item => {
      total += item.price * item.quantity;
    });
    this.setData({ totalPrice: total });
  },
  
increaseQuantity: function(e) {
  const itemId = e.currentTarget.dataset.id; // 使用商品ID
  const cartItems = this.data.cartItems;

  if (cartItems[itemId]) {
    cartItems[itemId].quantity += 1;
  }

  this.setData({ cartItems }, () => {
    this.updateGlobalCartData();
    this.calculateTotal();
  });
  
},

decreaseQuantity: function(e) {
  console.log("decrease now");
  const app = getApp();
  const itemId = e.currentTarget.dataset.id; // 使用商品ID
  const cartItems = this.data.cartItems;

  if (cartItems[itemId] && cartItems[itemId].quantity > 1) {
    cartItems[itemId].quantity -= 1;
    this.setData({ cartItems }, () => {
      this.updateGlobalCartData();
      this.calculateTotal();
    });
    
  }
},


  removeItem: function(e) {
    console.log("remove this");
    const app = getApp();
    const itemId = e.currentTarget.dataset.id; // 假设您有商品ID的数据绑定
    const cartItems = this.data.cartItems;
  
    delete cartItems[itemId]; // 使用 delete 来移除对象属性
    
    this.setData({ cartItems }, () => {
      this.updateGlobalCartData();
      this.calculateTotal();
    });
    
  },
  

  updateGlobalCartData: function() {
    const app = getApp();
    app.globalData.cartData = this.data.cartItems;
  },

  goToOrder: function() {
    const app = getApp();
    wx.switchTab({
      url: '../order/order'
    });
  },

  checkout: function() {
    console.log("下单！");
  }

});
