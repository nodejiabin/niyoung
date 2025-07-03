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
    apiUrl: 'https://your-api-domain.com' // 请替换为您的后端API地址
  },

  onLaunch: function () {
    console.log('小程序启动')
    // 检查登录状态
    this.checkLoginStatus()
  },

  onShow: function (options) {
    console.log('小程序显示')
  },

  onHide: function () {
    console.log('小程序隐藏')
  },

  onError: function (msg) {
    console.log('小程序错误:', msg)
  },

  // 检查登录状态
  checkLoginStatus: function () {
    const token = wx.getStorageSync('token')
    const userInfo = wx.getStorageSync('userInfo')
    
    if (token && userInfo) {
      this.globalData.hasLogin = true
      this.globalData.userInfo = userInfo
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
  }
})