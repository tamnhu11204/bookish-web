import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import * as CategoryService from '../../services/CategoryService';
import * as HomepageConfigService from '../../services/HomepageConfigService';
import './CategoryDropdown.css';

const CategoryDropdown = () => {
    const navigate = useNavigate();

    const { data: categoryTree = [], isLoading } = useQuery({
        queryKey: ['categoryTreeForDropdown'],
        queryFn: () => CategoryService.getTreeCategory(),
        select: (data) => data.data || [],
        staleTime: 1000 * 60 * 10,
    });

    const { data: config } =
        useQuery({
            queryKey: ['homePageConfig'],
            queryFn: async () => (await HomepageConfigService.getConfig()).data
        });

    const handleCategoryClick = (categoryId) => {
        navigate('/category', { state: { selectedCategory: categoryId } });
    };

    const columns = categoryTree.slice(0, 6);
    return (
        <div className="category-dropdown-menu">
            <div className="dropdown-grid">
                {isLoading ? (
                    <div>Đang tải...</div>
                ) : (
                    columns.map(parentCategory => (
                        <div key={parentCategory._id} className="dropdown-column">
                            <h5
                                className="column-title"
                                onClick={() => handleCategoryClick(parentCategory._id)}
                            >
                                {parentCategory.name}
                            </h5>
                            <ul className="column-links">
                                {parentCategory.children?.slice(0, 8).map(childCategory => (
                                    <li key={childCategory._id}>
                                        <a onClick={() => handleCategoryClick(childCategory._id)}>
                                            {childCategory.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))
                )}
            </div>
            <div className="dropdown-promo">
                <img src={config?.bannerPromotion} alt="Khuyến mãi" />
            </div>
        </div>
    );
};

export default CategoryDropdown;