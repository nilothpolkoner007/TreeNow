import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Pencil, Trash2 } from 'lucide-react';

interface Tree {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  category: string;
}

interface Disease {
  _id: string;
  name: string;
  scientificName?: string;
  image?: string;
  tree?: Tree[]; // array of trees
  symptoms?: string[];
  solutions?: string[];
  category?: string;
  products?: Product[];
  images?: string[];
}

const AdminDiseaseForm: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [treeId, setTreeId] = useState<string[]>([]);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [solutions, setSolutions] = useState<string[]>([]);
  const [productIds, setProductIds] = useState<string[]>([]);
  const [categoryId, setCategoryId] = useState<string>('');
  const [trees, setTrees] = useState<Tree[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [imageLinks, setImageLinks] = useState<string[]>(['']);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const [treesRes, productsRes, diseasesRes] = await Promise.all([
          axios.get<Tree[]>(`${import.meta.env.VITE_BACKEND_SERVER}/trees`, config),
          axios.get<Product[]>(`${import.meta.env.VITE_BACKEND_SERVER}/products`, config),
          axios.get<Disease[]>(`${import.meta.env.VITE_BACKEND_SERVER}/diseases`, config),
        ]);

        setTrees(treesRes.data);
        setProducts(productsRes.data);
        setCategories([...new Set(productsRes.data.map((p) => p.category))]);
        setDiseases(diseasesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage('Failed to load trees, products, or diseases.');
      }
    };
    fetchData();
  }, []);

  const filteredProducts = useMemo(
    () => (categoryId ? products.filter((p) => p.category === categoryId) : []),
    [categoryId, products],
  );

  const handleImageChange = (index: number, value: string) => {
    setImageLinks((prev) => prev.map((img, i) => (i === index ? value : img)));
  };

  const handleEdit = async (diseaseId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Unauthorized: Please login as an admin.');
      return;
    }

    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_SERVER}/diseases/${diseaseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setName(data.name);
      // Support both array and single object for tree
      if (Array.isArray(data.tree)) {
        setTreeId(data.tree.map((t: Tree) => t._id));
      } else if (data.tree && data.tree._id) {
        setTreeId([data.tree._id]);
      } else {
        setTreeId([]);
      }
      setSymptoms(data.symptoms || []);
      setSolutions(data.solutions || []);
      setProductIds(data.products ? data.products.map((p: Product) => p._id) : []);
      setImageLinks(data.images && data.images.length > 0 ? data.images : ['']);
      setEditId(diseaseId);
    } catch (error) {
      console.error('Error fetching disease for edit:', error);
      setMessage('Failed to load disease for editing.');
    }
  };

  const handleDelete = async (diseaseId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Unauthorized: Please login as an admin.');
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_SERVER}/diseases/${diseaseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage('Disease deleted successfully!');
      setDiseases((prev) => prev.filter((disease) => disease._id !== diseaseId));
      if (editId === diseaseId) {
        setEditId(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error deleting disease:', error);
      setMessage('Failed to delete disease.');
    }
  };

  const resetForm = () => {
    setName('');
    setTreeId([]);
    setSymptoms([]);
    setSolutions([]);
    setProductIds([]);
    setCategoryId('');
    setImageLinks(['']);
    setEditId(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!imageLinks[0].trim()) {
      setMessage('❌ At least one image is required.');
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    try {
      let response;
      if (editId) {
        response = await axios.put(
          `${import.meta.env.VITE_BACKEND_SERVER}/diseases/${editId}`,
          {
            name,
            tree: treeId,
            symptoms,
            solutions,
            category: categoryId,
            products: productIds,
            images: imageLinks.filter((link) => link.trim()),
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setDiseases((prev) =>
          prev.map((disease) => (disease._id === editId ? response.data : disease)),
        );
        setMessage('✅ Disease updated successfully!');
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_BACKEND_SERVER}/diseases`,
          {
            name,
            tree: treeId,
            symptoms,
            solutions,
            category: categoryId,
            products: productIds,
            images: imageLinks.filter((link) => link.trim()),
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setDiseases((prev) => [...prev, response.data]);
        setMessage('✅ Disease added successfully!');
      }

      resetForm();
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      console.error('Error:', error);
      setMessage(error.response?.data?.message || 'Failed to add/update disease.');
    }
    setLoading(false);
  };

  return (
    <div className='max-w-2xl mx-auto bg-white shadow-md rounded-lg p-6'>
      <h2 className='text-2xl font-semibold text-center mb-4'>
        {editId ? 'Edit Disease' : 'Add New Disease'}
      </h2>
      {message && (
        <p
          className={`text-center ${message.startsWith('✅') ? 'text-green-600' : 'text-red-500'}`}
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} className='space-y-4'>
        <input
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder='Disease Name'
          className='w-full p-2 border rounded'
        />
        <div>
          <select
            value=''
            onChange={(e) => {
              const selectedId = e.target.value;
              if (selectedId && !treeId.includes(selectedId)) {
                setTreeId([...treeId, selectedId]);
              }
            }}
            className='w-full p-2 border rounded'
          >
            <option value=''>-- Select Tree --</option>
            {trees.map((tree) => (
              <option key={tree._id} value={tree._id}>
                {tree.name}
              </option>
            ))}
          </select>
          <div className='flex flex-wrap gap-2 mt-2'>
            {treeId.map((id) => {
              const tree = trees.find((t) => t._id === id);
              if (!tree) return null;
              return (
                <span
                  key={id}
                  className='bg-green-100 text-green-800 px-2 py-1 rounded flex items-center'
                >
                  {tree.name}
                  <button
                    type='button'
                    className='ml-2 text-red-500'
                    onClick={() => {
                      setTreeId(treeId.filter((tid) => tid !== id));
                    }}
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        </div>
        <input
          type='text'
          value={symptoms.join(', ')}
          onChange={(e) => setSymptoms(e.target.value.split(',').map((s) => s.trim()))}
          required
          placeholder='Symptoms'
          className='w-full p-2 border rounded'
        />
        <input
          type='text'
          value={solutions.join(', ')}
          onChange={(e) => setSolutions(e.target.value.split(',').map((s) => s.trim()))}
          required
          placeholder='Solutions'
          className='w-full p-2 border rounded'
        />
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
          className='w-full p-2 border rounded'
        >
          <option value=''>-- Select Category --</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select
          multiple
          value={productIds}
          onChange={(e) =>
            setProductIds([...e.target.selectedOptions].map((option) => option.value))
          }
          className='w-full p-2 border rounded'
        >
          {filteredProducts.map((product) => (
            <option key={product._id} value={product._id}>
              {product.name}
            </option>
          ))}
        </select>
        {imageLinks.map((link, index) => (
          <div key={index} className='flex items-center space-x-2'>
            <input
              type='text'
              value={link}
              onChange={(e) => handleImageChange(index, e.target.value)}
              className='w-full p-2 border rounded'
            />
            {index > 0 && (
              <button
                type='button'
                onClick={() => setImageLinks((prev) => prev.filter((_, i) => i !== index))}
                className='p-2 bg-red-500 text-white rounded'
              >
                ❌
              </button>
            )}
          </div>
        ))}
        <button
          type='button'
          onClick={() => setImageLinks([...imageLinks, ''])}
          className='mt-2 p-2 bg-blue-500 text-white rounded'
        >
          ➕ Add More Images
        </button>
        <div className='flex gap-2'>
          <button
            type='submit'
            className={`w-full p-2 rounded ${
              loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
            disabled={loading}
          >
            {loading
              ? editId
                ? 'Updating...'
                : 'Adding...'
              : editId
              ? 'Update Disease'
              : 'Add Disease'}
          </button>
          {editId && (
            <button
              type='button'
              className='w-full p-2 rounded bg-gray-500 text-white'
              onClick={resetForm}
              disabled={loading}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* ✅ Disease List */}
      <h3 className='text-lg font-semibold'>🌿 Diseases</h3>
      {diseases.map((disease) => (
        <div
          key={disease._id}
          className='p-4 bg-gray-100 rounded-lg mb-4 flex justify-between items-center'
        >
          <div>
            <p>
              <strong>Name:</strong> {disease.name}
            </p>
            <p>
              <strong>Scientific Name:</strong> {disease.scientificName || '-'}
            </p>
          </div>
          <div className='flex items-center space-x-2'>
            {disease.images && disease.images[0] && (
              <img
                src={disease.images[0]}
                alt={disease.name}
                className='h-16 w-16 object-cover rounded'
              />
            )}
            <button
              onClick={() => handleEdit(disease._id)}
              className='text-blue-500 hover:text-blue-700'
            >
              <Pencil className='h-5 w-5' />
            </button>
            <button
              onClick={() => handleDelete(disease._id)}
              className='text-red-500 hover:text-red-700'
            >
              <Trash2 className='h-5 w-5' />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminDiseaseForm;
