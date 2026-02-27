<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="全部" clearable style="width: 120px">
          <el-option label="正常" :value="1" />
          <el-option label="隐藏" :value="0" />
          <el-option label="待审核" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="业务类型" prop="biz_type">
        <el-select v-model="queryParams.biz_type" placeholder="全部" clearable style="width: 120px">
          <el-option label="文章" value="article" />
          <el-option label="商品" value="product" />
          <el-option label="帖子" value="post" />
        </el-select>
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <el-input v-model="queryParams.content" placeholder="搜索评论" clearable style="width: 200px" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">搜索</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="success" :disabled="!selectedIds.length" @click="handleBatchAudit(1)">批量通过</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" :disabled="!selectedIds.length" @click="handleBatchAudit(0)">批量隐藏</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" :disabled="!selectedIds.length" @click="handleBatchDelete">批量删除</el-button>
      </el-col>
    </el-row>

    <el-table :data="commentList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50" />
      <el-table-column label="ID" prop="comment_id" width="80" />
      <el-table-column label="评论内容" prop="content" show-overflow-tooltip min-width="300" />
      <el-table-column label="状态" width="90">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : row.status === 0 ? 'danger' : 'warning'">
            {{ statusMap[row.status] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="点赞" prop="like_count" width="70" />
      <el-table-column label="回复" prop="reply_count" width="70" />
      <el-table-column label="创建时间" prop="create_time" width="170" />
      <el-table-column label="操作" width="200" fixed="right">
        <template #default="{ row }">
          <el-button link type="success" v-if="row.status !== 1" @click="handleAudit(row, 1)">通过</el-button>
          <el-button link type="warning" v-if="row.status === 1" @click="handleAudit(row, 0)">隐藏</el-button>
          <el-button link type="primary" @click="handleEdit(row)">编辑</el-button>
          <el-button link type="danger" @click="handleDelete(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" v-model:page="queryParams.page"
      v-model:limit="queryParams.page_size" @pagination="getList" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { listComment, auditComment, updateComment, deleteComment } from '@/api/comment'
import { ElMessage, ElMessageBox } from 'element-plus'

const statusMap = { 0: '隐藏', 1: '正常', 2: '待审核' }
const showSearch = ref(true)
const commentList = ref([])
const total = ref(0)
const selectedIds = ref([])
const queryParams = ref({ status: null, biz_type: null, content: null, page: 1, page_size: 20 })

async function getList() {
  const res = await listComment(queryParams.value)
  commentList.value = res.data?.list || []
  total.value = res.data?.total || 0
}

function handleQuery() { queryParams.value.page = 1; getList() }
function resetQuery() {
  queryParams.value = { status: null, biz_type: null, content: null, page: 1, page_size: 20 }
  getList()
}
function handleSelectionChange(selection) {
  selectedIds.value = selection.map(item => item.comment_id)
}

async function handleAudit(row, status) {
  await auditComment({ comment_ids: [row.comment_id], status })
  ElMessage.success('操作成功')
  getList()
}

async function handleBatchAudit(status) {
  await auditComment({ comment_ids: selectedIds.value, status })
  ElMessage.success('批量操作成功')
  getList()
}

async function handleEdit(row) {
  ElMessageBox.prompt('编辑评论内容', '编辑', { inputValue: row.content }).then(async ({ value }) => {
    await updateComment(row.comment_id, { content: value })
    ElMessage.success('修改成功')
    getList()
  })
}

async function handleDelete(row) {
  await ElMessageBox.confirm('确定删除该评论？', '警告', { type: 'warning' })
  await deleteComment(row.comment_id)
  ElMessage.success('删除成功')
  getList()
}

async function handleBatchDelete() {
  await ElMessageBox.confirm(`确定删除选中的 ${selectedIds.value.length} 条评论？`, '警告', { type: 'warning' })
  for (const id of selectedIds.value) { await deleteComment(id) }
  ElMessage.success('批量删除成功')
  getList()
}

onMounted(() => getList())
</script>
