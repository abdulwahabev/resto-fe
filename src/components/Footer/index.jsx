import { Link } from "react-router-dom"

const Footer = () => {

    const year = new Date().getFullYear()

    return (
        <footer className="bg-light py-3">
            <div className="container">
                <div className="row">
                    <div className="col-12 text-center">
                        <p className="mb-0 fw-semibold">
                            © {year} My Store |{" "}<Link to="/" className="text-decoration-none text-success fw-bold"> Restaurant</Link>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer