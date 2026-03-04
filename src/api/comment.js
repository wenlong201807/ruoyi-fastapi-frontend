import request from '@/utils/request'

export function listComment(query) {
  return request({ url: '/api/admin/comment/list', method: 'get', params: query })
}

export function getComment(commentId) {
  return request({ url: '/api/admin/comment/' + commentId, method: 'get' })
}

export function auditComment(data) {
  return request({ url: '/api/admin/comment/audit', method: 'put', data })
}

export function updateComment(commentId, data) {
  return request({ url: '/api/admin/comment/' + commentId, method: 'put', data })
}

export function deleteComment(commentId) {
  return request({ url: '/api/admin/comment/' + commentId, method: 'delete' })
}

export function batchDeleteComment(ids) {
  return request({ url: '/api/admin/comment/batch', method: 'delete', data: { comment_ids: ids } })
}

export function getCommentStats() {
  return request({ url: '/api/admin/comment/stats', method: 'get' })
}
