import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    brand: { type: String, trim: true }, 
    productGroupId: { type: String},
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    totalStock: { type: Number, required: true, min: 0 },
    availableStock: { type: Number, required: true, min: 0 },
    outOfStock: { type: Boolean, default: false },
    images: [{ type: String, required: true }],
    price: {
      original: { type: Number, required: true },
      selling: { type: Number, required: true },
    },
  },
  { timestamps: true }
);


productSchema.pre("save", function () {
  this.outOfStock = this.availableStock === 0;
});

export const Product = mongoose.model("Product", productSchema);
