Page({
  data: {
    categories:[],
    allFoods: {
      
      "meat": [
        // { id: 1, name: "牛肉片", price: 30,quantity: 0, img: "../images/food.png" },
        // { id: 2, name: "猪肉片", price: 28,quantity: 0, img: "../images/food.png" },
        // { id: 3, name: "羊肉片", price: 32,quantity: 0, img: "../images/food.png" },
        // { id: 4, name: "鸡肉片", price: 25,quantity: 0, img: "../images/food.png" },
        // { id: 5, name: "鸭肉片", price: 26,quantity: 0, img: "../images/food.png" },
        // { id: 6, name: "鱼肉片", price: 29,quantity: 0, img: "../images/food.png" },
        // { id: 7, name: "虾肉片", price: 35,quantity: 0, img: "../images/food.png" },
        // { id: 8, name: "蟹肉片", price: 40,quantity: 0, img: "../images/food.png" }
        // 更多肉类食物...
      ],
      "veggie": [
        // { id: 9, name: "生菜", price: 10,quantity: 0, img: "../images/food.png" },
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
    this.getFoodAndMenuFromDB();
  },

  onShow: function() {
    const app = getApp();
    const globalCart = app.globalData.cartData || {};
    // 更新 allFoods 中每个食物的 quantity
    for (let category in this.data.allFoods) {
      this.data.allFoods[category].forEach(food => {
        if (globalCart[food._id]) {
          food.quantity = globalCart[food._id].quantity;
        } else {
          food.quantity = 0; // 如果全局购物车中没有此食物，设置数量为0
        }
      });
    }

    // 从全局变量同步购物车数据
    this.setData({
      cart: globalCart,
      allFoods: this.data.allFoods
    });
    this.calculateTotal();
  },

  getFoodAndMenuFromDB: async function() {
    try {
      const res = await wx.cloud.callFunction({
        name: 'placeOrder', // 替换为您的云函数名称
      });
      console.log("cloudfunc result");
      console.log(res.result);
      const { foodList, categoryList } = res.result;
      this.loadFoodAndMenu(categoryList, foodList); // Load and organize food data

      if (this.data.categories.length > 0) {
        const firstCategory = this.data.categories[0];
        this.setData({
          selectedCategory: firstCategory,
          selectedFoods: this.data.allFoods[firstCategory] || []
        });
      }
    } catch (error) {
      console.error(error);
    }
  },

  // 加载食物数据到 allFoods
  loadFoodAndMenu: async function(categoryList, foodList) {
    var foodItems = {...this.data.allFoods};

    // set up allFoods categories
    for (let category of categoryList) {
      foodItems[category] = [];
    }
    for (const item of foodList) {
      if (item.isFood && item.category) {
        foodItems[item.category].push(item);
      } 
    }

    this.setData({ allFoods: foodItems, categories: categoryList });
  },

 // 选择类别
  selectCategory: function(e) {
    
    const categoryName = e.currentTarget.dataset.category;
    console.log("select category: " + categoryName);
    this.setData({
      selectedFoods: this.data.allFoods[categoryName] || [],
      selectedCategory: categoryName // 更新为 selectedCategory
    });
  },

  

  // 添加到购物车
  addToCart: function(e) {
    const foodId = e.currentTarget.dataset.id;
    const foodItem = this.findFoodById(foodId); // Find the complete food item

    if (!foodItem) return; // If no item is found, exit the function

    const newCart = { ...this.data.cart };

    // Check if the item is already in the cart
    if (newCart[foodId]) {
      newCart[foodId].quantity += 1; // Increase quantity
    } else {
      // Add new item to cart with quantity set to 1
      newCart[foodId] = { ...foodItem, quantity: 1 };
    }


    this.setData({ cart: newCart });
    this.calculateTotal();
    this.updateGlobalCartData();
  },

  // 从购物车中移除
  removeFromCart: function(e) {
    const foodId = e.currentTarget.dataset.id;
    const newCart = { ...this.data.cart };
    if(!newCart[foodId]) return;
    if (newCart[foodId].quantity && newCart[foodId].quantity > 0) {
      newCart[foodId].quantity -= 1;
    }
    if (newCart[foodId].quantity === 0) {
      delete newCart[foodId]; // 如果数量为0，从购物车中移除该商品
    }
    this.setData({ cart: newCart });
    this.calculateTotal();
    this.updateGlobalCartData();
  },

  updateGlobalCartData: function() {
    // 更新全局购物车数据
    const app = getApp();
    app.globalData.cartData = this.data.cart;
    console.log(app.globalData.cartData);
  },

  // 计算总金额
  calculateTotal: function() {
    let total = 0;
    for (let id in this.data.cart) {
      total += this.data.cart[id].price * this.data.cart[id].quantity;
    }
    this.setData({ totalAmount: total });
  },

  // 根据 ID 查找食物
  findFoodById: function(id) {
    for (let category in this.data.allFoods) {
      const food = this.data.allFoods[category].find(item => item._id === id);
      if (food) return food;
    }
    return null;
  },

  // 前往购物车页面
  goToCart: function() {
    const app = getApp();
    app.globalData.cartData = this.data.cart; // 保存购物车数据到全局
    wx.switchTab({
      url: '../cart/cart'
    });
  }
});
