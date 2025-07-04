/*
 * @Author: wjb
 * @Date: 2025-07-03 14:04:57
 * @LastEditors: wjb
 * @LastEditTime: 2025-07-03 14:44:36
 * @Description: 小程序主入口文件
 */
App({
  globalData: {
    userInfo: null,
    hasLogin: false,
    openid: '',
    apiUrl: 'https://your-api-domain.com', // 请替换为您的后端API地址
    version: '1.0.0',
    // 用户统计数据
    userStats: {
      shareCount: 0,
      likeCount: 0,
      collectCount: 0,
      followCount: 0,
      fanCount: 0
    },
    // 缓存数据
    cacheData: {
      banners: [],
      categories: [],
      hotCars: []
    }
  },

  onLaunch: function () {
    console.log('小程序启动')
    // 检查登录状态
    this.checkLoginStatus()
    // 初始化系统信息
    this.initSystemInfo()
  },

  onShow: function (options) {
    console.log('小程序显示')
    // 检查登录状态变化
    this.checkLoginStatus()
  },

  onHide: function () {
    console.log('小程序隐藏')
  },

  onError: function (msg) {
    console.log('小程序错误:', msg)
    // 错误上报
    this.reportError(msg)
  },

  // 初始化系统信息
  initSystemInfo: function () {
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.systemInfo = res
        console.log('系统信息:', res)
      }
    })
  },

  // 检查登录状态
  checkLoginStatus: function () {
    const token = wx.getStorageSync('token')
    const userInfo = wx.getStorageSync('userInfo')
    
    if (token && userInfo) {
      this.globalData.hasLogin = true
      this.globalData.userInfo = userInfo
      // 加载用户统计数据
      this.loadUserStats()
    } else {
      this.globalData.hasLogin = false
      this.globalData.userInfo = null
    }
  },

  // 获取用户信息
  getUserInfo: function () {
    return new Promise((resolve, reject) => {
      if (this.globalData.userInfo) {
        resolve(this.globalData.userInfo)
      } else {
        wx.getUserProfile({
          desc: '用于完善用户资料',
          success: (res) => {
            this.globalData.userInfo = res.userInfo
            resolve(res.userInfo)
          },
          fail: reject
        })
      }
    })
  },

  // 微信登录
  wxLogin: function () {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          if (res.code) {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            wx.request({
              url: this.globalData.apiUrl + '/api/login',
              method: 'POST',
              data: {
                code: res.code
              },
              success: (response) => {
                if (response.data.success) {
                  this.globalData.openid = response.data.openid
                  this.globalData.hasLogin = true
                  wx.setStorageSync('token', response.data.token)
                  resolve(response.data)
                } else {
                  reject(response.data)
                }
              },
              fail: reject
            })
          } else {
            reject(new Error('登录失败！' + res.errMsg))
          }
        },
        fail: reject
      })
    })
  },

  // 退出登录
  logout: function () {
    return new Promise((resolve) => {
      // 清除本地存储
      wx.removeStorageSync('token')
      wx.removeStorageSync('userInfo')
      wx.removeStorageSync('userStats')
      
      // 重置全局数据
      this.globalData.hasLogin = false
      this.globalData.userInfo = null
      this.globalData.openid = ''
      this.globalData.userStats = {
        shareCount: 0,
        likeCount: 0,
        collectCount: 0,
        followCount: 0,
        fanCount: 0
      }
      
      resolve()
    })
  },

  // 加载用户统计数据
  loadUserStats: function () {
    const cachedStats = wx.getStorageSync('userStats')
    if (cachedStats) {
      this.globalData.userStats = cachedStats
    } else {
      // 模拟API请求
      setTimeout(() => {
        this.globalData.userStats = {
          shareCount: Math.floor(Math.random() * 50) + 10,
          likeCount: Math.floor(Math.random() * 200) + 50,
          collectCount: Math.floor(Math.random() * 100) + 20,
          followCount: Math.floor(Math.random() * 80) + 15,
          fanCount: Math.floor(Math.random() * 120) + 30
        }
        wx.setStorageSync('userStats', this.globalData.userStats)
      }, 1000)
    }
  },

  // 更新用户统计数据
  updateUserStats: function (type, increment = 1) {
    if (!this.globalData.hasLogin) return
    
    if (this.globalData.userStats[type] !== undefined) {
      this.globalData.userStats[type] += increment
      wx.setStorageSync('userStats', this.globalData.userStats)
    }
  },

  // 错误上报
  reportError: function (error) {
    console.error('错误上报:', error)
    // 这里可以添加错误上报到后台的逻辑
  },

  // 显示加载提示
  showLoading: function (title = '加载中...') {
    wx.showLoading({
      title: title,
      mask: true
    })
  },

  // 隐藏加载提示
  hideLoading: function () {
    wx.hideLoading()
  },

  // 显示提示消息
  showToast: function (title, icon = 'none', duration = 2000) {
    wx.showToast({
      title: title,
      icon: icon,
      duration: duration
    })
  },

  // 显示确认对话框
  showModal: function (title, content) {
    return new Promise((resolve) => {
      wx.showModal({
        title: title,
        content: content,
        success: (res) => {
          resolve(res.confirm)
        }
      })
    })
  },

  // 格式化时间
  formatTime: function (date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(this.formatNumber).join('-') +
      ' ' + [hour, minute, second].map(this.formatNumber).join(':')
  },

  // 格式化数字
  formatNumber: function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },

  // 防抖函数
  debounce: function (func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  },

  // 节流函数
  throttle: function (func, limit) {
    let inThrottle
    return function () {
      const args = arguments
      const context = this
      if (!inThrottle) {
        func.apply(context, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }
})