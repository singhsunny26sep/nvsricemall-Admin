import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import ProductForm from './ProductForm';
import Table from '../../components/models/Table';
import { categoriesAPI, subcategoriesAPI, productsAPI } from '../../components/api/api';

const ProductManagement = () => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  console.log(products,"QW@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [mode, setMode] = useState('view');
  const [editingProduct, setEditingProduct] = useState(null);

  // Fetch all data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch categories
      const categoriesResponse = await categoriesAPI.getCategories();
      console.log('Categories API Response:', categoriesResponse);
      console.log('Categories Data:', categoriesResponse.data);
      
      // Check if data is nested
      const categoriesData = categoriesResponse.data?.data || categoriesResponse.data || [];
      console.log('Processed Categories:', categoriesData);
      setCategories(categoriesData);

      // Fetch subcategories
      const subcategoriesResponse = await subcategoriesAPI.getSubcategories();
      console.log('Subcategories API Response:', subcategoriesResponse);
      console.log('Subcategories Data:', subcategoriesResponse.data);
      
      // Check if data is nested
      const subcategoriesData = subcategoriesResponse.data?.data || subcategoriesResponse.data || [];
      console.log('Processed Subcategories:', subcategoriesData);
      setSubcategories(subcategoriesData);

      // Fetch products
      const productsResponse = await productsAPI.getProducts();
      console.log('Products API Response:', productsResponse);
      console.log('Products Data:', productsResponse.data);
      
      // Check if data is nested: response.data.data.data is the array
      let productsData = productsResponse.data?.data?.data || productsResponse.data?.data || productsResponse.data || [];
      
      // Ensure productsData is an array before mapping
      if (Array.isArray(productsData)) {
        // Map products to include categoryId and subcategoryId if they're not present
        productsData = productsData.map(product => {
          // If categoryId/subcategoryId not present, try to extract from category/subcategory objects
          if (!product.categoryId && product.category) {
            product.categoryId = product.category._id || product.category.id;
          }
          if (!product.subCategoryId && product.subcategory) {
            product.subCategoryId = product.subcategory._id || product.subcategory.id;
          }
          return product;
        });
      } else {
        productsData = [];
      }
      
      console.log('Processed Products:', productsData);
      setProducts(productsData);

    } catch (err) {
      console.error('Error fetching data:', err);
      console.error('Error details:', err.response?.data);
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: '_id',
      header: 'ID',
      className: 'whitespace-nowrap font-medium text-green-600'
    },
    {
      key: 'image',
      header: 'Image',
      className: 'whitespace-nowrap',
      render: (image, row) => (
        <img
          src={image || "/api/placeholder/40/40"}
          alt={row.name}
          className="rounded-full w-10 h-10 object-cover"
          onError={(e) => {
            e.target.src = '/api/placeholder/40/40';
          }}
        />
      )
    },
    {
      key: 'name',
      header: 'Product Name',
      className: 'whitespace-nowrap font-semibold'
    },
    {
      key: 'brand',
      header: 'Brand',
      className: 'whitespace-nowrap text-gray-700'
    },
    {
      key: 'weightInKg',
      header: 'Weight (kg)',
      className: 'whitespace-nowrap text-gray-600'
    },
    {
      key: 'categoryId',
      header: 'Category ID',
      className: 'whitespace-nowrap text-blue-600'
    },
    {
      key: 'subCategoryId',
      header: 'SubCategory ID',
      className: 'whitespace-nowrap text-purple-600'
    },
    {
      key: 'generalPrice',
      header: 'Price',
      className: 'whitespace-nowrap font-semibold text-green-700'
    },
    {
      key: 'stockQuantity',
      header: 'Stock',
      className: 'whitespace-nowrap'
    }
  ];

  const actions = [
    {
      icon: <Edit size={16} />,
      onClick: handleEdit,
      className: 'text-green-600 hover:text-green-900 hover:bg-green-100',
      title: 'Edit Product'
    },
    {
      icon: <Trash2 size={16} />,
      onClick: handleDelete,
      className: 'text-red-600 hover:text-red-900 hover:bg-red-100',
      title: 'Delete Product'
    }
  ];

  async function handleAdd(formData) {
    try {
      setLoading(true);
      const response = await productsAPI.createProduct(formData);
      console.log('Create Product Response:', response.data);
      
      // Refresh products list
      await fetchAllData();
      setMode('view');
    } catch (err) {
      console.error('Error creating product:', err);
      setError(err.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(product) {
    setEditingProduct(product);
    setMode('edit');
  }

  async function handleUpdate(formData, productId) {
    try {
      setLoading(true);
      const response = await productsAPI.updateProduct(productId, formData);
      console.log('Update Product Response:', response.data);
      
      // Refresh products list
      await fetchAllData();
      setMode('view');
      setEditingProduct(null);
    } catch (err) {
      console.error('Error updating product:', err);
      setError(err.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(product) {
    if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        setLoading(true);
        await productsAPI.deleteProduct(product.id);
        console.log('Product deleted successfully');
        
        // Refresh products list
        await fetchAllData();
      } catch (err) {
        console.error('Error deleting product:', err);
        setError(err.message || 'Failed to delete product');
      } finally {
        setLoading(false);
      }
    }
  }

  function handleCancel() {
    setMode('view');
    setEditingProduct(null);
  }

  // Calculate stats - with null check
  const totalValue = Array.isArray(products) ? products.reduce((sum, prod) => sum + ((prod.generalPrice || 0) * (prod.stockQuantity || 0)), 0) : 0;
  const lowStockCount = Array.isArray(products) ? products.filter(prod => (prod.stockQuantity || 0) <= 10 && (prod.stockQuantity || 0) > 0).length : 0;
  const outOfStockCount = Array.isArray(products) ? products.filter(prod => (prod.stockQuantity || 0) === 0).length : 0;

  // Loading state
  if (loading && (!Array.isArray(products) || products.length === 0)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <Package className="text-green-600" size={36} />
            🍚 Rice Deal - Product Management
          </h1>
          <p className="text-gray-600">
            Manage your rice products inventory with ease
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
            <button
              onClick={fetchAllData}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Add Form Modal */}
        {mode === 'add' && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="w-full max-w-2xl">
              <ProductForm
                onSave={handleAdd}
                onCancel={handleCancel}
                title="Add New Rice Product"
              />
            </div>
          </div>
        )}

        {/* Edit Form Modal */}
        {mode === 'edit' && editingProduct && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="w-full max-w-2xl">
              <ProductForm
                product={editingProduct}
                onSave={handleUpdate}
                onCancel={handleCancel}
              />
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-800">{Array.isArray(products) ? products.length : 0}</p>
              </div>
              <Package className="text-green-600" size={32} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inventory Value</p>
                <p className="text-2xl font-bold text-green-600">₹{totalValue.toFixed(2)}</p>
              </div>
              <span className="text-3xl">💰</span>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-600">{lowStockCount}</p>
              </div>
              <span className="text-3xl">⚠️</span>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">{outOfStockCount}</p>
              </div>
              <span className="text-3xl">❌</span>
            </div>
          </div>
        </div>

        {/* Add Button */}
        {mode === 'view' && (
          <div className="mb-6">
            <button
              onClick={() => setMode('add')}
              disabled={loading}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={18} />
              Add New Rice Product
            </button>
          </div>
        )}

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              Rice Products ({Array.isArray(products) ? products.length : 0})
            </h2>
          </div>
          {loading && Array.isArray(products) && products.length > 0 ? (
            <div className="p-8 text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-2"></div>
              <p>Updating...</p>
            </div>
          ) : (
            <Table
              columns={columns}
              data={products}
              actions={actions}
              emptyMessage="No rice products found. Add your first product to get started!"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;