import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMainCategories, fetchCategories, fetchSubCategories } from '../redux/slice/category.slice';

export default function DebugCategories() {
    const dispatch = useDispatch();
    const { mainCategories, categories, subCategories, loading, error } = useSelector((state) => state.category);

    useEffect(() => {
        dispatch(fetchMainCategories());
        dispatch(fetchCategories());
        dispatch(fetchSubCategories());
    }, [dispatch]);

    return (
        <div className="p-8 bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Category Debug Info</h1>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Loading: {loading ? 'Yes' : 'No'}</h2>
                {error && <p className="text-red-500">Error: {error}</p>}
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Main Categories ({mainCategories?.length || 0})</h2>
                <pre className="bg-white p-4 rounded overflow-auto max-h-60">
                    {JSON.stringify(mainCategories, null, 2)}
                </pre>
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Categories ({categories?.length || 0})</h2>
                <pre className="bg-white p-4 rounded overflow-auto max-h-60">
                    {JSON.stringify(categories, null, 2)}
                </pre>
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">SubCategories ({subCategories?.length || 0})</h2>
                <pre className="bg-white p-4 rounded overflow-auto max-h-60">
                    {JSON.stringify(subCategories, null, 2)}
                </pre>
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Relationship Test</h2>
                {mainCategories?.map(mainCat => {
                    const relatedCategories = categories.filter(cat => {
                        const catMainId = typeof cat.mainCategoryId === 'object' ? cat.mainCategoryId._id : cat.mainCategoryId;
                        return catMainId === mainCat._id;
                    });

                    return (
                        <div key={mainCat._id} className="bg-white p-4 rounded mb-4">
                            <h3 className="font-bold">{mainCat.mainCategoryName} (ID: {mainCat._id})</h3>
                            <p className="text-sm text-gray-600">Found {relatedCategories.length} categories</p>
                            {relatedCategories.map(cat => {
                                const relatedSubCats = subCategories.filter(sub => {
                                    const subCatId = typeof sub.categoryId === 'object' ? sub.categoryId._id : sub.categoryId;
                                    return subCatId === cat._id;
                                });
                                return (
                                    <div key={cat._id} className="ml-4 mt-2">
                                        <p className="font-semibold">{cat.categoryName} (ID: {cat._id})</p>
                                        <p className="text-sm text-gray-600">Found {relatedSubCats.length} subcategories</p>
                                        <ul className="ml-4 list-disc">
                                            {relatedSubCats.map(sub => (
                                                <li key={sub._id} className="text-sm">{sub.subCategoryName}</li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
