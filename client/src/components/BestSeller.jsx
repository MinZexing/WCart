import { useAppContext } from "../context/AppContext";
import ProductCard from "./ProductCard";

function BestSeller() {
  const { products } = useAppContext();

  return (
    <div className="mt-16">
      <p className="text-2xl md:text-3xl font-medium">Best Sellers</p>
      <div>
        <ProductCard product={products[0]} />
      </div>
    </div>
  );
}

export default BestSeller;
