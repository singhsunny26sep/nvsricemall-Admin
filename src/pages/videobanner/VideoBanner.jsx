

import { useState } from 'react';
import { Plus, Edit, Trash2, Video,  Eye, EyeOff } from 'lucide-react';
import VideoBannerForm from './VideoBannerForm';

import Table from '../../components/models/Table';

const VideoBanner = () => {
  const [videobanners, setVideobanners] = useState([
    { 
      id: 1, 
      title: 'Premium Basmati Rice Collection', 
      description: 'Discover our finest selection of aged basmati rice',
      videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
      link: '/products/basmati',
      status: 'active',
      position: 1
    },
    { 
      id: 2, 
      title: 'Organic Rice Varieties', 
      description: 'Farm fresh organic rice for healthy living',
      videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
      link: '/products/organic',
      status: 'active',
      position: 2
    },
    { 
      id: 3, 
      title: 'Special Festive Offers', 
      description: 'Limited time deals on bulk orders',
      videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
      link: '/offers',
      status: 'inactive',
      position: 3
    }
  ]);

  const [mode, setMode] = useState('view');
  const [editingVideobanner, setEditingVideobanner] = useState(null);
  const [nextId, setNextId] = useState(4);

  const columns = [
    {
      key: 'id',
      header: 'ID',
      className: 'whitespace-nowrap font-medium text-green-600'
    },
    {
      key: 'thumbnailUrl',
      header: 'Thumbnail',
      className: 'whitespace-nowrap',
      render: (thumbnailUrl,Thumbnail) => (
        <img
          src={thumbnailUrl || "/api/placeholder/40/40"}
          alt={Thumbnail}
          className="rounded-full w-10 h-10 object-cover"
          onError={(e) => {
            e.target.src = '/api/placeholder/40/40';
          }}
        />
      )
    },
    {
      key: 'title',
      header: 'Title',
      className: 'whitespace-nowrap font-semibold'
    },
    {
      key: 'description',
      header: 'Description',
      className: 'text-gray-600 max-w-xs truncate'
    },
    {
      key: 'position',
      header: 'Position',
      className: 'whitespace-nowrap text-center font-medium'
    },
    {
      key: 'status',
      header: 'Status',
      className: 'whitespace-nowrap'
    }
  ];

  const actions = [
    {
      icon: <Edit size={16} />,
      onClick: handleEdit,
      className: 'text-green-600 hover:text-green-900 hover:bg-green-100',
      title: 'Edit Video Banner'
    },
    {
      icon: <Trash2 size={16} />,
      onClick: handleDelete,
      className: 'text-red-600 hover:text-red-900 hover:bg-red-100',
      title: 'Delete Video Banner'
    }
  ];

  function handleAdd(videobannerData) {
    const newVideobanner = {
      id: nextId,
      ...videobannerData
    };
    setVideobanners([...videobanners, newVideobanner]);
    setNextId(nextId + 1);
    setMode('view');
  }

  function handleEdit(videobanner) {
    setEditingVideobanner(videobanner);
    setMode('edit');
  }

  function handleUpdate(updatedVideobanner) {
    setVideobanners(videobanners.map(vb =>
      vb.id === updatedVideobanner.id ? updatedVideobanner : vb
    ));
    setMode('view');
    setEditingVideobanner(null);
  }

  function handleDelete(videobanner) {
    if (window.confirm(`Are you sure you want to delete "${videobanner.title}"?`)) {
      setVideobanners(videobanners.filter(vb => vb.id !== videobanner.id));
    }
  }

  function handleCancel() {
    setMode('view');
    setEditingVideobanner(null);
  }

  const activeCount = videobanners.filter(vb => vb.status === 'active').length;
  const inactiveCount = videobanners.filter(vb => vb.status === 'inactive').length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <Video className="text-green-600" size={36} />
            🍚 Rice Deal - Video Banner Management
          </h1>
          <p className="text-gray-600">
            Manage promotional video banners for your rice products
          </p>
        </div>

        {/* Add Form Modal */}
        {mode === 'add' && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="w-full max-w-2xl">
              <VideoBannerForm
                onSave={handleAdd}
                onCancel={handleCancel}
                title="Add New Video Banner"
              />
            </div>
          </div>
        )}

        {/* Edit Form Modal */}
        {mode === 'edit' && editingVideobanner && (
          <div className="fixed inset-0 backdrop-blur-sm bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="w-full max-w-2xl">
              <VideoBannerForm
                videobanner={editingVideobanner}
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
              Add New Video Banner
            </button>
          </div>
        )}

        {/* Video Banners Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              Video Banners ({videobanners.length})
            </h2>
          </div>
          <Table
            columns={columns}
            data={videobanners}
            actions={actions}
            emptyMessage="No video banners found. Add your first video banner to get started!"
          />
        </div>

        {/* Stats Summary */}
        {videobanners.length > 0 && (
          <div className="mt-6 bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between text-green-800">
              <span className="font-medium">
                Total Video Banners: {videobanners.length}
              </span>
              <span className="text-sm">
                Active: {activeCount} | Inactive: {inactiveCount}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoBanner;