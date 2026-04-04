import { Routes, Route } from "react-router-dom"
import Login from "./Login/index"
import Register from "./Register/index"
import NotFound from "@/components/NotFound"
import ForgotPassword from "./ForgotPassword/index"

const Auth = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

export default Auth