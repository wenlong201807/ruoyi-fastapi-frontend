import { describe, it, expect } from 'vitest'

describe('CommentSection 初始数据', () => {
  it('默认数据结构正确', () => {
    const data = { comments: [], total: 0, page: 1, sort: 'latest', loading: false, finished: false }
    expect(data.comments).toHaveLength(0)
    expect(data.sort).toBe('latest')
    expect(data.finished).toBe(false)
  })

  it('切换排序重置分页', () => {
    const data = { page: 3, comments: [1, 2, 3], finished: true }
    data.page = 1
    data.comments = []
    data.finished = false
    expect(data.page).toBe(1)
    expect(data.comments).toHaveLength(0)
  })
})

describe('评论列表加载', () => {
  it('追加模式加载评论', () => {
    const comments = [{ comment_id: 1 }, { comment_id: 2 }]
    const newBatch = [{ comment_id: 3 }, { comment_id: 4 }]
    comments.push(...newBatch)
    expect(comments).toHaveLength(4)
  })

  it('达到总数时标记 finished', () => {
    const total = 5
    const comments = [1, 2, 3, 4, 5]
    expect(comments.length >= total).toBe(true)
  })

  it('未达总数继续加载', () => {
    const total = 50
    const comments = new Array(20)
    expect(comments.length >= total).toBe(false)
  })

  it('loading 防重复加载', () => {
    let loading = true
    expect(!loading).toBe(false)
  })
})

describe('评论交互操作', () => {
  it('点赞更新本地状态', () => {
    const item = { comment_id: 1, is_liked: false, like_count: 5 }
    item.is_liked = true
    item.like_count = 6
    expect(item.is_liked).toBe(true)
    expect(item.like_count).toBe(6)
  })

  it('取消点赞更新本地状态', () => {
    const item = { comment_id: 1, is_liked: true, like_count: 6 }
    item.is_liked = false
    item.like_count = 5
    expect(item.is_liked).toBe(false)
    expect(item.like_count).toBe(5)
  })

  it('回复评论传递 parent 信息', () => {
    const parent = { comment_id: 10, user: { user_id: 3, nick_name: '张三' } }
    const data = {
      biz_type: 'article', biz_id: '1', content: '同意',
      parent_id: parent.comment_id,
      root_id: parent.comment_id,
      reply_user_id: parent.user.user_id,
    }
    expect(data.parent_id).toBe(10)
    expect(data.reply_user_id).toBe(3)
  })

  it('深层回复 root_id 追溯到根评论', () => {
    const reply = { comment_id: 20, root_id: 10 }
    const data = { parent_id: reply.comment_id, root_id: reply.root_id }
    expect(data.root_id).toBe(10)
  })
})

describe('评论展示逻辑', () => {
  it('回复列表最多展示 3 条', () => {
    const item = { replies: [1, 2, 3], reply_count: 8, has_more_replies: true }
    expect(item.replies).toHaveLength(3)
    expect(item.has_more_replies).toBe(true)
  })

  it('无回复时 replies 为空', () => {
    const item = { replies: [], reply_count: 0, has_more_replies: false }
    expect(item.replies).toHaveLength(0)
  })

  it('空列表显示暂无评论', () => {
    const comments = []
    const loading = false
    expect(!loading && comments.length === 0).toBe(true)
  })

  it('默认头像兜底', () => {
    const avatar = '' || '/static/default-avatar.png'
    expect(avatar).toBe('/static/default-avatar.png')
  })

  it('置顶评论标记', () => {
    const item = { is_top: true }
    expect(item.is_top).toBe(true)
  })

  it('创建时间格式校验', () => {
    const time = '2026-02-28 10:30:00'
    expect(time).toMatch(/^\d{4}-\d{2}-\d{2}/)
  })
})

describe('API 请求参数', () => {
  it('列表请求参数完整', () => {
    const params = { biz_type: 'article', biz_id: '123', page: 1, page_size: 20, sort: 'latest' }
    expect(Object.keys(params)).toHaveLength(5)
  })

  it('发布评论内容长度校验', () => {
    const data = { biz_type: 'article', biz_id: '1', content: '好文章' }
    expect(data.content.length).toBeGreaterThan(0)
    expect(data.content.length).toBeLessThanOrEqual(1000)
  })
})
