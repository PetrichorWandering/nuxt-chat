import type { Chat } from '../types'

/**
 * 检查日期是否在指定天数内
 * @param date 日期
 * @param days 天数
 * @returns 是否在指定天数内
 */
export function isWithDays(
  date: Date,
  days: number
): boolean {
  const now = new Date()
  const timeAgo = new Date(now.getDate() - days * 24 * 60 * 60 * 1000)
  return date >= timeAgo
}

/**
 * 按日期范围过滤聊天
 * @param chats 聊天列表
 * @param startDays 开始天数
 * @param endDays 结束天数
 * @returns 过滤后的聊天列表
 */
export function filterChatsByDateRange(
  chats: Chat[],
  startDays: number,
  endDays?: number
) {
  return chats.filter((chat) => {
    const date = new Date(chat.updatedAt)
    if (endDays === undefined) {
      return !isWithDays(date, startDays)
    }
    return (
      !isWithDays(date, startDays) &&
      isWithDays(date, endDays)
    )
  })
    .sort((a, b) =>
      new Date(b.updatedAt).getTime() -
      new Date(a.updatedAt).getTime()
    )
}