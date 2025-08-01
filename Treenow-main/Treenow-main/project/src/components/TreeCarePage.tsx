import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Tree {
  _id: string;
  name: string;
  scientificName: string;
  image: string;
  description: string;
  watering: string;
  sunlight: string;
  spacialCare: string;
  pruning: string;
  fertilization: string;
  price?: number;
}

interface Disease {
  _id: string;
  name: string;
  images: string[];
  symptoms: string[];
  tree?: string[]; 
}

export default function TreeCarePage() {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTree, setSelectedTree] = useState<Tree | null>(null);
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [loadingDiseases, setLoadingDiseases] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrees = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_SERVER}/api/trees`);
        setTrees(response.data);
      } catch (error) {
        setError('Failed to load trees.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrees();
  }, []);

useEffect(() => {
  if (!selectedTree) return;

  const controller = new AbortController();

  const fetchDiseases = async () => {
    setLoadingDiseases(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_SERVER}/api/diseases?tree=${selectedTree._id}`,
        { signal: controller.signal },
      );
      setDiseases(response.data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request cancelled:', error.message);
      } else {
        console.error('❌ Error fetching diseases:', error);
        setDiseases([]);
      }
    } finally {
      setLoadingDiseases(false);
    }
  };

  fetchDiseases();

  return () => controller.abort(); 
}, [selectedTree]);


  const diseasesForTree =
    selectedTree && diseases.length > 0
      ? diseases.filter(
          (disease) =>
            Array.isArray(disease.tree) &&
            disease.tree.some((treeItem) =>
              typeof treeItem === 'string'
                ? treeItem === selectedTree._id
                : treeItem._id === selectedTree._id,
            ),
        )
      : [];

  const filteredTrees = trees.filter(
    (tree) =>
      tree.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tree.scientificName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (loading) return <p className='text-center text-gray-600 text-xl'>🌱 Loading trees...</p>;
  if (error) return <p className='text-center text-red-500 text-xl'>{error}</p>;

  return (
    <div className='max-w-7xl mx-auto px-4 py-8 bg-gray-100 rounded-lg shadow-lg'>
      <h2 className='text-4xl font-bold text-center text-green-700 mb-6'>
        🌳 Tree Care & Information
      </h2>
      <div className='flex justify-center my-6'>
        <input
          type='text'
          placeholder='🔍 Search by tree name or scientific name...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='border border-gray-400 px-4 py-3 rounded-lg w-full md:w-1/2 text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500'
        />
      </div>

      {selectedTree ? (
        <div className='mt-6 bg-white shadow-xl rounded-lg p-6'>
          <button
            onClick={() => setSelectedTree(null)}
            className='mb-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition'
          >
            🔙 Back
          </button>
          <img
            src={selectedTree.image}
            alt={selectedTree.name}
            className='w-full h-72 object-cover rounded shadow-lg'
          />
          <h3 className='text-3xl font-semibold mt-3 text-green-800'>
            {selectedTree.name}{' '}
            <span className='text-gray-500'>({selectedTree.scientificName})</span>
          </h3>
          <p className='text-gray-700 mt-4 text-lg leading-relaxed'>{selectedTree.description}</p>
          <div className='mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-lg'>
            <p>
              <strong>💧 Watering:</strong> {selectedTree.watering}
            </p>
            <p>
              <strong>☀️ Sunlight:</strong> {selectedTree.sunlight}
            </p>
            <p>
              <strong>🌱 Special Care:</strong> {selectedTree.spacialCare}
            </p>
            <p>
              <strong>✂️ Pruning:</strong> {selectedTree.pruning}
            </p>
            <p>
              <strong>🧪 Fertilization:</strong> {selectedTree.fertilization}
            </p>
            {selectedTree.price && (
              <p className='text-green-700 font-bold'>💰 Price: ${selectedTree.price}</p>
            )}
          </div>
          <h3
            className='text-xl font-semibold mt-6 text-red-600 cursor-pointer hover:underline'
            onClick={() => navigate('/krishi-help', { state: { tree: selectedTree } })}
          >
            🦠 Diseases Affecting This Tree
          </h3>
          {loadingDiseases ? (
            <p className='text-gray-600'>Loading diseases...</p>
          ) : diseasesForTree.length > 0 ? (
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
              {diseasesForTree.map((disease) => (
                <div
                  key={disease._id}
                  onClick={() => navigate(`/krishi-help/${disease._id}`)}
                  className='cursor-pointer bg-red-100 p-4 rounded-lg shadow hover:bg-red-200 transition'
                >
                  <h4 className='font-semibold text-red-600'>{disease.name}</h4>
                  <div className='flex gap-2 mt-2 overflow-x-auto'>
                    {disease.images.slice(0, 3).map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`${disease.name} ${idx + 1}`}
                        className='h-20 w-20 object-cover rounded shadow'
                      />
                    ))}
                  </div>
                  <p className='text-gray-600 text-sm'>{disease.symptoms.join(', ')}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-gray-500'>No diseases found for this tree.</p>
          )}
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-6'>
          {filteredTrees.length === 0 ? (
            <p className='text-center text-gray-500 text-lg'>No trees found for "{searchTerm}"</p>
          ) : (
            filteredTrees.map((tree) => (
              <div
                key={tree._id}
                onClick={() => setSelectedTree(tree)}
                className='cursor-pointer bg-white shadow-lg rounded-lg p-5 hover:shadow-xl transition-transform transform hover:scale-105 overflow-hidden'
              >
                <img
                  src={tree.image}
                  alt={tree.name}
                  className='w-full h-48 object-cover rounded-lg shadow-md'
                />
                <h3 className='text-2xl font-semibold mt-3 text-green-800'>{tree.name}</h3>
                <p className='text-gray-600 text-sm'>{tree.scientificName}</p>
                <p className='text-gray-500 mt-2 text-lg'>
                  {tree.description.substring(0, 100)}...
                </p>
                <button className='bg-green-600 text-white py-2 px-4 rounded mt-3 hover:bg-green-700 transition'>
                  🌿 Read More
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
