// utils/placeholder.js
// 占位图片生成工具

/**
 * 生成占位图片URL
 * @param {string} type - 图片类型 (car, avatar, banner)
 * @param {number} width - 图片宽度
 * @param {number} height - 图片高度
 * @param {string} text - 占位文字
 * @returns {string} 占位图片URL
 */
function generatePlaceholder(type, width = 400, height = 300, text = '') {
  const colors = {
    car: '#2E86AB',      // 海蓝色
    avatar: '#A23B72',   // 紫色
    banner: '#F18F01'    // 橙色
  }
  
  const bgColor = colors[type] || colors.car
  const textColor = '#FFFFFF'
  
  // 使用 placeholder.com 或类似服务
  return `https://via.placeholder.com/${width}x${height}/${bgColor.replace('#', '')}/${textColor.replace('#', '')}?text=${encodeURIComponent(text)}`
}

/**
 * 获取车辆占位图片
 * @param {string} brand - 车辆品牌
 * @param {string} model - 车辆型号
 * @param {number} index - 图片序号
 * @returns {string} 占位图片URL
 */
function getCarPlaceholder(brand, model, index = 1) {
  const text = `${brand} ${model}`
  return generatePlaceholder('car', 400, 300, text)
}

/**
 * 获取用户头像占位图片
 * @param {string} userName - 用户名
 * @returns {string} 占位图片URL
 */
function getAvatarPlaceholder(userName) {
  const initial = userName.charAt(0).toUpperCase()
  return generatePlaceholder('avatar', 100, 100, initial)
}

/**
 * 获取轮播图占位图片
 * @param {number} index - 轮播图序号
 * @returns {string} 占位图片URL
 */
function getBannerPlaceholder(index) {
  return generatePlaceholder('banner', 750, 300, `轮播图 ${index}`)
}

/**
 * 检查图片是否存在
 * @param {string} imagePath - 图片路径
 * @returns {Promise<boolean>} 图片是否存在
 */
function checkImageExists(imagePath) {
  return new Promise((resolve) => {
    const fs = wx.getFileSystemManager()
    fs.access({
      path: imagePath,
      success: () => resolve(true),
      fail: () => resolve(false)
    })
  })
}

/**
 * 获取图片URL，如果本地图片不存在则返回占位图片
 * @param {string} localPath - 本地图片路径
 * @param {string} fallbackUrl - 占位图片URL
 * @returns {Promise<string>} 图片URL
 */
async function getImageUrl(localPath, fallbackUrl) {
  const exists = await checkImageExists(localPath)
  return exists ? localPath : fallbackUrl
}

module.exports = {
  generatePlaceholder,
  getCarPlaceholder,
  getAvatarPlaceholder,
  getBannerPlaceholder,
  checkImageExists,
  getImageUrl
} 