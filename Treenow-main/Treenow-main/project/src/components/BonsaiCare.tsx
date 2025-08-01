import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Bonsai {
  _id: string;
  name: string;
  scientificName: string;
  image: string;
  owner: string;
  link: string;
  age: string;
  description: string;
  watering: string;
  sunlight: string;
  specialCare: string;
  pruning: string;
  fertilization: string;
  price?: number;
}

const BonsaiList = ({
  bonsaiItems,
  selectBonsai,
}: {
  bonsaiItems: Bonsai[];
  selectBonsai: (bonsai: Bonsai) => void;
}) => (
  <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-6'>
    {bonsaiItems.map((item) => (
      <div
        key={item._id}
        className='bg-white shadow-lg rounded-lg p-4 cursor-pointer hover:shadow-2xl'
        onClick={() => selectBonsai(item)}
      >
        <img src={item.image} alt={item.name} className='w-full h-60 object-cover rounded' />
        <h3 className='text-xl font-semibold mt-3'>{item.name}</h3>
        <p className='text-gray-600'>{item.description.slice(0, 60)}...</p>
        {item.price && <p className='text-green-600 font-bold mt-2'>Rs.{item.price}</p>}
        <button className='bg-green-600 text-white py-2 px-4 rounded mt-3 hover:bg-green-700'>
          Learn More
        </button>
      </div>
    ))}
  </div>
);

const BonsaiDetails = ({ bonsai, goBack }: { bonsai: Bonsai; goBack: () => void }) => (
  <div className='bg-white shadow-lg rounded-lg p-6 mt-6'>
    <button className='text-green-600 underline mb-4' onClick={goBack}>
      ← Back to Bonsai List
    </button>
    <img src={bonsai.image} alt={bonsai.name} className='w-50 h-100 object-cover rounded' />
    <h3 className='text-2xl font-bold mt-4'>
      {bonsai.name} ({bonsai.scientificName})
    </h3>
    <p className='text-gray-600 mt-2'>{bonsai.description}</p>
    <p>
      <strong>🌿 Owner:</strong> {bonsai.owner}
    </p>
    <p>
      <strong>🔗 More Info:</strong>{' '}
      <a
        href={bonsai.link}
        target='_blank'
        rel='noopener noreferrer'
        className='text-blue-600 underline'
      >
        Click here
      </a>
    </p>
    <p>
      <strong>⏳ Age:</strong> {bonsai.age}
    </p>
    <div className='mt-4 p-4 border rounded-lg bg-gray-100'>
      <h4 className='text-lg font-semibold'>🌱 Bonsai Care Guide</h4>
      <p>
        <strong>💧 Watering:</strong> {bonsai.watering}
      </p>
      <p>
        <strong>☀️ Sunlight:</strong> {bonsai.sunlight}
      </p>
      <p>
        <strong>✂️ Pruning:</strong> {bonsai.pruning}
      </p>
      <p>
        <strong>🌿 Fertilization:</strong> {bonsai.fertilization}
      </p>
      <p>
        <strong>✨ Special Care:</strong> {bonsai.specialCare}
      </p>
    </div>
    {bonsai.price && (
      <p className='text-green-600 font-bold text-lg mt-4'>Rs. Price: Rs.{bonsai.price}</p>
    )}
    <button
      className='bg-green-700 text-white py-2 px-4 rounded mt-4 hover:bg-green-800'
      onClick={() => alert('Feature coming soon!')}
    >
      {bonsai.price ? 'Buy Now' : 'More Info'}
    </button>
  </div>
);

export default function BonsaiPage() {
  const [bonsaiItems, setBonsaiItems] = useState<Bonsai[]>([]);
  const [selectedBonsai, setSelectedBonsai] = useState<Bonsai | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBonsaiItems = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_SERVER}/bonsai`);
        setBonsaiItems(response.data);
      } catch (error) {
        console.log(error);
        setError('Failed to load bonsai data.');
      } finally {
        setLoading(false);
      }
    };
    fetchBonsaiItems();
  }, []);

  if (loading) return <p className='text-center text-gray-600'>Loading Bonsai items...</p>;
  if (error) return <p className='text-center text-red-500'>{error}</p>;

  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>
      <h2 className='text-3xl font-bold text-center text-green-700'>
        Bonsai Collection & Care Guide
      </h2>
      {!selectedBonsai ? (
        <BonsaiList bonsaiItems={bonsaiItems} selectBonsai={setSelectedBonsai} />
      ) : (
        <BonsaiDetails bonsai={selectedBonsai} goBack={() => setSelectedBonsai(null)} />
      )}
    </div>
  );
}
