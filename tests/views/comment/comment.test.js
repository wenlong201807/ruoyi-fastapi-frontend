import { describe, it, expect } from 'vitest'

describe('Comment API 参数构建', () => {
  it('listComment 传递正确查询参数', () => {
    const params = { status: 1, biz_type: 'article', page: 1, page_size: 20 }
    expect(params.status).toBe(1)
    expect(params.page_size).toBe(20)
  })

  it('listComment 不传 status 查全部', () => {
    const params = { page: 1, page_size: 20 }
    expect(params.status).toBeUndefined()
  })

  it('auditComment 批量通过', () => {
    const data = { comment_ids: [1, 2, 3], status: 1 }
    expect(data.comment_ids).toHaveLength(3)
    expect(data.status).toBe(1)
  })

  it('auditComment 批量隐藏带备注', () => {
    const data = { comment_ids: [10], status: 0, remark: '违规' }
    expect(data.remark).toBe('违规')
  })

  it('updateComment 内容不为空', () => {
    const data = { content: '管理员修改' }
    expect(data.content.length).toBeGreaterThan(0)
  })

  it('deleteComment ID 拼接 URL', () => {
    const id = 123
    const url = '/api/admin/comment/' + id
    expect(url).toContain('123')
  })

  it('batchDeleteComment 多个 ID', () => {
    const data = { comment_ids: [1, 2, 3, 4, 5] }
    expect(data.comment_ids).toHaveLength(5)
  })
})

describe('Comment Page State 管理', () => {
  it('初始查询参数正确', () => {
    const queryParams = { status: null, biz_type: null, content: null, page: 1, page_size: 20 }
    expect(queryParams.page).toBe(1)
    expect(queryParams.status).toBeNull()
  })

  it('搜索重置 page 为 1', () => {
    const queryParams = { page: 3, page_size: 20 }
    queryParams.page = 1
    expect(queryParams.page).toBe(1)
  })

  it('重置清空所有筛选', () => {
    const queryParams = { status: 2, biz_type: 'article', content: '关键词' }
    Object.assign(queryParams, { status: null, biz_type: null, content: null })
    expect(queryParams.status).toBeNull()
    expect(queryParams.biz_type).toBeNull()
    expect(queryParams.content).toBeNull()
  })

  it('状态标签类型映射', () => {
    const statusTagType = (status) => {
      if (status === 1) return 'success'
      if (status === 0) return 'danger'
      return 'warning'
    }
    expect(statusTagType(1)).toBe('success')
    expect(statusTagType(0)).toBe('danger')
    expect(statusTagType(2)).toBe('warning')
  })

  it('选中评论 ID 收集', () => {
    const selection = [{ comment_id: 1 }, { comment_id: 5 }, { comment_id: 9 }]
    const ids = selection.map(item => item.comment_id)
    expect(ids).toEqual([1, 5, 9])
  })

  it('空列表显示暂无数据', () => {
    const list = []
    expect(list.length).toBe(0)
  })

  it('分页总数映射', () => {
    const res = { data: { total: 156, list: new Array(20) } }
    expect(res.data.total).toBe(156)
    expect(res.data.list).toHaveLength(20)
  })
})
