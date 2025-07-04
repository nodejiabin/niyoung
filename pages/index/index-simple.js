// 简化版首页测试
Page({
  data: {
    message: '爱车分享小程序',
    testData: [
      { id: 1, name: '测试数据1' },
      { id: 2, name: '测试数据2' },
      { id: 3, name: '测试数据3' }
    ]
  },

  onLoad: function() {
    console.log('首页加载成功')
    console.log('测试数据:', this.data.testData)
  },

  onShow: function() {
    console.log('首页显示')
  },

  onTap: function() {
    wx.showToast({
      title: '点击成功',
      icon: 'success'
    })
  }
}) 