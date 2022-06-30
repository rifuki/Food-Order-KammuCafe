import { pageNotFoundImage } from "../assets/images";

const NotFoundPage = () => {
    return (
        <div className="bg-dark w-100" style={{ height: "100vh" }}>
            <img src={pageNotFoundImage} style={{ height: "100%", width: "100%", objectFit: "cover" }} alt="404notfound" />
        </div>
    )
}

export default NotFoundPage;