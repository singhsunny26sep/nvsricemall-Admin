// ====== FILE 1: VideoBannerForm.jsx ======
import { useState } from 'react';
import { Save, X, Video, Upload } from 'lucide-react';

const VideoBannerForm = ({ 
  videobanner = null, 
  onSave, 
  onCancel,
  title = "Add New Video Banner"
}) => {
  const [formData, setFormData] = useState({
    title: videobanner?.title || '',
    description: videobanner?.description || '',
    videoUrl: videobanner?.videoUrl || '',
    thumbnailUrl: videobanner?.thumbnailUrl || '',
    link: videobanner?.link || '',
    status: videobanner?.status || 'active',
    position: videobanner?.position || '1'
  });

  const [thumbnailPreview, setThumbnailPreview] = useState(videobanner?.thumbnailUrl || '');
  const [videoPreview, setVideoPreview] = useState(videobanner?.videoUrl || '');

  const isEditing = !!videobanner;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
        setFormData({ ...formData, thumbnailUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoPreview(reader.result);
        setFormData({ ...formData, videoUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!formData.title.trim() || (!formData.videoUrl && !formData.thumbnailUrl)) return;
    
    const videoBannerData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      videoUrl: formData.videoUrl,
      thumbnailUrl: formData.thumbnailUrl,
      link: formData.link.trim(),
      status: formData.status,
      position: parseInt(formData.position)
    };

    if (isEditing) {
      onSave({ ...videobanner, ...videoBannerData });
    } else {
      onSave(videoBannerData);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Video className="text-green-600" size={24} />
        {isEditing ? 'Edit Video Banner' : title}
      </h2>
      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Banner Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="e.g., Premium Basmati Rice Collection"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            rows="3"
            placeholder="Enter banner description"
          />
        </div>

        {/* Video Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Upload size={16} />
            Upload Video *
          </label>
          <input
            type="file"
            name="video"
            onChange={handleVideoChange}
            accept="video/*"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          {videoPreview && (
            <div className="mt-3">
              <video 
                src={videoPreview} 
                controls 
                className="w-full max-w-md rounded-md border border-gray-300"
              />
            </div>
          )}
        </div>

        {/* Thumbnail Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <Upload size={16} />
            Thumbnail Image
          </label>
          <input
            type="file"
            name="thumbnail"
            onChange={handleThumbnailChange}
            accept="image/*"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          {thumbnailPreview && (
            <div className="mt-3">
              <img 
                src={thumbnailPreview} 
                alt="Thumbnail Preview" 
                className="w-48 h-32 object-cover rounded-md border border-gray-300"
              />
            </div>
          )}
        </div>

        {/* Link and Position */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link URL
            </label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="https://example.com/products"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Position
            </label>
            <input
              type="number"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="1"
              min="1"
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="active"
                checked={formData.status === 'active'}
                onChange={handleChange}
                className="w-4 h-4 text-green-600 focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">Active</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="inactive"
                checked={formData.status === 'inactive'}
                onChange={handleChange}
                className="w-4 h-4 text-gray-600 focus:ring-gray-500"
              />
              <span className="text-sm text-gray-700">Inactive</span>
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 pt-4">
          <button
            onClick={handleSubmit}
            disabled={!formData.title.trim() || (!formData.videoUrl && !formData.thumbnailUrl)}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <Save size={16} />
            {isEditing ? 'Update' : 'Save'}
          </button>
          <button
            onClick={onCancel}
            className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
          >
            <X size={16} />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoBannerForm;
