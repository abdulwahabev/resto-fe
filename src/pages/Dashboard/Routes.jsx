import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import Products from './Products'
import Orders from './Orders'
import Users from './Users'
import ProtectRoute from '@/components/ProtectedRoute'

const Index = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products/*" element={<ProtectRoute Component={Products} allowedroles={['superAdmin']} />} />
            <Route path="/orders/*" element={<ProtectRoute Component={Orders} allowedroles={['superAdmin', 'customer']} />} />
            <Route path="/users/*" element={<ProtectRoute Component={Users} allowedroles={['superAdmin']} />} />
        </Routes>
    )
}

export default Index