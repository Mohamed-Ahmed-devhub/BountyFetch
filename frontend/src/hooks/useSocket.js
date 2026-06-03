// useSocket.js — WebSocket hook (Socket.io client)
import { useEffect, useRef, useCallback, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from '../context/AuthContext.jsx'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001'

export function useSocket(onNewTask) {
  const { session }        = useAuth()
  const socketRef          = useRef(null)
  const [isConnected, setIsConnected] = useState(false)
  const [onlineCount, setOnlineCount] = useState(0)

  useEffect(() => {
    const token = session?.access_token
    socketRef.current = io(SOCKET_URL, {
      auth:       token ? { token } : {},
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
    })

    const s = socketRef.current
    s.on('connect',      () => setIsConnected(true))
    s.on('disconnect',   () => setIsConnected(false))
    s.on('online_count', ({ count }) => setOnlineCount(count))
    s.on('new_task',     (task) => { if (onNewTask) onNewTask(task) })

    return () => { s.disconnect() }
  }, [session?.access_token])

  // Update new task handler without reconnecting
  useEffect(() => {
    if (!socketRef.current) return
    socketRef.current.off('new_task')
    socketRef.current.on('new_task', (task) => { if (onNewTask) onNewTask(task) })
  }, [onNewTask])

  const joinRoom = useCallback((room) => {
    socketRef.current?.emit('join_room', room)
  }, [])

  const sendMessage = useCallback((room, content) => {
    socketRef.current?.emit('send_message', { room, content })
  }, [])

  return { isConnected, onlineCount, joinRoom, sendMessage, socket: socketRef.current }
}
