// pages/login/login.js
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 用户信息
        userInfo: {
            nickName: '',
            avatarUrl: '/images/default-avatar.png'
        },
        hasUserInfo: false,
        phoneNumber: '',
        hasPhoneNumber: false,
        showUserProfile: false,
        
        // 登录状态
        logging: false,
        agreedToTerms: false,
        loginStep: 'agreement', // agreement, wechat, phone, complete
        
        // 弹窗相关
        showModal: false,
        modalTitle: '',
        modalContent: '',
        
        // 来源页面
        fromPage: '',
        
        // 登录凭证
        loginCode: '',
        sessionKey: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log('登录页面加载', options)
        
        // 记录来源页面
        if (options.from) {
            this.setData({
                fromPage: options.from
            })
        }
        
        // 检查是否已经登录
        this.checkLoginStatus()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        console.log('登录页面显示')
        // 每次显示时检查登录状态
        this.checkLoginStatus()
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {
        return {
            title: '爱车分享 - 分享你的爱车故事',
            path: '/pages/index/index'
        }
    },

    // 检查登录状态
    checkLoginStatus: function () {
        const userInfo = wx.getStorageSync('userInfo')
        const phoneNumber = wx.getStorageSync('phoneNumber')
        const agreedToTerms = wx.getStorageSync('agreedToTerms')
        const hasLogin = wx.getStorageSync('hasLogin')
        
        console.log('=== 检查登录状态 ===')
        console.log('用户信息:', userInfo)
        console.log('手机号:', phoneNumber)
        console.log('协议状态:', agreedToTerms)
        console.log('登录状态:', hasLogin)
        
        // 恢复用户信息
        if (userInfo) {
            this.setData({
                userInfo: userInfo,
                hasUserInfo: true
            })
        }
        
        // 恢复手机号
        if (phoneNumber) {
            this.setData({
                phoneNumber: phoneNumber,
                hasPhoneNumber: true
            })
        }
        
        // 恢复协议状态
        if (agreedToTerms) {
            this.setData({
                agreedToTerms: agreedToTerms
            })
        }
        
        // 如果已经完全登录，直接跳转
        if (hasLogin && userInfo) {
            console.log('用户已登录，准备跳转')
            app.globalData.hasLogin = true
            app.globalData.userInfo = userInfo
            if (phoneNumber) {
                app.globalData.phoneNumber = phoneNumber
            }
            this.navigateBack()
        }
    },

    // 协议复选框变化
    onAgreementChange: function (e) {
        console.log('=== 协议状态变化 ===')
        console.log('事件详情:', e)
        
        const originalValue = e.detail.value
        const agreedToTerms = originalValue.length > 0
        
        console.log('原始值:', originalValue)
        console.log('计算结果:', agreedToTerms)
        
        this.setData({
            agreedToTerms: agreedToTerms
        })
        
        // 保存到本地存储
        wx.setStorageSync('agreedToTerms', agreedToTerms)
        
        console.log('当前页面状态:', this.data)
        
        // 延迟验证状态更新
        setTimeout(() => {
            console.log('延迟验证 - 页面状态:', this.data.agreedToTerms)
            console.log('延迟验证 - 本地存储:', wx.getStorageSync('agreedToTerms'))
        }, 100)
        
        if (agreedToTerms && this.data.hasUserInfo) {
            console.log('条件满足，可以显示完成登录按钮')
        }
    },

    // 微信登录 - 获取用户信息
    onWechatLogin: function () {
        console.log('=== 开始微信登录 ===')
        
        if (!this.data.agreedToTerms) {
            wx.showToast({
                title: '请先同意用户协议',
                icon: 'none'
            })
            return
        }
        
        this.setData({
            logging: true
        })
        
        // 显示加载状态
        wx.showLoading({
            title: '登录中...',
            mask: true
        })
        
        // 第一步：获取微信登录凭证
        wx.login({
            success: (loginRes) => {
                console.log('wx.login 成功:', loginRes)
                if (loginRes.code) {
                    this.setData({
                        loginCode: loginRes.code
                    })
                    // 第二步：获取用户信息
                    this.getUserInfo()
                } else {
                    console.error('wx.login 失败: 无法获取code')
                    this.handleLoginError('登录失败，请重试')
                }
            },
            fail: (err) => {
                console.error('wx.login 失败:', err)
                this.handleLoginError('登录失败，请重试')
            }
        })
    },

    // 获取用户信息
    getUserInfo: function () {
        console.log('=== 获取用户信息 ===')
        
        // 尝试使用 getUserProfile（推荐方式）
        wx.getUserProfile({
            desc: '用于完善会员资料',
            success: (res) => {
                console.log('getUserProfile 成功:', res)
                this.handleUserInfoSuccess(res.userInfo)
            },
            fail: (err) => {
                console.log('getUserProfile 失败:', err)
                // 如果用户拒绝授权，显示头像昵称填写功能
                this.showUserProfileForm()
            }
        })
    },

    // 处理用户信息获取成功
    handleUserInfoSuccess: function (userInfo) {
        console.log('=== 用户信息获取成功 ===', userInfo)
        
        wx.hideLoading()
        
        this.setData({
            userInfo: userInfo,
            hasUserInfo: true,
            logging: false,
            loginStep: 'complete'
        })
        
        // 保存用户信息到本地
        wx.setStorageSync('userInfo', userInfo)
        
        wx.showToast({
            title: '获取用户信息成功',
            icon: 'success'
        })
        
        // 自动进行登录
        setTimeout(() => {
            this.completeLogin()
        }, 1500)
    },

    // 显示头像昵称填写表单
    showUserProfileForm: function () {
        console.log('=== 显示用户信息填写表单 ===')
        
        wx.hideLoading()
        
        this.setData({
            showUserProfile: true,
            logging: false,
            loginStep: 'profile'
        })
        
        wx.showToast({
            title: '请完善个人信息',
            icon: 'none'
        })
    },

    // 选择头像
    onChooseAvatar: function (e) {
        console.log('=== 选择头像 ===', e)
        const { avatarUrl } = e.detail
        
        this.setData({
            'userInfo.avatarUrl': avatarUrl
        })
        
        wx.showToast({
            title: '头像设置成功',
            icon: 'success'
        })
    },

    // 输入昵称
    onNicknameInput: function (e) {
        const nickName = e.detail.value
        this.setData({
            'userInfo.nickName': nickName
        })
    },

    // 完成用户信息填写
    onCompleteUserProfile: function () {
        console.log('=== 完成用户信息填写 ===')
        
        const { nickName, avatarUrl } = this.data.userInfo
        
        if (!nickName.trim()) {
            wx.showToast({
                title: '请输入昵称',
                icon: 'none'
            })
            return
        }
        
        if (!this.data.agreedToTerms) {
            wx.showToast({
                title: '请先同意协议',
                icon: 'none'
            })
            return
        }
        
        // 保存用户信息
        const userInfo = {
            nickName: nickName.trim(),
            avatarUrl: avatarUrl
        }
        
        this.setData({
            userInfo: userInfo,
            hasUserInfo: true,
            showUserProfile: false,
            logging: true
        })
        
        wx.setStorageSync('userInfo', userInfo)
        
        wx.showToast({
            title: '信息完善成功',
            icon: 'success'
        })
        
        // 延迟执行登录
        setTimeout(() => {
            this.completeLogin()
        }, 1000)
    },

    // 获取手机号
    onGetPhoneNumber: function (e) {
        console.log('=== 获取手机号 ===', e)
        
        if (e.detail.errMsg === 'getPhoneNumber:ok') {
            // 这里应该将加密数据发送到后端解密
            // 现在先模拟处理
            this.handlePhoneNumberSuccess(e.detail)
        } else if (e.detail.errMsg === 'getPhoneNumber:fail user deny') {
            // 用户拒绝授权
            wx.showToast({
                title: '您可以跳过手机号授权',
                icon: 'none'
            })
        } else {
            wx.showToast({
                title: '获取手机号失败',
                icon: 'none'
            })
        }
    },

    // 处理手机号获取成功
    handlePhoneNumberSuccess: function (phoneDetail) {
        console.log('=== 手机号获取成功 ===', phoneDetail)
        
        // 这里应该发送到后端解密
        // 模拟解密结果
        const mockPhoneNumber = '138****8888'
        
        this.setData({
            phoneNumber: mockPhoneNumber,
            hasPhoneNumber: true
        })
        
        // 保存手机号信息到本地
        wx.setStorageSync('phoneNumber', mockPhoneNumber)
        wx.setStorageSync('encryptedData', phoneDetail.encryptedData)
        wx.setStorageSync('iv', phoneDetail.iv)
        
        wx.showToast({
            title: '获取手机号成功',
            icon: 'success'
        })
    },

    // 跳过手机号授权
    onSkipPhoneNumber: function () {
        console.log('=== 跳过手机号授权 ===')
        
        wx.showToast({
            title: '已跳过手机号授权',
            icon: 'none'
        })
    },

    // 完成登录
    completeLogin: function () {
        console.log('=== 完成登录流程 ===')
        
        if (!this.data.hasUserInfo) {
            wx.showToast({
                title: '请先完成微信登录',
                icon: 'none'
            })
            return
        }
        
        if (!this.data.agreedToTerms) {
            wx.showToast({
                title: '请先同意用户协议',
                icon: 'none'
            })
            return
        }
        
        wx.showLoading({
            title: '登录中...',
            mask: true
        })
        
        // 模拟登录API请求
        this.mockLoginAPI()
    },

    // 模拟登录API
    mockLoginAPI: function () {
        console.log('=== 模拟登录API ===')
        
        // 模拟网络请求延迟
        setTimeout(() => {
            const loginData = {
                code: this.data.loginCode,
                userInfo: this.data.userInfo,
                phoneNumber: this.data.phoneNumber,
                timestamp: Date.now()
            }
            
            console.log('登录数据:', loginData)
            
            // 模拟成功响应
            const response = {
                success: true,
                data: {
                    token: 'mock_token_' + Date.now(),
                    userInfo: this.data.userInfo,
                    phoneNumber: this.data.phoneNumber,
                    userId: 'user_' + Date.now()
                }
            }
            
            console.log('登录响应:', response)
            
            if (response.success) {
                // 保存登录状态
                wx.setStorageSync('hasLogin', true)
                wx.setStorageSync('token', response.data.token)
                wx.setStorageSync('userId', response.data.userId)
                
                // 更新全局状态
                app.globalData.hasLogin = true
                app.globalData.userInfo = response.data.userInfo
                app.globalData.token = response.data.token
                app.globalData.userId = response.data.userId
                
                if (response.data.phoneNumber) {
                    app.globalData.phoneNumber = response.data.phoneNumber
                }
                
                wx.hideLoading()
                
                wx.showToast({
                    title: '登录成功',
                    icon: 'success'
                })
                
                // 延迟跳转
                setTimeout(() => {
                    this.navigateBack()
                }, 1500)
                
            } else {
                this.handleLoginError('登录失败，请重试')
            }
        }, 2000)
    },

    // 处理登录错误
    handleLoginError: function (message) {
        console.error('=== 登录错误 ===', message)
        
        wx.hideLoading()
        
        this.setData({
            logging: false
        })
        
        wx.showToast({
            title: message,
            icon: 'none'
        })
    },

    // 返回上一页
    navigateBack: function () {
        console.log('=== 导航返回 ===')
        
        const pages = getCurrentPages()
        if (pages.length > 1) {
            wx.navigateBack()
        } else {
            wx.switchTab({
                url: '/pages/index/index'
            })
        }
    },

    // 查看用户协议
    onViewAgreement: function () {
        wx.showModal({
            title: '用户协议',
            content: '这里是用户协议内容...\n\n1. 用户权利和义务\n2. 隐私保护政策\n3. 免责声明\n4. 其他条款',
            showCancel: false,
            confirmText: '我知道了'
        })
    },

    // 查看隐私政策
    onViewPrivacy: function () {
        wx.showModal({
            title: '隐私政策',
            content: '这里是隐私政策内容...\n\n1. 信息收集\n2. 信息使用\n3. 信息保护\n4. 用户权利',
            showCancel: false,
            confirmText: '我知道了'
        })
    },

    // 调试功能：检查协议状态
    debugAgreementStatus: function () {
        console.log('=== 调试协议状态 ===')
        console.log('当前协议状态:', this.data.agreedToTerms)
        console.log('本地存储状态:', wx.getStorageSync('agreedToTerms'))
        
        // 检查复选框元素状态
        const query = wx.createSelectorQuery()
        query.select('.agreement-checkbox').boundingClientRect()
        query.exec((res) => {
            console.log('复选框元素状态:', res)
        })
        
        // 检查页面状态与本地存储是否一致
        const storageAgreedToTerms = wx.getStorageSync('agreedToTerms')
        if (this.data.agreedToTerms !== storageAgreedToTerms) {
            console.log('检测到状态不一致，正在同步...')
            this.setData({
                agreedToTerms: storageAgreedToTerms
            })
        }
    },

    // 强制设置协议状态
    forceSetAgreement: function () {
        console.log('=== 强制设置协议状态 ===')
        
        this.setData({
            agreedToTerms: true
        })
        
        wx.setStorageSync('agreedToTerms', true)
        
        wx.showToast({
            title: '协议状态已设置',
            icon: 'success'
        })
        
        console.log('强制设置后的状态:', this.data.agreedToTerms)
    }
})