const app = getApp()

Page({
  data: {
    userInfo: null,
    userStats: {
      shareCount: 0,
      likeCount: 0,
      collectCount: 0,
      myLikeCount: 0,
      myCollectCount: 0
    },
    carList: [],
    recentActivities: []
  },

  onLoad: function (options) {
    console.log('我的页面加载')
  },

  onShow: function () {
    console.log('我的页面显示')
    this.loadUserData()
  },

  onPullDownRefresh: function () {
    console.log('下拉刷新')
    this.loadUserData()
    wx.stopPullDownRefresh()
  },

  // 加载用户数据
  loadUserData: function () {
    if (app.globalData.hasLogin) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
      this.loadUserStats()
      this.loadCarList()
      this.loadRecentActivities()
    } else {
      this.setData({
        userInfo: null,
        userStats: {
          shareCount: 0,
          likeCount: 0,
          collectCount: 0,
          myLikeCount: 0,
          myCollectCount: 0
        },
        carList: [],
        recentActivities: []
      })
    }
  },

  // 加载用户统计数据
  loadUserStats: function () {
    // 模拟API请求
    setTimeout(() => {
      this.setData({
        userStats: {
          shareCount: Math.floor(Math.random() * 50) + 1,
          likeCount: Math.floor(Math.random() * 200) + 10,
          collectCount: Math.floor(Math.random() * 100) + 5,
          myLikeCount: Math.floor(Math.random() * 80) + 5,
          myCollectCount: Math.floor(Math.random() * 60) + 3
        }
      })
    }, 500)
  },

  // 加载车辆列表
  loadCarList: function () {
    // 模拟API请求
    setTimeout(() => {
      const mockCarList = [
        {
          id: 1,
          brand: '特斯拉',
          model: 'Model 3',
          year: 2022,
          color: '珍珠白',
          mileage: 15000,
          image: '/images/car1.jpg'
        },
        {
          id: 2,
          brand: '比亚迪',
          model: '汉EV',
          year: 2023,
          color: '汉宫红',
          mileage: 8000,
          image: '/images/car2.jpg'
        }
      ]
      
      this.setData({
        carList: mockCarList
      })
    }, 600)
  },

  // 加载最近活动
  loadRecentActivities: function () {
    // 模拟API请求
    setTimeout(() => {
      const mockActivities = [
        {
          id: 1,
          type: 'like',
          content: '你点赞了"周末洗车记录"',
          time: '2小时前'
        },
        {
          id: 2,
          type: 'collect',
          content: '你收藏了"新车提车攻略"',
          time: '1天前'
        },
        {
          id: 3,
          type: 'share',
          content: '你发布了新的分享',
          time: '2天前'
        }
      ]
      
      this.setData({
        recentActivities: mockActivities
      })
    }, 700)
  },

  // 登录
  onLogin: function () {
    wx.navigateTo({
      url: '/pages/login/login'
    })
  },

  // 添加车辆
  onAddCar: function () {
    wx.showModal({
      title: '添加爱车',
      content: '功能开发中，敬请期待',
      showCancel: false
    })
  },

  // 车辆点击
  onCarTap: function (e) {
    const carId = e.currentTarget.dataset.id
    console.log('点击车辆:', carId)
    
    wx.showModal({
      title: '车辆详情',
      content: '查看车辆详细信息功能开发中',
      showCancel: false
    })
  },

  // 编辑车辆
  onEditCar: function (e) {
    e.stopPropagation()
    const carId = e.currentTarget.dataset.id
    console.log('编辑车辆:', carId)
    
    wx.showModal({
      title: '编辑车辆',
      content: '编辑车辆信息功能开发中',
      showCancel: false
    })
  },

  // 菜单点击
  onMenuTap: function (e) {
    const type = e.currentTarget.dataset.type
    console.log('菜单点击:', type)
    
    switch (type) {
      case 'myShares':
        this.navigateToMyShares()
        break
      case 'myLikes':
        this.navigateToMyLikes()
        break
      case 'myCollects':
        this.navigateToMyCollects()
        break
      case 'maintenance':
        this.navigateToMaintenance()
        break
      case 'settings':
        this.navigateToSettings()
        break
      default:
        wx.showToast({
          title: '功能开发中',
          icon: 'none'
        })
    }
  },

  // 跳转到我的分享
  navigateToMyShares: function () {
    wx.navigateTo({
      url: '/pages/my-shares/my-shares'
    })
  },

  // 跳转到我的点赞
  navigateToMyLikes: function () {
    wx.navigateTo({
      url: '/pages/my-likes/my-likes'
    })
  },

  // 跳转到我的收藏
  navigateToMyCollects: function () {
    wx.navigateTo({
      url: '/pages/my-collects/my-collects'
    })
  },

  // 跳转到保养记录
  navigateToMaintenance: function () {
    wx.showModal({
      title: '保养记录',
      content: '保养记录功能开发中，敬请期待',
      showCancel: false
    })
  },

  // 跳转到设置
  navigateToSettings: function () {
    wx.showModal({
      title: '设置',
      content: '设置功能开发中，敬请期待',
      showCancel: false
    })
  },

  // 查看全部活动
  onViewAllActivities: function () {
    wx.showModal({
      title: '全部活动',
      content: '查看全部活动功能开发中',
      showCancel: false
    })
  },

  // 关于我们
  onAbout: function () {
    wx.showModal({
      title: '关于我们',
      content: '爱车分享小程序\n版本：1.0.0\n专注于汽车爱好者的分享平台',
      showCancel: false
    })
  },

  // 意见反馈
  onFeedback: function () {
    wx.showModal({
      title: '意见反馈',
      content: '感谢您的反馈，我们会持续改进产品体验',
      showCancel: false
    })
  },

  // 退出登录
  onLogout: function () {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          this.performLogout()
        }
      }
    })
  },

  // 执行退出登录
  performLogout: function () {
    // 清除本地存储
    wx.clearStorageSync()
    
    // 重置全局数据
    app.globalData.hasLogin = false
    app.globalData.userInfo = null
    app.globalData.openid = ''
    
    // 重置页面数据
    this.setData({
      userInfo: null,
      userStats: {
        shareCount: 0,
        likeCount: 0,
        collectCount: 0,
        myLikeCount: 0,
        myCollectCount: 0
      },
      carList: [],
      recentActivities: []
    })
    
    wx.showToast({
      title: '已退出登录',
      icon: 'success'
    })
  },

  // 分享配置
  onShareAppMessage: function () {
    return {
      title: '爱车分享 - 记录美好的车生活',
      path: '/pages/index/index',
      imageUrl: '/images/share-cover.jpg'
    }
  },

  onShareTimeline: function () {
    return {
      title: '爱车分享 - 记录美好的车生活',
      imageUrl: '/images/share-cover.jpg'
    }
  }
}) 