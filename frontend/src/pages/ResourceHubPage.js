import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '../components/ui/dialog';
import { 
  Upload, 
  Play, 
  Pause, 
  Volume2, 
  Download, 
  Heart,
  BookOpen,
  Video,
  Music,
  Search,
  Filter,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const ResourceHubPage = () => {
  const { user } = useAuth();
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [uploadData, setUploadData] = useState({
    title: '',
    description: '',
    category: 'mindfulness'
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const categories = [
    { id: 'all', label: 'All Resources', icon: BookOpen },
    { id: 'mindfulness', label: 'Mindfulness', icon: Heart },
    { id: 'anxiety', label: 'Anxiety Relief', icon: Heart },
    { id: 'depression', label: 'Depression Support', icon: Heart },
    { id: 'sleep', label: 'Sleep & Rest', icon: Heart },
    { id: 'motivation', label: 'Motivation', icon: Heart },
    { id: 'relaxation', label: 'Relaxation', icon: Heart }
  ];

  // Sample pre-existing resources
  const sampleResources = [
    {
      id: 'sample-1',
      title: 'Guided Breathing Meditation',
      description: 'A 10-minute guided breathing exercise to help reduce anxiety and promote calm.',
      file_type: 'audio',
      category: 'mindfulness',
      is_public: true,
      uploaded_by: 'system',
      file_path: '/uploads/sample-breathing.mp3',
      created_at: new Date('2024-01-15').toISOString()
    },
    {
      id: 'sample-2',
      title: 'Progressive Muscle Relaxation',
      description: 'Learn to relax your body systematically with this guided audio session.',
      file_type: 'audio',
      category: 'relaxation',
      is_public: true,
      uploaded_by: 'system',
      file_path: '/uploads/sample-pmr.mp3',
      created_at: new Date('2024-01-10').toISOString()
    },
    {
      id: 'sample-3',
      title: 'Understanding Anxiety - Educational Video',
      description: 'An informative video explaining anxiety, its symptoms, and coping strategies.',
      file_type: 'video',
      category: 'anxiety',
      is_public: true,
      uploaded_by: 'system',
      file_path: '/uploads/sample-anxiety.mp4',
      created_at: new Date('2024-01-05').toISOString()
    },
    {
      id: 'sample-4',
      title: 'Sleep Meditation for Students',
      description: 'A calming meditation designed specifically to help students fall asleep easier.',
      file_type: 'audio',
      category: 'sleep',
      is_public: true,
      uploaded_by: 'system',
      file_path: '/uploads/sample-sleep.mp3',
      created_at: new Date('2024-01-01').toISOString()
    }
  ];

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    filterResources();
  }, [resources, searchTerm, selectedCategory]);

  const fetchResources = async () => {
    try {
      const response = await axios.get('/resources');
      // Combine API resources with sample resources
      const allResources = [...sampleResources, ...response.data];
      setResources(allResources);
    } catch (error) {
      console.error('Failed to fetch resources:', error);
      // If API fails, just use sample resources
      setResources(sampleResources);
    } finally {
      setLoading(false);
    }
  };

  const filterResources = () => {
    let filtered = resources;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(resource => resource.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(resource =>
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredResources(filtered);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'audio/mp3', 'audio/wav', 'audio/ogg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a valid video or audio file');
        return;
      }

      // Validate file size (50MB limit)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        toast.error('File size must be less than 50MB');
        return;
      }

      setSelectedFile(file);
    }
  };

  const uploadResource = async () => {
    if (!selectedFile || !uploadData.title) {
      toast.error('Please fill in all required fields and select a file');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('title', uploadData.title);
      formData.append('description', uploadData.description);
      formData.append('category', uploadData.category);
      formData.append('file', selectedFile);

      await axios.post('/resources/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Resource uploaded successfully!');
      setShowUploadDialog(false);
      setUploadData({ title: '', description: '', category: 'mindfulness' });
      setSelectedFile(null);
      fetchResources();
    } catch (error) {
      console.error('Failed to upload resource:', error);
      toast.error('Failed to upload resource. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (fileType) => {
    return fileType === 'video' ? <Video className="w-5 h-5" /> : <Music className="w-5 h-5" />;
  };

  const getCategoryColor = (category) => {
    const colors = {
      mindfulness: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      anxiety: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      depression: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      sleep: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      motivation: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      relaxation: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Resource Hub
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Access therapeutic videos, guided meditations, and educational content
            </p>
          </div>
          
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                <Plus className="w-4 h-4 mr-2" />
                Upload Resource
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Upload New Resource</DialogTitle>
                <DialogDescription>
                  Share a therapeutic video or audio file with the community
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={uploadData.title}
                    onChange={(e) => setUploadData({...uploadData, title: e.target.value})}
                    placeholder="Enter resource title"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={uploadData.description}
                    onChange={(e) => setUploadData({...uploadData, description: e.target.value})}
                    placeholder="Describe this resource..."
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={uploadData.category}
                    onChange={(e) => setUploadData({...uploadData, category: e.target.value})}
                    className="w-full p-2 border rounded-md"
                  >
                    {categories.slice(1).map(category => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="file">File *</Label>
                  <Input
                    id="file"
                    type="file"
                    accept="video/*,audio/*"
                    onChange={handleFileSelect}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Supported formats: MP4, AVI, MOV, MP3, WAV, OGG (Max: 50MB)
                  </p>
                  {selectedFile && (
                    <p className="text-sm text-green-600 mt-1">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button onClick={uploadResource} disabled={uploading}>
                  {uploading ? (
                    <div className="flex items-center">
                      <div className="loading-spinner mr-2"></div>
                      Uploading...
                    </div>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Resource
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              className="pl-10"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border rounded-md bg-white dark:bg-gray-800"
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <TabsTrigger key={category.id} value={category.id} className="text-xs">
                  <IconComponent className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">{category.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      {/* Resources Grid */}
      {filteredResources.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Resources Found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {searchTerm || selectedCategory !== 'all'
                ? 'Try adjusting your search criteria'
                : 'No resources available yet'
              }
            </p>
            {!searchTerm && selectedCategory === 'all' && (
              <Button onClick={() => setShowUploadDialog(true)}>
                Upload First Resource
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="resource-grid">
          {filteredResources.map((resource) => (
            <Card key={resource.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                      {getFileIcon(resource.file_type)}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-1">{resource.title}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getCategoryColor(resource.category)}>
                          {categories.find(c => c.id === resource.category)?.label || resource.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {resource.file_type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <CardDescription className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                  {resource.description}
                </CardDescription>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <span>
                    {new Date(resource.created_at).toLocaleDateString()}
                  </span>
                  <span>
                    By {resource.uploaded_by === 'system' ? 'MindMate' : 'Community'}
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600">
                    <Play className="w-4 h-4 mr-2" />
                    {resource.file_type === 'video' ? 'Watch' : 'Listen'}
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Video className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {filteredResources.filter(r => r.file_type === 'video').length}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Videos</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Music className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {filteredResources.filter(r => r.file_type === 'audio').length}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Audio Files</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Heart className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {filteredResources.filter(r => r.category === 'mindfulness').length}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Mindfulness</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <BookOpen className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {filteredResources.length}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Resources</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResourceHubPage;