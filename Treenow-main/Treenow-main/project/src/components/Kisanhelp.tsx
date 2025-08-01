import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Camera } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

interface Disease {
  _id: string;
  name: string;
  images: string[];
  symptoms: string[];
  solutions: string[];
  category: string;
  tree: string[];
  products: {
    _id: string;
    name: string;
    images: string;
    description: string;
  }[];
}


interface PredictionResult {
  treeType: string;
  disease: string;
  imageUrl: string;
}

export default function CropDiseasesPage() {

  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDisease, setSelectedDisease] = useState<Disease | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const navigate = useNavigate();
  const { diseaseId } = useParams<{ diseaseId: string }>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const diseaseResponse = await axios.get(`${import.meta.env.VITE_BACKEND_SERVER}/api/diseases`);
        setDiseases(diseaseResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

 
  useEffect(() => {
    if (diseaseId && diseases.length > 0) {
      const found = diseases.find((d) => d._id === diseaseId);
      setSelectedDisease(found || null);
    } else if (!diseaseId) {
      setSelectedDisease(null);
    }
  }, [diseaseId, diseases]);

 
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(
        'https://nill07.app.n8n.cloud/webhook-test/183a9edf-afca-4bf5-865c-2b213f091b83',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );

      const { imageUrl, prediction: result } = response.data;

      setImage(imageUrl);
      setPrediction(result);

      
      const matchedDisease = diseases.find(
        (d) => d.name.toLowerCase() === result.disease.toLowerCase(),
      );
      if (matchedDisease) {
        navigate(`/krishi-help/${matchedDisease._id}`);
      }

      alert('✅ Image processed successfully!');
    } catch (error) {
      console.error('Error processing image:', error);
      alert('❌ Failed to process image.');
    }
  };

  if (loading) return <p className='text-center text-gray-600'>Loading data...</p>;

  return (
    <div className='max-w-6xl mx-auto px-4 py-8'>
      <h2 className='text-3xl font-bold text-center text-green-700'>
        🌱 Crop Diseases & Tree Types
      </h2>

      <div className='flex justify-center my-4'>
        <label className='flex items-center gap-2 cursor-pointer bg-gray-200 p-2 rounded-lg'>
          <Camera />
          <span>Upload Image</span>
          <input type='file' accept='image/*' className='hidden' onChange={handleImageUpload} />
        </label>
      </div>

      {image && (
        <img src={image} alt='Uploaded' className='w-full max-h-64 object-cover rounded my-4' />
      )}

      {prediction && (
        <div className='bg-white shadow-md rounded-lg p-6 mt-4'>
          <h3 className='text-2xl font-bold text-green-600'>Prediction Result:</h3>
          <p className='mt-2 text-lg text-gray-700'>
            🌳 <strong>Tree Type:</strong> {prediction.treeType}
          </p>
          <p className='mt-2 text-lg text-red-700'>
            🦠 <strong>Disease:</strong> {prediction.disease}
          </p>
        </div>
      )}

      {selectedDisease ? (
        <div className='mt-6 bg-white shadow-lg rounded-lg p-6'>
          <button
            onClick={() => navigate('/krishi-help')}
            className='mb-4 bg-red-500 text-white px-4 py-2 rounded'
          >
            🔙 Back
          </button>
          <h2 className='text-2xl font-bold '>{selectedDisease.name}</h2>
          <div className='flex gap-4 overflow-x-auto'>
            {selectedDisease.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${selectedDisease.name} ${idx + 1}`}
                className='h-60 w-auto rounded shadow'
              />
            ))}
          </div>
          <h3 className='text-2xl font-semibold mt-3 text-red-700'>{selectedDisease.name}</h3>
          <h4 className='text-lg font-semibold mt-4 text-gray-700'>Symptoms:</h4>
          <ul className='list-disc pl-6 text-gray-600'>
            {selectedDisease.symptoms.map((symptom, index) => (
              <li key={index}>{symptom}</li>
            ))}
          </ul>
          <h4 className='text-lg font-semibold mt-4 text-gray-700'>Solutions:</h4>
          <ul className='list-disc pl-6 text-gray-600'>
            {selectedDisease.solutions.map((solution, index) => (
              <li key={index}>{solution}</li>
            ))}
          </ul>
          <h4 className='text-lg font-semibold mt-4 text-gray-700'>Category:</h4>
          <p className='text-gray-600'>{selectedDisease.category}</p>
          <h4 className='text-lg font-semibold mt-4 text-gray-700'>Related Products:</h4>
          <div className='flex flex-wrap gap-4 mt-2'>
            {selectedDisease.products && selectedDisease.products.length > 0 ? (
              selectedDisease.products.map((product) => (
                <div
                  key={product._id}
                  className='cursor-pointer bg-gray-100 rounded-lg p-4 shadow hover:shadow-lg transition'
                  onClick={() => navigate(`/products/${product._id}`)}
                >
                  <img
                    src={product.images}
                    alt={product.name}
                    className='h-20 w-20 object-cover rounded mb-2'
                  />
                  <p className='font-semibold'>{product.name}</p>
                  <p className='text-sm text-gray-500'>{product.description}</p>
                </div>
              ))
            ) : (
              <p className='text-gray-500'>No products found for this disease.</p>
            )}
          </div>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-6'>
          {diseases.map((disease) => (
            <div
              key={disease._id}
              onClick={() => navigate(`/krishi-help/${disease._id}`)}
              className='cursor-pointer bg-white shadow-lg rounded-lg p-4 hover:shadow-xl transition-transform transform hover:scale-105'
            >
              <img
                src={disease.images && disease.images.length > 0 ? disease.images[0] : ''}
                alt={disease.name}
                className='w-full h-40 object-cover rounded'
              />
              <h3 className='text-xl font-semibold mt-3 text-red-700'>{disease.name}</h3>
              <p className='text-gray-500 text-sm'>Click to view details</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
