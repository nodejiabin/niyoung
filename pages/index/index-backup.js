const app = getApp()
const placeholder = require('../../utils/placeholder')

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
    // 生成轮播图数据，使用占位图片
    const banners = [
      { 
        id: 1, 
        image: placeholder.getBannerPlaceholder(1),
        title: '爱车分享社区' 
      },
      { 
        id: 2, 
        image: placeholder.getBannerPlaceholder(2),
        title: '发现更多精彩' 
      },
      { 
        id: 3, 
        image: placeholder.getBannerPlaceholder(3),
        title: '分享你的爱车' 
      }
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
    
    // 预设的真实车辆数据
    const carData = [
      {
        brand: '奔驰',
        model: 'C 260L',
        year: 2023,
        content: '刚提的新车，奔驰C260L运动版，星辉银色真的太美了！内饰做工精致，驾驶感受非常棒，动力充沛又省油。终于实现了奔驰梦！',
        images: ['/images/benz-c260-1.jpg', '/images/benz-c260-2.jpg', '/images/benz-c260-3.jpg'],
        userName: '车友小王',
        likeCount: 128,
        collectCount: 45
      },
      {
        brand: '宝马',
        model: 'X3 xDrive25i',
        year: 2022,
        content: '宝马X3提车半年了，越开越喜欢！xDrive四驱系统在雨天表现出色，空间够大，后排坐着很舒服。周末经常开着它去郊外，完美的城市SUV！',
        images: ['/images/bmw-x3-1.jpg', '/images/bmw-x3-2.jpg'],
        userName: '阿明',
        likeCount: 89,
        collectCount: 32
      },
      {
        brand: '特斯拉',
        model: 'Model Y',
        year: 2023,
        content: '入手Model Y三个月了，电动车的驾驶体验真的不一样！加速平顺安静，自动驾驶功能很实用，充电也很方便。白色车身配黑色内饰，简约大气！',
        images: ['/images/tesla-model-y-1.jpg', '/images/tesla-model-y-2.jpg', '/images/tesla-model-y-3.jpg', '/images/tesla-model-y-4.jpg'],
        userName: '电车达人',
        likeCount: 156,
        collectCount: 67
      },
      {
        brand: '比亚迪',
        model: '汉EV',
        year: 2023,
        content: '比亚迪汉EV，国产电动车的骄傲！Dragon Face设计语言太帅了，续航605公里完全够用，刀片电池安全性高。支持国产，为中国制造点赞！',
        images: ['/images/byd-han-1.jpg', '/images/byd-han-2.jpg'],
        userName: '国产车粉',
        likeCount: 203,
        collectCount: 78
      },
      {
        brand: '奥迪',
        model: 'A4L 45 TFSI',
        year: 2022,
        content: '奥迪A4L运动版，开了一年多了，2.0T发动机动力强劲，quattro四驱系统操控精准。内饰科技感十足，虚拟座舱很酷。德系车的品质值得信赖！',
        images: ['/images/audi-a4l-1.jpg', '/images/audi-a4l-2.jpg', '/images/audi-a4l-3.jpg'],
        userName: '德系车主',
        likeCount: 94,
        collectCount: 28
      },
      {
        brand: '蔚来',
        model: 'ES6',
        year: 2023,
        content: '蔚来ES6，新势力的代表作！外观设计前卫，内饰豪华舒适，NOMI语音助手很有趣。换电模式解决了续航焦虑，服务体验也很棒。未来出行就是这样！',
        images: ['/images/nio-es6-1.jpg', '/images/nio-es6-2.jpg'],
        userName: '蔚来车主',
        likeCount: 167,
        collectCount: 89
      },
      {
        brand: '理想',
        model: 'L9',
        year: 2023,
        content: '理想L9，六座大空间SUV！增程式动力系统完美解决里程焦虑，第二排独立座椅太舒服了。全家出游的最佳选择，孩子们都很喜欢车上的娱乐系统。',
        images: ['/images/li-l9-1.jpg', '/images/li-l9-2.jpg', '/images/li-l9-3.jpg'],
        userName: '奶爸车主',
        likeCount: 145,
        collectCount: 56
      },
      {
        brand: '小鹏',
        model: 'P7',
        year: 2022,
        content: '小鹏P7，智能电动轿跑！NGP自动导航辅助驾驶太神奇了，长途驾驶轻松很多。外观流线型设计很运动，内饰简约科技。续航706公里，出行无忧！',
        images: ['/images/xpeng-p7-1.jpg', '/images/xpeng-p7-2.jpg'],
        userName: '科技控',
        likeCount: 112,
        collectCount: 43
      },
      {
        brand: '保时捷',
        model: 'Cayenne',
        year: 2022,
        content: '保时捷Cayenne，豪华SUV的标杆！3.0T V6发动机声浪迷人，操控性能出色，内饰用料奢华。虽然价格不菲，但驾驶乐趣无价。人生第一台保时捷！',
        images: ['/images/porsche-cayenne-1.jpg', '/images/porsche-cayenne-2.jpg', '/images/porsche-cayenne-3.jpg'],
        userName: '保时捷车主',
        likeCount: 289,
        collectCount: 134
      },
      {
        brand: '丰田',
        model: '凯美瑞',
        year: 2023,
        content: '丰田凯美瑞2.5L混动版，省油王者！百公里油耗只要4.1L，动力平顺安静。空间宽敞，后排乘坐舒适。丰田的可靠性和保值率都很高，家用首选！',
        images: ['/images/toyota-camry-1.jpg', '/images/toyota-camry-2.jpg'],
        userName: '务实车主',
        likeCount: 76,
        collectCount: 25
      }
    ]
    
    const additionalContents = [
      '今天带着我的爱车去兜风，心情超级好！沿途风景如画，驾驶乐趣满满。',
      '新车提车第一天，分享给大家看看！从选车到提车，整个过程都很顺利。',
      '周末洗车，越看越喜欢这个颜色！在阳光下闪闪发光，太美了。',
      '改装完成，效果非常满意！轮毂、包围、尾翼都换了，运动感十足。',
      '自驾游路上，风景如画！开着爱车穿越山川湖海，这就是自由的感觉。',
      '保养归来，车子又焕然一新了！定期保养很重要，爱车需要细心呵护。'
    ]

    // 先添加预设的车辆数据
    for (let i = 0; i < Math.min(carData.length, this.data.pageSize); i++) {
      const car = carData[i]
      const randomTime = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      
      // 生成占位图片，如果本地图片不存在则使用占位图片
      const carImages = car.images.map((imgPath, index) => {
        return placeholder.getCarPlaceholder(car.brand, car.model, index + 1)
      })
      
      mockData.push({
        id: Date.now() + i,
        userName: car.userName,
        userAvatar: placeholder.getAvatarPlaceholder(car.userName),
        content: car.content,
        images: carImages,
        carInfo: {
          brand: car.brand,
          model: car.model,
          year: car.year
        },
        likeCount: car.likeCount,
        collectCount: car.collectCount,
        isLiked: Math.random() > 0.5,
        isCollected: Math.random() > 0.7,
        createTime: this.formatTime(randomTime)
      })
    }

    // 如果需要更多数据，添加随机生成的内容
    const remainingCount = this.data.pageSize - mockData.length
    if (remainingCount > 0) {
      const brands = ['本田', '日产', '大众', '现代', '起亚', '马自达', '雷克萨斯', '沃尔沃']
      const models = ['雅阁', '天籁', '帕萨特', '途胜', 'K5', 'CX-5', 'ES200', 'XC60']
      
      for (let i = 0; i < remainingCount; i++) {
        const id = Date.now() + mockData.length + i
        const brand = brands[Math.floor(Math.random() * brands.length)]
        const model = models[Math.floor(Math.random() * models.length)]
        const content = additionalContents[Math.floor(Math.random() * additionalContents.length)]
        const userName = `车友${Math.floor(Math.random() * 1000)}`
        
        mockData.push({
          id: id,
          userName: userName,
          userAvatar: placeholder.getAvatarPlaceholder(userName),
          content: content,
          images: this.generateMockImagesWithPlaceholder(brand, model),
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
    }

    return mockData
  },

  // 生成模拟图片（使用占位图片）
  generateMockImagesWithPlaceholder: function (brand, model) {
    const imageCount = Math.floor(Math.random() * 4) + 1
    const images = []
    for (let i = 0; i < imageCount; i++) {
      images.push(placeholder.getCarPlaceholder(brand, model, i + 1))
    }
    return images
  },

  // 生成模拟图片（保留原函数用于兼容）
  generateMockImages: function () {
    const imageCount = Math.floor(Math.random() * 4) + 1
    const images = []
    for (let i = 0; i < imageCount; i++) {
      images.push(placeholder.getCarPlaceholder('通用', '汽车', i + 1))
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