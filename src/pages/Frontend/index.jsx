import { Routes, Route } from "react-router-dom"
import Home from "./Home"
import Products from "./Products"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

const Frontend = () => {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
            </Routes>
            <Footer />
        </>
    )
}

export default Frontend