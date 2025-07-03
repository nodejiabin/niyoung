const app = getApp()

Page({
  data: {
    imageList: [],
    content: '',
    carBrands: [
      '奔驰', '宝马', '奥迪', '大众', '丰田', '本田', '日产', '马自达',
      '特斯拉', '比亚迪', '蔚来', '理想', '小鹏', '长城', '吉利', '长安',
      '红旗', '广汽', '上汽', '东风', '一汽', '北汽', '其他'
    ],
    brandIndex: null,
    carModel: '',
    carYear: '',
    carColor: '',
    location: '',
    allowComment: true,
    allowShare: true,
    submitting: false
  },

  onLoad: function (options) {
    console.log('分享页面加载')
    this.checkLoginStatus()
  },

  onShow: function () {
    console.log('分享页面显示')
  },

  // 检查登录状态
  checkLoginStatus: function () {
    if (!app.globalData.hasLogin) {
      wx.showModal({
        title: '提示',
        content: '请先登录后再发布分享',
        confirmText: '去登录',
        success: (res) => {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/login/login'
            })
          } else {
            wx.switchTab({
              url: '/pages/index/index'
            })
          }
        }
      })
    }
  },

  // 选择图片
  onChooseImage: function () {
    const remainingCount = 9 - this.data.imageList.length
    
    wx.chooseImage({
      count: remainingCount,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePaths = res.tempFilePaths
        const newImageList = [...this.data.imageList, ...tempFilePaths]
        
        this.setData({
          imageList: newImageList
        })
        
        // 压缩图片
        this.compressImages(tempFilePaths)
      },
      fail: (err) => {
        console.error('选择图片失败:', err)
        wx.showToast({
          title: '选择图片失败',
          icon: 'none'
        })
      }
    })
  },

  // 压缩图片
  compressImages: function (imagePaths) {
    imagePaths.forEach((path, index) => {
      wx.compressImage({
        src: path,
        quality: 80,
        success: (res) => {
          const imageList = this.data.imageList
          const targetIndex = imageList.indexOf(path)
          if (targetIndex !== -1) {
            imageList[targetIndex] = res.tempFilePath
            this.setData({
              imageList: imageList
            })
          }
        },
        fail: (err) => {
          console.error('压缩图片失败:', err)
        }
      })
    })
  },

  // 预览图片
  onPreviewImage: function (e) {
    const index = e.currentTarget.dataset.index
    const current = this.data.imageList[index]
    
    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  },

  // 删除图片
  onDeleteImage: function (e) {
    const index = e.currentTarget.dataset.index
    const imageList = this.data.imageList
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这张图片吗？',
      success: (res) => {
        if (res.confirm) {
          imageList.splice(index, 1)
          this.setData({
            imageList: imageList
          })
        }
      }
    })
  },

  // 内容输入
  onContentInput: function (e) {
    this.setData({
      content: e.detail.value
    })
  },

  // 品牌选择
  onBrandChange: function (e) {
    this.setData({
      brandIndex: e.detail.value
    })
  },

  // 车型输入
  onCarModelInput: function (e) {
    this.setData({
      carModel: e.detail.value
    })
  },

  // 年份选择
  onYearChange: function (e) {
    this.setData({
      carYear: e.detail.value
    })
  },

  // 颜色输入
  onCarColorInput: function (e) {
    this.setData({
      carColor: e.detail.value
    })
  },

  // 选择位置
  onChooseLocation: function () {
    wx.chooseLocation({
      success: (res) => {
        this.setData({
          location: res.name || res.address
        })
      },
      fail: (err) => {
        console.error('选择位置失败:', err)
        if (err.errMsg.includes('auth deny')) {
          wx.showModal({
            title: '权限提示',
            content: '需要获取您的位置权限，请在设置中开启',
            confirmText: '去设置',
            success: (res) => {
              if (res.confirm) {
                wx.openSetting()
              }
            }
          })
        }
      }
    })
  },

  // 评论权限切换
  onCommentChange: function (e) {
    this.setData({
      allowComment: e.detail.value
    })
  },

  // 分享权限切换
  onShareChange: function (e) {
    this.setData({
      allowShare: e.detail.value
    })
  },

  // 表单提交
  onSubmit: function (e) {
    console.log('表单提交:', e.detail)
    
    // 验证表单
    if (!this.validateForm()) {
      return
    }
    
    this.setData({
      submitting: true
    })
    
    // 上传图片
    this.uploadImages()
      .then((imageUrls) => {
        // 提交分享数据
        return this.submitShare(imageUrls)
      })
      .then((result) => {
        wx.showToast({
          title: '发布成功',
          icon: 'success'
        })
        
        // 延迟跳转到首页
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/index/index'
          })
        }, 1500)
      })
      .catch((error) => {
        console.error('发布失败:', error)
        wx.showToast({
          title: '发布失败，请重试',
          icon: 'none'
        })
      })
      .finally(() => {
        this.setData({
          submitting: false
        })
      })
  },

  // 表单重置
  onReset: function () {
    wx.showModal({
      title: '确认重置',
      content: '确定要清空所有内容吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            imageList: [],
            content: '',
            brandIndex: null,
            carModel: '',
            carYear: '',
            carColor: '',
            location: '',
            allowComment: true,
            allowShare: true
          })
        }
      }
    })
  },

  // 验证表单
  validateForm: function () {
    const { imageList, content } = this.data
    
    if (imageList.length === 0 && !content.trim()) {
      wx.showToast({
        title: '请添加图片或输入内容',
        icon: 'none'
      })
      return false
    }
    
    if (content.trim().length < 10) {
      wx.showToast({
        title: '分享内容至少需要10个字符',
        icon: 'none'
      })
      return false
    }
    
    return true
  },

  // 上传图片
  uploadImages: function () {
    return new Promise((resolve, reject) => {
      const { imageList } = this.data
      
      if (imageList.length === 0) {
        resolve([])
        return
      }
      
      const uploadPromises = imageList.map((imagePath) => {
        return new Promise((resolve, reject) => {
          wx.uploadFile({
            url: app.globalData.apiUrl + '/api/upload',
            filePath: imagePath,
            name: 'file',
            header: {
              'Authorization': 'Bearer ' + wx.getStorageSync('token')
            },
            success: (res) => {
              try {
                const data = JSON.parse(res.data)
                if (data.success) {
                  resolve(data.url)
                } else {
                  reject(new Error(data.message || '上传失败'))
                }
              } catch (error) {
                reject(error)
              }
            },
            fail: reject
          })
        })
      })
      
      Promise.all(uploadPromises)
        .then(resolve)
        .catch(reject)
    })
  },

  // 提交分享数据
  submitShare: function (imageUrls) {
    return new Promise((resolve, reject) => {
      const { content, brandIndex, carBrands, carModel, carYear, carColor, location, allowComment, allowShare } = this.data
      
      const shareData = {
        content: content.trim(),
        images: imageUrls,
        carInfo: {
          brand: brandIndex !== null ? carBrands[brandIndex] : '',
          model: carModel,
          year: carYear,
          color: carColor
        },
        location: location,
        allowComment: allowComment,
        allowShare: allowShare
      }
      
      wx.request({
        url: app.globalData.apiUrl + '/api/share',
        method: 'POST',
        data: shareData,
        header: {
          'Authorization': 'Bearer ' + wx.getStorageSync('token'),
          'Content-Type': 'application/json'
        },
        success: (res) => {
          if (res.data.success) {
            resolve(res.data)
          } else {
            reject(new Error(res.data.message || '发布失败'))
          }
        },
        fail: reject
      })
    })
  },

  // 分享配置
  onShareAppMessage: function () {
    return {
      title: '我在分享我的爱车，快来看看吧！',
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