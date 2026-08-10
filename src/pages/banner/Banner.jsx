import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Image, X } from 'lucide-react';
import Table from '../../components/models/Table';
import { bannersAPI } from '../../components/api/api';

// BannerForm Component
const BannerForm = ({ banner, onSave, onCancel, title = "Edit Banner" }) => {
  const [formData, setFormData] = useState({
    name: banner?.name || '',
    description: banner?.description || '',
    imageUrl: banner?.imageUrl || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (banner) {
      onSave({ ...banner, ...formData });
    } else {
      onSave(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Banner Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter banner name"
          />
        </div>

        {/* Description Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Enter banner description"
          />
        </div>

        {/* Image URL Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image URL *
          </label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="https://example.com/image.jpg"
          />
          {formData.imageUrl && (
            <div className="mt-3">
              <img
                src={formData.imageUrl}
                alt="Preview"
                className="w-full h-40 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = '/api/placeholder/400/160';
                }}
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium transition-colors"
          >
            {banner ? 'Update Banner' : 'Add Banner'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};



// Main Banner Component
const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [mode, setMode] = useState('view');
  const [editingBanner, setEditingBanner] = useState(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await bannersAPI.getBanners();
      if (response.data && response.data.success) {
        setBanners(response.data.data || []);
      } else if (response.data?.data) {
        setBanners(response.data.data);
      } else if (Array.isArray(response.data)) {
        setBanners(response.data);
      } else {
        setBanners([]);
      }
    } catch (err) {
      console.error('Error fetching banners:', err);
      setError(null);
      // Fallback to static data if API not available
      setBanners([
        { 
          _id: 1, 
          name: 'Premium Basmati Rice Collection', 
          description: 'Discover our finest selection of aged basmati rice',
          imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'
        },
        { 
          _id: 2, 
          name: 'Organic Rice Varieties', 
          description: 'Farm fresh organic rice for healthy living',
          imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'
        },
        { 
          _id: 3, 
          name: 'Special Festive Offers', 
          description: 'Limited time deals on bulk orders',
          imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'
        }
      ]);
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
      key: 'imageUrl',
      header: 'Image',
      className: 'whitespace-nowrap',
      render: (imageUrl, banner) => (
        <img
          src={imageUrl || "/api/placeholder/40/40"}
          alt={banner.name}
          className="rounded w-16 h-10 object-cover"
          onError={(e) => {
            e.target.src = '/api/placeholder/40/40';
          }}
        />
      )
    },
    {
      key: 'name',
      header: 'Name',
      className: 'whitespace-nowrap font-semibold'
    },
    {
      key: 'description',
      header: 'Description',
      className: 'text-gray-600 max-w-xs truncate'
    }
  ];

  const actions = [
    {
      icon: <Edit size={16} />,
      onClick: handleEdit,
      className: 'text-green-600 hover:text-green-900 hover:bg-green-100',
      title: 'Edit Banner'
    },
    {
      icon: <Trash2 size={16} />,
      onClick: handleDelete,
      className: 'text-red-600 hover:text-red-900 hover:bg-red-100',
      title: 'Delete Banner'
    }
  ];

  async function handleAdd(bannerData) {
    try {
      setLoading(true);
      const response = await bannersAPI.createBanner(bannerData);
      if (response.data && response.data.success) {
        setBanners(prev => [...prev, response.data.data]);
      } else {
        setBanners(prev => [...prev, response.data]);
      }
      setMode('view');
    } catch (err) {
      console.error('Error creating banner:', err);
      setError('Failed to create banner. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(banner) {
    setEditingBanner(banner);
    setMode('edit');
  }

  async function handleUpdate(bannerData) {
    try {
      setLoading(true);
      const response = await bannersAPI.updateBanner(editingBanner._id || editingBanner.id, bannerData);
      if (response.data && response.data.success) {
        setBanners(prev => prev.map(b => 
          (b._id || b.id) === (editingBanner._id || editingBanner.id) ? response.data.data : b
        ));
      } else {
        setBanners(prev => prev.map(b => 
          (b._id || b.id) === (editingBanner._id || editingBanner.id) ? { ...editingBanner, ...bannerData } : b
        ));
      }
      setMode('view');
      setEditingBanner(null);
    } catch (err) {
      console.error('Error updating banner:', err);
      setError('Failed to update banner. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(banner) {
    if (window.confirm(`Are you sure you want to delete "${banner.name}"?`)) {
      try {
        setLoading(true);
        await bannersAPI.deleteBanner(banner._id || banner.id);
        setBanners(prev => prev.filter(b => (b._id || b.id) !== (banner._id || banner.id)));
      } catch (err) {
        console.error('Error deleting banner:', err);
        setError('Failed to delete banner. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  }

  function handleCancel() {
    setMode('view');
    setEditingBanner(null);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <Image className="text-green-600" size={36} />
            🍚 Rice Deal - Banner Management
          </h1>
          <p className="text-gray-600">
            Manage promotional banners for your rice products
          </p>
        </div>

        {/* Add Form Modal */}
        {mode === 'add' && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="w-full max-w-2xl">
              <BannerForm
                onSave={handleAdd}
                onCancel={handleCancel}
                title="Add New Banner"
              />
            </div>
          </div>
        )}

        {/* Edit Form Modal */}
        {mode === 'edit' && editingBanner && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="w-full max-w-2xl">
              <BannerForm
                banner={editingBanner}
                onSave={handleUpdate}
                onCancel={handleCancel}
              />
            </div>
          </div>
        )}

        {/* Add Button */}
        {mode === 'view' && (
          <div className="mb-6">
            <button
              onClick={() => setMode('add')}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 shadow-md hover:shadow-lg transition-all"
            >
              <Plus size={18} />
              Add New Banner
            </button>
          </div>
        )}

        {/* Banners Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              Banners ({banners.length})
            </h2>
          </div>
          <Table
            columns={columns}
            data={banners}
            actions={actions}
            emptyMessage="No banners found. Add your first banner to get started!"
            loading={loading}
          />
        </div>
        
{/* Stats Summary */}
        {banners.length > 0 && (
          <div className="mt-6 bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between text-green-800">
              <span className="font-medium">
                Total Banners: {banners.length}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Banner;