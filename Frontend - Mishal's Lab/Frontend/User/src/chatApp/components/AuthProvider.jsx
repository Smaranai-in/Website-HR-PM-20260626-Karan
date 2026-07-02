import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'

const AuthContext = createContext({})
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [onlineUsers, setOnlineUsers] = useState(new Set())

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) { setOnlineUsers(new Set()); return }
    const channel = supabase.channel('online-users', { config: { presence: { key: user.id } } })
    channel
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState()
        setOnlineUsers(new Set(Object.keys(newState)))
      })
      .on('presence', { event: 'join' }, ({ key }) => {
        setOnlineUsers(prev => new Set([...prev, key]))
      })
      .on('presence', { event: 'leave' }, ({ key }) => {
        setOnlineUsers(prev => { const s = new Set(prev); s.delete(key); return s })
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ online_at: new Date().toISOString(), user_id: user.id })
        }
      })
    return () => channel.unsubscribe()
  }, [user])

  return (
    <AuthContext.Provider value={{ session, user, onlineUsers, signOut: () => supabase.auth.signOut() }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
