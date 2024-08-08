import React, { createContext, useContext, useEffect, useState } from "react"

import { getCurrentUser } from "../lib/appwrite"

const GlobalContext = createContext()
// custom hook to use the GlobalContext --> call useContext hook and specify the context you want to use
export const useGlobalContext = () => useContext(GlobalContext)

const GlobalProvider = ({ children }) => {
  // const [isLogged, setIsLogged] = useState(false)
  const [isLogged, setIsLogged] = useState(true)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          setIsLogged(true)
          setUser(res)
        } else {
          setIsLogged(false)
          setUser(null)
        }
      })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        loading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export default GlobalProvider
