import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-gray-100 shadow-md rounded-lg hover:shadow-lg cursor-pointer transition duration-300">
      <Link to={`/products/${product._id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="rounded-lg w-full h-200px object-cover"
        />
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-1">{product.name}</h2>
          <p className="text-lg font-semibold text-red-500">Rs {product.price}</p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
