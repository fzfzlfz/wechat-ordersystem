Page({
  data: {
    categories: [
      { id: 'meat', name: '肉类' },
      { id: 'veggie', name: '蔬菜' },
      // 更多类别...
    ],
    allFoods: {
      meat: [
        { id: 1, name: "牛肉片", price: 30, img: "../images/food.png" },
        { id: 2, name: "猪肉片", price: 28, img: "../images/food.png" },
        { id: 3, name: "羊肉片", price: 32, img: "../images/food.png" },
        { id: 4, name: "鸡肉片", price: 25, img: "../images/food.png" },
        { id: 5, name: "鸭肉片", price: 26, img: "../images/food.png" },
        { id: 6, name: "鱼肉片", price: 29, img: "../images/food.png" },
        { id: 7, name: "虾肉片", price: 35, img: "../images/food.png" },
        { id: 8, name: "蟹肉片", price: 40, img: "../images/food.png" }
        // 更多肉类食物...
      ],
      veggie: [
        { id: 2, name: "生菜", price: 10, img: "../images/food.png" },
        // 更多蔬菜...
      ],
      // 更多类别的食物...
    },
    selectedFoods: [],
    cart: {}, // 购物车
    selectedCategoryId: null,
    totalAmount: 0 // 总金额
  },
  

  // 当页面加载
  onLoad: function() {
    this.selectCategory({ currentTarget: { dataset: { id: 'meat' } } });
  },

  // 选择类别
  selectCategory: function(e) {
    const categoryId = e.currentTarget.dataset.id;
    this.setData({
      selectedFoods: this.data.allFoods[categoryId] || [],
      selectedCategoryId: categoryId // 确保更新这里
    });
  },
  

  // 添加到购物车
  addToCart: function(e) {
    const foodId = e.currentTarget.dataset.id;
    const newCart = { ...this.data.cart };
    newCart[foodId] = (newCart[foodId] || 0) + 1;
    this.setData({ cart: newCart });
    this.calculateTotal();
  },

  // 从购物车中移除
  removeFromCart: function(e) {
    const foodId = e.currentTarget.dataset.id;
    const newCart = { ...this.data.cart };
    if (newCart[foodId] && newCart[foodId] > 0) {
      newCart[foodId] -= 1;
    }
    if (newCart[foodId] === 0) {
      delete newCart[foodId]; // 如果数量为0，从购物车中移除该商品
    }
    this.setData({ cart: newCart });
    this.calculateTotal();
  },

  // 计算总金额
  calculateTotal: function() {
    let total = 0;
    for (let id in this.data.cart) {
      const food = this.findFoodById(parseInt(id));
      total += (food.price * this.data.cart[id]);
    }
    this.setData({ totalAmount: total });
  },

  // 根据 ID 查找食物
  findFoodById: function(id) {
    for (let category in this.data.allFoods) {
      const food = this.data.allFoods[category].find(item => item.id === id);
      if (food) return food;
    }
    return null;
  },

  // 前往购物车页面
  goToCart: function() {
    wx.switchTab({
      url: '../cart/cart'
    });
  }
});
