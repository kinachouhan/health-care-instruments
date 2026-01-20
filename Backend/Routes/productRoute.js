import express from "express"
import { addProduct, deleteProduct, getAllProducts } from "../Controllers/productController.js";
import { upload} from "../Middleware/multerMiddleware.js";


const router = express.Router()

router.post("/add", upload.array("images", 5), addProduct);

router.get("/", getAllProducts);
router.delete("/delete/:id", deleteProduct);


export default router