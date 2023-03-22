// const { redisClient } = require('../plugins/redis.plugin');

/**
 * * Redis set() demo code
 * ! This method only supports string
 * @param set('key', 'value')
 * * you can pass the expiry with the set init as object
 * @param set('key', 'value', {EX: seconds<Number>})
 * * you can use setEX() to set value with expiry
 * @param setEx('key', expiry<Number>,'value')
 * * or you can pass the expiry explicitly like
 * @param redisClient.expire('key', seconds<Number>)
 */
setDemo = async () => {
  try {
    let result = await redisClient.set('key', 'value', { EX: 60 });
    console.log('setDemo-result', result);
  } catch (error) {
    console.log('setDemo-error', error);
  }
};

/**
 * * Redis get() demo code
 * ! This method only supports string
 * @param get('key')
 */
getDemo = async () => {
  try {
    let result = await redisClient.get('key1');
    console.log('getDemo-result', result);
  } catch (error) {
    console.log('getDemo-error', error);
  }
};

/**
 * * Redis mSet() demo code
 * ! This method only supports Array of strings
 * @param mSet(['key1', 'value1', 'key2', 'value2'])
 * * you can not pass the expiry with the mSet init, you need to pass the expiry explicitly
 * @param redisClient.expire('key', seconds<Number>)
 */
mSetDemo = async () => {
  try {
    let result = await redisClient.mSet(['key1', 'value1', 'key2', 'value2']);
    result = await redisClient.expire('key1', 60);
    result = await redisClient.expire('key2', 60);
    console.log('mSetDemo-result', result);

    let MSETResult = await redisClient.MSET(['k4', 'v1', 'k5', 'v5']);
    MSETResult = await redisClient.expire('k4', 60);
    MSETResult = await redisClient.expire('k5', 60);
    console.log('mSetDemo-MSETResult', MSETResult);
  } catch (error) {
    console.log('mSetDemo-error', error);
  }
};

/**
 * * Redis mGet() demo code
 * ! This method only supports Array of strings
 * @param mGet(['key1', 'key2'])
 */
mgetDemo = async () => {
  try {
    let result = await redisClient.mGet(['key1', 'key2']);
    console.log('mgetDemo-result', result);
  } catch (error) {
    console.log('mgetDemo-error', error);
  }
};

/**
 * * Redis hSet() demo code
 * ! This method only supports string
 * @param hSet('key', 'field', 'value')
 * @param hSet('key', ['field1', 'value1', 'filed2', 'value2', ..... ,'fieldN', 'valueN'])
 * * you can not pass the expiry with the hSet init, you need to pass the expiry explicitly
 * @param redisClient.expire('key', seconds<Number>)
 */
hSetDemo = async () => {
  try {
    let result = await redisClient.hSet('key3', [
      'test1',
      'test1-data',
      'test2',
      'test2-data',
    ]);
    result = await redisClient.expire('key3', 60);
    console.log('hSetDemo-result', result);
  } catch (error) {
    console.log('hSetDemo-error', error);
  }
};

/**
 * * Redis hGet() & hGetAll() demo code.
 * ! This method only supports string key, and field.
 * @param hGetAll('key')
 * * This method gets all the fields inside any given key.
 * @param hGet('key', 'field1')
 * * In this method you can only pass one field with the identifying key
 * * Suppose you just want to get a single field value of a stored key.
 */
hGetDemo = async () => {
  try {
    let result = await redisClient.hGetAll('key3');
    console.log('hGetDemo-result', result);
    let resultByKey = await redisClient.hGet('key3', 'test2');
    console.log('hGetDemo-resultByKey', resultByKey);
  } catch (error) {
    console.log('hGetDemo-error', error);
  }
};

/**
 * * Redis del() demo code.
 * ! This method only supports string key.
 * @param del('key')
 * * This method delete any given key.
 * @param hGet('key', 'field1')
 */
deleteDemo = async () => {
  try {
    let result = await redisClient.del('key');
    console.log('deleteDemo-result', result);
  } catch (error) {
    console.log('deleteDemo-error', error);
  }
};

setDemo();
getDemo();
mSetDemo();
mgetDemo();
hSetDemo();
hGetDemo();

deleteDemo();
