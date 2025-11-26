import React, { useState } from 'react';
import { Plus, Calendar, User, Heart, Phone, Briefcase } from 'lucide-react';
import NeonButton from './NeonButton';
import { Birthday } from '../types';

interface AddBirthdayFormProps {
  onAdd: (birthday: Birthday) => void;
}

const RELATIONSHIP_OPTIONS = [
  'Официант',
  'Кухня',
  'Мойка',
  'Админ',
  'Папа',
  'Мама',
  'Брат',
  'Сестра',
  'Кошка',
  'Собака',
  'Свой вариант'
];

const AddBirthdayForm: React.FC<AddBirthdayFormProps> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [phone, setPhone] = useState('');
  const [relationshipType, setRelationshipType] = useState(RELATIONSHIP_OPTIONS[0]);
  const [customRelationship, setCustomRelationship] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !date) return;

    const finalRelationship = relationshipType === 'Свой вариант' ? customRelationship : relationshipType;

    const newBirthday: Birthday = {
      id: crypto.randomUUID(),
      name,
      date,
      relationship: finalRelationship || 'Семья',
      phoneNumber: phone
    };

    onAdd(newBirthday);
    setName('');
    setDate('');
    setPhone('');
    setRelationshipType(RELATIONSHIP_OPTIONS[0]);
    setCustomRelationship('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-md border-2 border-amber-600/30 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative overflow-hidden group rounded-sm">
      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-500/20 to-transparent -mr-8 -mt-8 rotate-45"></div>
      
      <h2 className="text-2xl font-mafia text-amber-700 mb-6 uppercase tracking-widest border-b border-amber-200 pb-2">
        Новый член Семьи
      </h2>

      <div className="space-y-4">
        {/* Name */}
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-700/50 w-5 h-5" />
          <input
            type="text"
            placeholder="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-orange-50/50 border border-amber-200 text-amber-900 pl-10 pr-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder-amber-900/40 rounded-sm"
            required
          />
        </div>

        {/* Date */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-700/50 w-5 h-5" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-orange-50/50 border border-amber-200 text-amber-900 pl-10 pr-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder-amber-900/40 rounded-sm"
            required
          />
        </div>

        {/* Phone */}
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-700/50 w-5 h-5" />
          <input
            type="tel"
            placeholder="Телефон (+7...)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full bg-orange-50/50 border border-amber-200 text-amber-900 pl-10 pr-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder-amber-900/40 rounded-sm"
          />
        </div>

        {/* Relationship Select */}
        <div className="relative">
          <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-700/50 w-5 h-5" />
          <select 
            value={relationshipType}
            onChange={(e) => setRelationshipType(e.target.value)}
            className="w-full bg-orange-50/50 border border-amber-200 text-amber-900 pl-10 pr-8 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all appearance-none rounded-sm"
          >
            {RELATIONSHIP_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-amber-700/50 text-xs">▼</div>
        </div>

        {/* Custom Relationship Input */}
        {relationshipType === 'Свой вариант' && (
          <div className="relative animate-in fade-in slide-in-from-top-2 duration-300">
            <Heart className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-700/50 w-5 h-5" />
            <input
              type="text"
              placeholder="Укажите роль..."
              value={customRelationship}
              onChange={(e) => setCustomRelationship(e.target.value)}
              className="w-full bg-orange-50/50 border border-amber-200 text-amber-900 pl-10 pr-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all placeholder-amber-900/40 rounded-sm"
            />
          </div>
        )}

        <NeonButton type="submit" variant="primary" icon={<Plus className="w-5 h-5" />} className="w-full mt-4">
          Внести в список
        </NeonButton>
      </div>
    </form>
  );
};

export default AddBirthdayForm;