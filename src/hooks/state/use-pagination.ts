import { computed, ref } from 'vue'

interface PaginationOptions {
  defaultPage?: number
  defaultPageSize?: number
  defaultTotal?: number
}

export default function usePagination(options: PaginationOptions = {}) {
  const { defaultPage = 1, defaultPageSize = 10, defaultTotal = 0 } = options

  const page = ref(defaultPage)
  const pageSize = ref(defaultPageSize)
  const total = ref(defaultTotal)

  const pageCount = computed(() => Math.ceil(total.value / pageSize.value))

  const offset = computed(() => (page.value - 1) * pageSize.value)

  function setPage(newPage: number) {
    page.value = newPage
  }

  function setPageSize(newPageSize: number) {
    pageSize.value = newPageSize
    page.value = 1
  }

  function setTotal(newTotal: number) {
    total.value = newTotal
  }

  function reset() {
    page.value = defaultPage
    pageSize.value = defaultPageSize
    total.value = defaultTotal
  }

  function next() {
    if (page.value < pageCount.value) {
      page.value++
    }
  }

  function prev() {
    if (page.value > 1) {
      page.value--
    }
  }

  return {
    page,
    pageSize,
    total,
    pageCount,
    offset,
    setPage,
    setPageSize,
    setTotal,
    reset,
    next,
    prev,
  }
}
