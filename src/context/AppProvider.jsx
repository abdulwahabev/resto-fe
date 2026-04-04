import AuthProvider from "./Auth"

const AppProvider = ({ children }) => {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    )
}

export default AppProvider