const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {
  // 云函数逻辑
  return {
    message: 'Hello World'
  }
}
