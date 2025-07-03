const app = getApp()

Page({
  data: {
    searchValue: '',
    currentFilter: 'latest',
    banners: [],
    categories: [
      { id: 1, name: '轿车', icon: '🚗' },
      { id: 2, name: 'SUV', icon: '🚙' },
      { id: 3, name: '跑车', icon: '🏎️' },
      { id: 4, name: '卡车', icon: '🚚' },
      { id: 5, name: '摩托车', icon: '🏍️' },
      { id: 6, name: '电动车', icon: '⚡' }
    ],
    contentList: [],
    loading: false,
    hasMore: true,
    page: 1,
    pageSize: 10
  },

  onLoad: function (options) {
    console.log('首页加载')
    this.initData()
  },

  onShow: function () {
    console.log('首页显示')
    // 每次显示时刷新数据
    this.refreshData()
  },

  onPullDownRefresh: function () {
    console.log('下拉刷新')
    this.refreshData()
  },

  onReachBottom: function () {
    console.log('上拉加载')
    this.loadMore()
  },

  // 初始化数据
  initData: function () {
    this.loadBanners()
    this.loadContent()
  },

  // 刷新数据
  refreshData: function () {
    this.setData({
      page: 1,
      hasMore: true,
      contentList: []
    })
    this.loadContent()
    wx.stopPullDownRefresh()
  },

  // 加载轮播图
  loadBanners: function () {
    // 模拟轮播图数据
    const banners = [
      { id: 1, image: '/images/banner1.jpg' },
      { id: 2, image: '/images/banner2.jpg' },
      { id: 3, image: '/images/banner3.jpg' }
    ]
    this.setData({ banners })
  },

  // 加载内容
  loadContent: function () {
    if (this.data.loading) return

    this.setData({ loading: true })

    // 模拟API请求
    setTimeout(() => {
      const mockData = this.generateMockData()
      const newList = this.data.page === 1 ? mockData : [...this.data.contentList, ...mockData]
      
      this.setData({
        contentList: newList,
        loading: false,
        hasMore: mockData.length === this.data.pageSize
      })
    }, 1000)
  },

  // 生成模拟数据
  generateMockData: function () {
    const mockData = []
    const brands = ['奔驰', '宝马', '奥迪', '特斯拉', '比亚迪', '蔚来', '理想', '小鹏']
    const models = ['C级', 'E级', 'S级', 'Model 3', 'Model Y', 'ES6', 'ET7', 'P7']
    const contents = [
      '今天带着我的爱车去兜风，心情超级好！',
      '新车提车第一天，分享给大家看看',
      '周末洗车，越看越喜欢这个颜色',
      '改装完成，效果非常满意',
      '自驾游路上，风景如画',
      '保养归来，车子又焕然一新了'
    ]

    for (let i = 0; i < this.data.pageSize; i++) {
      const id = Date.now() + i
      const brand = brands[Math.floor(Math.random() * brands.length)]
      const model = models[Math.floor(Math.random() * models.length)]
      const content = contents[Math.floor(Math.random() * contents.length)]
      
      mockData.push({
        id: id,
        userName: `用户${Math.floor(Math.random() * 1000)}`,
        userAvatar: '/images/avatar.png',
        content: content,
        images: this.generateMockImages(),
        carInfo: {
          brand: brand,
          model: model,
          year: 2020 + Math.floor(Math.random() * 4)
        },
        likeCount: Math.floor(Math.random() * 100),
        collectCount: Math.floor(Math.random() * 50),
        isLiked: Math.random() > 0.5,
        isCollected: Math.random() > 0.7,
        createTime: this.formatTime(new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000))
      })
    }

    return mockData
  },

  // 生成模拟图片
  generateMockImages: function () {
    const imageCount = Math.floor(Math.random() * 4) + 1
    const images = []
    for (let i = 0; i < imageCount; i++) {
      images.push(`/images/car${i + 1}.jpg`)
    }
    return images
  },

  // 格式化时间
  formatTime: function (date) {
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 60) {
      return `${minutes}分钟前`
    } else if (hours < 24) {
      return `${hours}小时前`
    } else if (days < 7) {
      return `${days}天前`
    } else {
      return date.toLocaleDateString()
    }
  },

  // 搜索输入
  onSearchInput: function (e) {
    this.setData({
      searchValue: e.detail.value
    })
    // 实际项目中可以添加防抖功能
    this.searchContent(e.detail.value)
  },

  // 搜索内容
  searchContent: function (keyword) {
    if (!keyword.trim()) {
      this.refreshData()
      return
    }
    
    // 模拟搜索
    const filteredList = this.data.contentList.filter(item => 
      item.content.includes(keyword) || 
      item.carInfo.brand.includes(keyword) || 
      item.carInfo.model.includes(keyword)
    )
    
    this.setData({
      contentList: filteredList
    })
  },

  // 分类点击
  onCategoryTap: function (e) {
    const category = e.currentTarget.dataset.category
    console.log('点击分类:', category)
    
    wx.showToast({
      title: `查看${category}分享`,
      icon: 'none'
    })
  },

  // 筛选点击
  onFilterTap: function (e) {
    const filter = e.currentTarget.dataset.filter
    this.setData({
      currentFilter: filter
    })
    
    // 重新加载数据
    this.refreshData()
  },

  // 内容点击
  onContentTap: function (e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${id}`
    })
  },

  // 图片点击
  onImageTap: function (e) {
    const urls = e.currentTarget.dataset.urls
    const current = e.currentTarget.dataset.current
    
    wx.previewImage({
      current: current,
      urls: urls
    })
  },

  // 点赞
  onLikeTap: function (e) {
    e.stopPropagation()
    const id = e.currentTarget.dataset.id
    const liked = e.currentTarget.dataset.liked
    
    // 检查登录状态
    if (!app.globalData.hasLogin) {
      this.showLoginModal()
      return
    }
    
    const contentList = this.data.contentList
    const index = contentList.findIndex(item => item.id === id)
    
    if (index !== -1) {
      contentList[index].isLiked = !liked
      contentList[index].likeCount += liked ? -1 : 1
      
      this.setData({
        contentList: contentList
      })
      
      wx.showToast({
        title: liked ? '取消点赞' : '点赞成功',
        icon: 'success'
      })
    }
  },

  // 收藏
  onCollectTap: function (e) {
    e.stopPropagation()
    const id = e.currentTarget.dataset.id
    const collected = e.currentTarget.dataset.collected
    
    // 检查登录状态
    if (!app.globalData.hasLogin) {
      this.showLoginModal()
      return
    }
    
    const contentList = this.data.contentList
    const index = contentList.findIndex(item => item.id === id)
    
    if (index !== -1) {
      contentList[index].isCollected = !collected
      contentList[index].collectCount += collected ? -1 : 1
      
      this.setData({
        contentList: contentList
      })
      
      wx.showToast({
        title: collected ? '取消收藏' : '收藏成功',
        icon: 'success'
      })
    }
  },

  // 分享
  onShareTap: function (e) {
    e.stopPropagation()
    const id = e.currentTarget.dataset.id
    
    wx.showActionSheet({
      itemList: ['分享给朋友', '分享到朋友圈', '复制链接'],
      success: (res) => {
        if (res.tapIndex === 0) {
          // 分享给朋友
          wx.showToast({
            title: '分享给朋友',
            icon: 'none'
          })
        } else if (res.tapIndex === 1) {
          // 分享到朋友圈
          wx.showToast({
            title: '分享到朋友圈',
            icon: 'none'
          })
        } else if (res.tapIndex === 2) {
          // 复制链接
          wx.setClipboardData({
            data: `https://your-domain.com/share/${id}`,
            success: () => {
              wx.showToast({
                title: '链接已复制',
                icon: 'success'
              })
            }
          })
        }
      }
    })
  },

  // 加载更多
  loadMore: function () {
    if (this.data.loading || !this.data.hasMore) return
    
    this.setData({
      page: this.data.page + 1
    })
    
    this.loadContent()
  },

  // 显示登录弹窗
  showLoginModal: function () {
    wx.showModal({
      title: '提示',
      content: '请先登录后再进行操作',
      confirmText: '去登录',
      success: (res) => {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/login/login'
          })
        }
      }
    })
  },

  // 分享配置
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '爱车分享 - 分享你的爱车故事',
      path: '/pages/index/index',
      imageUrl: '/images/share-cover.jpg'
    }
  },

  onShareTimeline: function () {
    return {
      title: '爱车分享 - 分享你的爱车故事',
      imageUrl: '/images/share-cover.jpg'
    }
  }
}) 