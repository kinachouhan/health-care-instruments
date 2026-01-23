import express from "express"
import { addProduct, deleteProduct, getAllProducts, getProduct , updateProduct } from "../Controllers/productController.js";
import { upload} from "../Middleware/multerMiddleware.js";


const router = express.Router()

router.post("/add", upload.array("images", 4), addProduct);

router.get("/", getAllProducts);
router.delete("/delete/:id", deleteProduct);

router.get("/:id", getProduct);



router.put(
  "/update/:id",
  upload.array("images", 4),
  updateProduct
);


export default router