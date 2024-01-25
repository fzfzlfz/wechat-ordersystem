const cloud = require('wx-server-sdk');
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

exports.main = async (event, context) => {
  try {
    // Retrieve all documents from 'HotpotList'
    const foodListResult = await db.collection('HotpotList')
                                  .where({
                                    isFood: true // Condition
                                  }).get();
    const foodList = foodListResult.data;

    // Retrieve documents from 'HotpotList' where 'menu' is true
    const categoryListResult = await db.collection('HotpotList')
                                      .where({
                                        isCategory: true // Condition
                                      }).get();
    const categoryList = categoryListResult.data[0].categories;

    return { foodList, categoryList };
  } catch(e) {
    console.error(e);
    return { error: e };
  }
}