const app = getApp()

Page({
  data: {
    hasLogin: false,
    userInfo: null,
    userStats: {
      shareCount: 0,
      likeCount: 0,
      collectCount: 0,
      followCount: 0,
      fanCount: 0
    },
    logs: []
  },

  onLoad: function (options) {
    this.addLog('页面加载完成')
    this.refreshStatus()
  },

  onShow: function () {
    this.addLog('页面显示')
    this.refreshStatus()
  },

  // 刷新登录状态
  refreshStatus: function () {
    this.setData({
      hasLogin: app.globalData.hasLogin,
      userInfo: app.globalData.userInfo,
      userStats: app.globalData.userStats
    })
    this.addLog(`刷新状态：${app.globalData.hasLogin ? '已登录' : '未登录'}`)
  },

  // 跳转到登录页面
  goToLogin: function () {
    this.addLog('跳转到登录页面')
    wx.navigateTo({
      url: '/pages/login/login?from=test'
    })
  },

  // 测试退出登录
  testLogout: function () {
    this.addLog('开始退出登录')
    app.logout().then(() => {
      this.addLog('退出登录成功')
      this.refreshStatus()
      app.showToast('退出登录成功')
    })
  },

  // 测试提示
  testToast: function () {
    this.addLog('测试提示消息')
    app.showToast('这是一个测试提示', 'success')
  },

  // 添加日志
  addLog: function (content) {
    const now = new Date()
    const time = app.formatTime(now)
    const logs = this.data.logs
    logs.unshift({
      time: time,
      content: content
    })
    
    // 只保留最新的20条日志
    if (logs.length > 20) {
      logs.pop()
    }
    
    this.setData({
      logs: logs
    })
  }
}) 