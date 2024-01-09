Page({
  data: {
    cartItems: [
      // 示例购物车数据
      { id: 1, name: '牛肉片', price: 30, quantity: 2, img: '../images/food.png' },
      { id: 2, name: '羊肉片', price: 28, quantity: 1, img: '../images/food.png' }
      // 更多商品...
    ],
    totalPrice: 0 // 总价格
  },

  onLoad: function() {
    this.calculateTotal();
  },

  // 计算购物车总价
  calculateTotal: function() {
    let total = 0;
    this.data.cartItems.forEach(item => {
      total += item.price * item.quantity;
    });
    this.setData({ totalPrice: total });
  },

  // 增加商品数量
  increaseQuantity: function(e) {
    const index = e.currentTarget.dataset.index;
    const cartItems = this.data.cartItems;
    cartItems[index].quantity += 1;
    this.setData({ cartItems });
    this.calculateTotal();
  },

  // 减少商品数量
  decreaseQuantity: function(e) {
    const index = e.currentTarget.dataset.index;
    const cartItems = this.data.cartItems;
    if (cartItems[index].quantity > 1) {
      cartItems[index].quantity -= 1;
      this.setData({ cartItems });
      this.calculateTotal();
    }
  },

  // 移除商品
  removeItem: function(e) {
    const index = e.currentTarget.dataset.index;
    const cartItems = this.data.cartItems;
    cartItems.splice(index, 1);
    this.setData({ cartItems });
    this.calculateTotal();
  },

  // 其他购物车相关的方法...
});
