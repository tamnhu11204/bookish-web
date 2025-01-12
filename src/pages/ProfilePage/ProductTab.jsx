import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as FavoriteProductService from '../../services/FavoriteProductService';
import * as ProductService from '../../services/ProductService'; // Assuming this includes `getDetailProduct`
import CardProductComponent from '../../components/CardProductComponent/CardProductComponent';

const ProductTab = () => {
    const user = useSelector((state) => state.user);
    const navigate = useNavigate();

    const [productFavorite, setProductFavorite] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFavoriteProducts = async () => {
        if (user?.id) {
            try {
                // Get favorite products by user
                const favoriteData = await FavoriteProductService.getAllFavoriteProductByUser(user.id);
                console.log('favoriteData', favoriteData);

                // Check if the favoriteData contains products
                if (favoriteData?.data && Array.isArray(favoriteData.data)) {
                    const productDetailsPromises = favoriteData.data.map(async (favoriteItem) => {
                        // For each favoriteItem, get the product details using the product ID
                        const product = await ProductService.getDetailProduct(favoriteItem.product);
                        return product; // Return the detailed product
                    });
                    const productDetails = await Promise.all(productDetailsPromises);
                    setProductFavorite(productDetails); // Set the detailed products to state
                } else {
                    console.error('Product data is not available or not in expected format');
                }
            } catch (error) {
                console.error('Error fetching favorite products:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchFavoriteProducts();
    }, [user?.id]);

    const handleOnClickProduct = (productId) => {
        navigate(`/product/${productId}`);
    };

    if (loading) {
        return <div>Loading...</div>; // You can add a spinner or loading animation
    }
    console.log('productFavorite', productFavorite);

    return (
        <div style={{ padding: '0 20px' }}>
            <div className="title-section">
                <h3 className="text mb-0">SẢN PHẨM YÊU THÍCH</h3>
            </div>

            <div className="content-section" style={{ marginTop: '30px' }}>
                <div className="row align-items-center mb-3">
                    {productFavorite.map((product) => (
                        <CardProductComponent
                            key={product.data._id}
                            img={product.data.img[0]}
                            proName={product.data.name}
                            currentPrice={(product.data.price * (100 - product.data.discount) / 100).toLocaleString()}
                            sold={product.data.sold}
                            star={product.data.star}
                            feedbackCount={product.data.feedbackCount}
                            onClick={() => handleOnClickProduct(product.data._id)}
                            view={product.data.view}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductTab;
