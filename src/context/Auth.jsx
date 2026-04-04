import { createContext, useContext, useEffect, useReducer, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

const AuthContext = createContext()

const initialState = { isAuth: false, user: {} }

const reducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            return { ...state, isAuth: true, user: action.payload }
        case "SET_PROFILE":
            return { ...state, isAuth: true, user: { ...state.user, ...action.payload } }
        case "LOGOUT":
            return { ...state, isAuth: false, user: {} }
        default:
            return state
    }
}

const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)
    const [isAppLoading, setIsAppLoading] = useState(true)
    const navigate = useNavigate()

    const readProfile = (token = null) => {
        const jwt = token || localStorage.getItem("jwt")
        if (!jwt) {
            setIsAppLoading(false)
            return
        }

        axios.get("http://localhost:8000/api/auth/user", { headers: { Authorization: `Bearer ${jwt}` } })
            .then(res => {
                const { status, data } = res
                if (status === 200) {
                    dispatch({ type: "SET_PROFILE", payload: data.user })
                }
            })
            .catch(error => {
                if (error.response) window.toastify(error.response.data.message, "error");
                else window.toastify("Server not responding", "error");
            })
            .finally(() => setIsAppLoading(false))
    }

    useEffect(() => { readProfile() }, [])

    const handleLogout = () => {
        localStorage.removeItem("jwt")
        dispatch({ type: "LOGOUT" })
        window.toastify("Logout successfully", "success")
        navigate("/")
    }

    return (
        <AuthContext.Provider value={{ ...state, dispatch, isAppLoading, handleLogout, readProfile }}>
            {children}
        </AuthContext.Provider>
    )
}
export default AuthProvider

export const useAuth = () => useContext(AuthContext)
